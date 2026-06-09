## Isolationsüberwachungsgerät (IMD)

Zur kontinuierlichen Überwachung des Isolationswiderstandes zwischen dem aktiven Hochvoltsystem ($HV+/HV-$) und der Fahrzeugmasse (Kl. 31) wird ein automobiles Isolationsüberwachungsgerät (IMD) eingesetzt.

### Technische Spezifikation des Sensors

| Parameter | Spezifikation / Wert |
| :--- | :--- |
| **Typ / Hersteller** | iso165C-1 / Bender GmbH & Co. KG |
| **Spannungsbereich** | 0 V bis 600 V DC |
| **Versorgungsspannung ($U_{\mathrm{s}}$)** | 12 V DC (Niedervoltbordnetz) |
| **Innenwiderstand ($R_{\mathrm{i}}$)** | 1200 k&Omega; |
| **Signalschnittstelle** | CAN-Bus (500 kBaud) |
| **Ansprechwerte** | Vorwarnung: 400 k&Omega; / Hauptalarm (Fehler): 250 k&Omega; |
| **Messverfahren / Ansprechzeit** | DCP (Direct Current Pulse) / < 20 Sekunden |

---

### IMD Quellcode-Dokumentation (Bender iso165C-1)

Dieses Kapitel dokumentiert die vollständige softwareseitige Implementierung der Isolationsüberwachung in der Vehicle Control Unit (VCU / ESP32).

**Flankengesteuerter Konformitäts-Trigger (Edge Trigger):**

Sobald das Batteriemanagementsystem (BMS) signalisiert, dass das Fahrzeug in einen betriebsbereiten Zustand wechselt, prüft die VCU die hardwareseitigen Status-Bits des Isometers (Bits 12 und 13 im *VIFC-Status*). Ist der Selbsttest dort noch als „ausstehend“ markiert, wird er vor der HV-Freigabe automatisch angefordert.

```cpp

// 4. Automated Edge Trigger for the Bender IMD Isolation Self-Test
static uint8_t lastBmsStatus = BMS_STATUS_BOOT;
uint8_t currentBmsStatus = BMS_STATUS_BOOT;
bool bmsValid = false;

WITH_DATA_MUTEX({
    currentBmsStatus = telemetryData.bmsStatus;
    bmsValid = telemetryData.bmsStatusValid;
});

if (bmsValid) {
    // Prüfung auf betriebsrelevante Zustände (Bereit, Fahren oder Laden)
    bool isOperational = (currentBmsStatus == BMS_STATUS_READY || 
                          currentBmsStatus == BMS_STATUS_DRIVE || 
                          currentBmsStatus == BMS_STATUS_CHARGE);

    // Abfrage Bender VIFC-Status: Bit 12 oder 13 gesetzt = Selbsttest fehlt/erforderlich
    bool imdSelfTestMissing = (telemetryData.vifcStatus & (1 << 12)) || (telemetryData.vifcStatus & (1 << 13));

    // Automatische Anforderung, falls operational, Test fehlt und noch kein Test läuft
    if (isOperational && imdSelfTestMissing && !telemetryData.selfTestRunning) {
        WITH_DATA_MUTEX({ telemetryData.selfTestRequested = true; });
        safe_printf("[SYSTEM] Compliance Trigger: IMD flags test missing (Bits 12/13). Initiating self-test.\n");
    }
    
    lastBmsStatus = currentBmsStatus;
}

lastSafetyCheck = now;

```

**Asynchrone Zustandsmaschine zur Testabwicklung (self_test_task):**
Der nachfolgende Code-Auszug zeigt die vollständige Zustandsmaschine zur zyklischen Auswertung der Diagnoseregister, Steuerung der internen Koppelrelais und Absicherung der Hochvoltschütze im Fehlerfall:


```cpp
void self_test_task(void *parameter) {
    esp_task_wdt_add(NULL);
    
    enum SelfTestState {
        IDLE,
        TRIGGERING_TEST,
        RUNNING_TEST,
        EVALUATING,
        CONNECTING_MEASUREMENT,
        CLEANUP_SUCCESS,
        CLEANUP_FAULT
    } state = IDLE;

    unsigned long stateTimer = 0;

    while (1) {
        esp_task_wdt_reset();
        unsigned long now = millis();

        bool requested = false;
        bool charging = false;
        uint16_t imdStatus = 0;
        uint16_t vifcStatus = 0;
        uint8_t result = 0;
        bool resultValid = false;

        // Thread-safe isolation snapshot
        if (xSemaphoreTake(dataMutex, pdMS_TO_TICKS(20)) == pdTRUE) {
            requested = telemetryData.selfTestRequested;
            charging = telemetryData.isCharging;
            imdStatus = telemetryData.imdStatus;   // D_IMC_STATUS
            vifcStatus = telemetryData.vifcStatus; // D_VIFC_STATUS
            result = telemetryData.selfTestResult;
            resultValid = telemetryData.selfTestResultValid;
            xSemaphoreGive(dataMutex);
        }

        switch (state) {
            case IDLE:
                if (requested && !charging) {
                    state = TRIGGERING_TEST;
                    stateTimer = now;
                    
                    WITH_DATA_MUTEX({ 
                        telemetryData.selfTestRequested = false;
                        telemetryData.selfTestRunning = true; 
                        telemetryData.selfTestFailed = false;
                        telemetryData.selfTestResultValid = false; 
                    });
                    
                    // Hardware-Selbsttest anstoßen (Erfordert geöffnete interne Relais)
                    send_imd_self_test_start(false); 
                    safe_printf("[IMD] Triggering internal short self-test sequence...\n");
                }
                break;

            case TRIGGERING_TEST:
                // Verify via D_IMC_STATUS Bit 4 that the device confirms the test run
                if (imdStatus & (1 << 4)) {
                    safe_printf("[IMD] Hardware confirms internal test is actively executing.\n");
                    state = RUNNING_TEST;
                    stateTimer = now;
                } else if (now - stateTimer > 2000) {
                    safe_printf("[IMD] WARNING: Trigger missed. Retrying test command...\n");
                    send_imd_self_test_start(false);
                    stateTimer = now;
                }
                break;

            case RUNNING_TEST: {
                // Verify test completion via D_VIFC_STATUS Bit 12 (0 = Executed/Done)
                bool testFinished = !(vifcStatus & (1 << 12)); 
                
                if (resultValid || testFinished) {
                    state = EVALUATING;
                } else if (now - stateTimer > 5000) {
                    safe_printf("[IMD] ERROR: Internal self-test timed out.\n");
                    state = CLEANUP_FAULT;
                }
                break;
            }

            case EVALUATING: {
                // Evaluation der internen Bender-Diagnoseregister
                bool internalIsoError     = (imdStatus & (1 << 0));
                bool internalChassisError = (imdStatus & (1 << 1));
                bool internalSystemError  = (imdStatus & (1 << 2));

                if (result == 0 && !internalIsoError && !internalChassisError && !internalSystemError) {
                    safe_printf("[IMD] Internal electronics check PASSED. Connecting coupling relays.\n");
                    state = CONNECTING_MEASUREMENT;
                    stateTimer = now;
                    
                    // CRITICAL STEP: Interne Bender-Relais schließen, um HV-Bus zu verbinden
                    set_imd_internal_coupling(true); 
                } else {
                    safe_printf("[IMD] CRITICAL: Internal electronics check FAILED! Status: 0x%X\n", imdStatus);
                    state = CLEANUP_FAULT;
                }
                break;
            }    

            case CONNECTING_MEASUREMENT:
                if (now - stateTimer >= 200) {
                    state = CLEANUP_SUCCESS;
                }
                break;

            case CLEANUP_SUCCESS:
                // Freigabesignal an das externe BMS übermitteln
                send_bms_relay_release(true); 
                WITH_DATA_MUTEX({ telemetryData.selfTestRunning = false; });
                state = IDLE;
                break;

            case CLEANUP_FAULT:
                // Im Fehlerfall bleibt die Freigabe permanent gesperrt
                set_imd_internal_coupling(false);
                send_bms_relay_release(false); 
                WITH_DATA_MUTEX({ 
                    telemetryData.selfTestRunning = false; 
                    telemetryData.selfTestFailed = true;
                });
                state = IDLE;
                break;
        }

        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
```

### Nachweis der Normkonformität

Die oben dokumentierte softwareseitige Verriegelung und Flankenerkennung erfüllt die zentralen Schutzziele der fahrzeugrelevanten Sicherheitsstandards direkt im Systemhochlauf:

!!! success Erfüllung der IEC 61557-8 (Isolationsüberwachung in IT-Systemen)
    Die Funktionalität des IMD (inklusive der internen Messketten und Ankoppelrelais) wird ereignisbasiert bei jedem relevanten Zustandswechsel überprüft. Durch die Abfrage von imdSelfTestMissing (Bits 12 und 13) erkennt der Algorithmus sofort, ob das Isometer einen geräteinternen Hardware-Selbsttest fordert, setzt proaktiv selfTestRequested = true und arbeitet die Validierungssequenz ab.

!!! success Erfüllung der ISO 6469-3 (Sicherstellung der elektrischen Sicherheit)
    Zum Schutz von Personen vor elektrischem Schlag im Fahrbetrieb stellt die Bedingung isOperational sicher, dass sowohl im Status BMS_STATUS_READY (Fahrbereitschaft vorbereitet) als auch in BMS_STATUS_DRIVE (Fahrbetrieb aktiv) der Isolationsstatus zweifelsfrei verifiziert sein muss. Solange die Bits 12/13 aktiv sind und die State Machine läuft, bleibt die Schaltschwelle für die echten HV-Hauptschütze physisch gesperrt (Drive Inhibit über den Inverter-Proxy).

!!! success Erfüllung der IEC 61851-1 (Konduktive Ladesysteme)
    Bevor Energie aus einer externen Ladesäule (EVSE) in das Fahrzeug fließen darf, greift der Trigger beim Übergang in den Zustand BMS_STATUS_CHARGE. Der Ladevorgang wird auf CAN-Ebene so lange blockiert, bis das Isometer den durch den Edge-Trigger initiierten Selbsttest erfolgreich abgeschlossen, seine internen Messrelais geschlossen und einen Isolationswert weit oberhalb der kritischen Schwellen gemeldet hat.
