# 1 Technische Kurzbeschreibung

## 1.1 Allgemeines

### 1.1.1 Angaben zum Fahrzeug

| Fahrzeugparameter | Spezifikation / Wert |
| :--- | :--- |
| **Marke** | BERTONE (I) |
| **Typ** | 128AS1 |
| **Tag der Erstzulassung** | 1983 |
| **Fahrzeugklasse** | M1 |
| **Bezeichnung** | Bertone X1/9e <br> umgerüstet auf batterieelektrischen Antrieb (BEV) <br>durch Privatperson |
| **Kraftübertragung** | Durch konventionelles Getriebe |
| **Betriebsspannung HV-Batterie** | 114 V DC |

!!! info "Zusätzliche Informationen zur Fahrzeugtechnik"
    Die Bremsanlage (ohne Unterdruckkraftverstärker) und Lenkung (ohne Servo) des Basisfahrzeugs bleiben mechanisch und hydraulisch unangetastet. Die Beheizung der Frontscheibe wurde durch ein elektrisches System ersetzt.

### 1.1.2 Name und Anschrift des Umrüsters

Frank Hielscher, 97816 Lohr a. Main

---

## 1.2 Antriebssystem (Powertrain)

**Systembezeichnung:** NetGain HyPer 9 IS™ (Integrated System)

### 1.2.1 Elektromotor (Antriebsmotor)

| Parameter | Spezifikation |
| :--- | :--- |
| **Hersteller** | NetGain Motors, Inc. (Gefertigt durch: SME S.p.A., Italien) |
| **Modell / Typ** | HyPer 9™ (SRIPM - Synchronous Reluctance Internal Permanent Magnet) |
| **Nennspannung** | 100 V |
| **Nennstrom** | 350 A |
| **Nenndrehzahl** | 3.200 U/min (S1-Dauerbetrieb) |
| **Maximaldrehzahl** | 8.000 U/min |

### 1.2.2 Inverter / Motor Controller

| Parameter | Spezifikation |
| :--- | :--- |
| **Hersteller** | SME S.p.A., Italien |
| **Modell** | AC-X1 80/100V 750A SWS |
| **Type Code** | ACX1S75000000 |
| **Rating Data** | 80/100V, 750 A (Maximalstrom) |

---

### 1.2.3 Zusammenfassende Leistungsdaten des Gesamtsystems (Eintragungswerte)

| Leistungsdaten | Wert / Zustand |
| :--- | :--- |
| **Maximale 30-Minuten-Leistung** | 38 kW (Dauerleistung gemäß Herstellerangabe Systemintegrator NetGain; abgeleitet aus S1-Betrieb) |
| **Maximale Nutzleistung** | 95 kW (Spitzenleistung) |
| **Maximales Drehmoment** | 234 Nm <br>*(Hinweis: Begrenzung via Controller-Mapping auf **154 Nm** zum Schutz des Original-Getriebes parametriert, siehe Abschnitt 6)* |

---

## 1.3 Energiespeichersystem REESS

### 1.3.1 Technische Daten

| Parameter | Spezifikation / Angabe |
| :--- | :--- |
| **Hersteller (Zellen)** | Panasonic |
| **Hersteller (Module)** | TESLA (gebrauchte Module aus TESLA Model S mit je 5,3 kWh) |
| **Typ (Zellen)** | NCR18650B, NCA (Nickel-Cobalt-Aluminium) |
| **Anzahl und Anordnung der Module** | 5 Module, aufgeteilt in einen 2er-Pack und einen 3er-Pack (jeweils in separatem Gehäuse) |
| **Zellkonfiguration pro Modul** | 6S74P |
| **Zellkonfiguration Gesamt** | 30S74P |
| **Zellenanzahl** | 2220 |
| **Nennspannung** | 114 V DC (3,8 V/Zelle x 30 Zellen in Serie) |
| **Ladeschlussspannung** | 126 V DC (4,2 V/Zelle x 30 Zellen in Serie) |
| **Abschaltspannung** | 90 V DC (3,0 V/Zelle x 30 Zellen in Serie) |
| **Kapazität** | 232 Ah (26,5 kWh) |
| **Höchststrom** | 870 A (10 Sek.) |
| **Batteriemanagementsystem (BMS)** | SimpBMS (Master-Slave-System mit TESLA Slave Boards) |
| **Überladeschutz** | Integriert im BMS (automatische Abschaltung) |
| **Überhitzungsschutz** | 2 Temperatursensoren pro Modul und Notabschaltung durch BMS |
| **Thermomanagement** | **Typ:** Aktive Flüssigkeitskühlung<br>**Konstruktion:** Die Kühlung erfolgt über Kühlschleifen, die direkt entlang der Zellen innerhalb jedes Moduls geführt sind.<br>**Verschaltung:** Alle Kühlkreisläufe der einzelnen Module sind parallel geschaltet, um eine gleichmäßige Temperaturverteilung zu gewährleisten.<br>**Medium:** G48 (Glysantin) korrosionsgeschützt und frostsicher |
| **Gehäusematerial** | Aluminium |
| **Gewicht (gesamt)** | 185 kg |
| **Maintenance Service Disconnect (MSD)** | **Typ:** NISTAR NI4-1-S630-2NYA (je Batteriepack).<br>**Funktion:** Trennt bei Entfernung die interne Serienschaltung der Module und senkt, insbesondere beim 3er-Pack, dadurch die Spannung auf Kleinspannungsniveau (< 60V DC). |
| **Sicherung** | EATON BUSSMANN EBSD-630A (je Batteriepack) |


### 1.3.2 Schematische Darstellung des Funktionsbereiches

<figure id="schaltschema">
  <img src="./Pictures/10000001000001AE000001E644E7AB05.png" alt="Schaltschema Batterie Pack">
  <figcaption>Abbildung 1: Schaltschema des Batterie-Packs</figcaption>
</figure>

### 1.3.3 Beschreibung, Zeichnungen oder Bilder des REESS mit Erläuterungen zu folgenden Punkten

- **Aufbau Tesla 5,3 kWh Modul** (5 x vorhanden):

![TESLA 5,3 kWh
Modul](./Pictures/10000001000003EF0000029355764FB8.png){alt="Zeichnung 2: TESLA 5,3 kWh Modul"
"}

- Darstellung Battery Pack Aufbau (2 x vorhanden):

![Pack mit zwei Modulen (Deckel
entfernt)](./Pictures/10000001000002FF00000275EB32AD3B.png){alt="Zeichnung 3: Pack mit zwei Modulen (Deckel entfernt)"
"}

#### 1.3.4 Battery Pack rear (Aufbau, Werkstoffe und physische Abmessungen)

Eigenbau, basierend auf zwei gebrauchten TESLA Model S 5,3 kWh Modulen   inkl. HV-Buchse mit HVIL Kontakten, MSD und HV-Relais, integrierter Kühlkreislauf, Notentlüftungs- & Druckausgleichselement.

| Parameter | Spezifikation / Angabe |
| :-------- | :--------------------- |
| **Konstruktion:** | Seitenwände aus 28 mm x 240 mm Aluminium-Systemprofil verschraubt mit <br> Front- und Rückseite aus 6 mm Aluminiumplatten. <br> Deckel- und Boden aus 5 mm Aluminiumplatten. |
  | **Abdichtung:** |  Neopren Zellkautschuk CR-150 |
  | **Abmessung:** | 340 mm x 240 mm x 788 mm |
  | **Gewicht:** | 80 kg |
  | **Kapazität:** | 10,6 kWh |
  | **Nennspannung:** | 45,6 V |

#### 1.3.5 Battery Pack front (Aufbau, Werkstoffe und physische Abmessungen)

  Eigenbau, basierend auf drei gebrauchten TESLA Model S 5,3 kWh Modulen inkl. HV-Buchse mit HVIL Kontakten, MSD und HV-Relais, integrierter   Kühlkreislauf, Notentlüftungs- & Druckausgleichselement.

| Parameter | Spezifikation / Angabe |
| :-------- | :--------------------- |
| **Konstruktion:** | Seitenwände aus 28 mm Aluminium-Systemprofil verschraubt mit <br> Front- und Rückseite aus 6 mm Aluminiumplatten. <br> Deckel- und Boden aus 5 mm Aluminiumplatten. |
  | **Abdichtung:** | Neopren Zellkautschuk CR-150 |
  | **Abmessung:** | 340 mm x 320 mm x 788 mm |
  | **Gewicht:** | 105 kg |
  | **Kapazität:** | 15,9 kWh |
  | **Nennspannung:**| 68,4 V |

### 1.3.6 Beschreibung und Zeichnungen des Einbaus des REESS im Fahrzeug:

![Zeichnung 4: Seitenansicht Bertone X1/9 Platzierung der Batterie
Packs](./Pictures/10000001000004780000018607BE8E65.png "fig:")![Zeichnung 5: Draufsicht Bertone X1/9 Platzierung
Batterie
Module](./Pictures/10000001000002E10000014B954768BF.png "fig:")

### 1.3.7 Mechanische Integration und Crashsicherheit (REESS-Befestigung)

Die physische Integration der Batteriegehäuse im Fahrzeug wurde unter Berücksichtigung der statischen und dynamischen Lastanforderungen konstruiert:

* **Vorderer Batterie-Pack (3er-Modulblock):** Die Platzierung erfolgt im vorderen Kofferraum. Die mechanische Verbindung mit der Karosserie wird über vier hochfeste Stahlwinkel realisiert. Diese sind mit jeweils zwei M8-Schrauben am Pack-Gehäuse sowie mit 7/16" UNF-Schrauben am Fahrzeug-Zwischenboden und der Spritzwand verschraubt. Zur flächigen Lasteinleitung in das Karosserieblech kommen großflächige, FIA-konforme Gurt-Verstärkungsplatten aus Stahl auf den Außenseiten zum Einsatz.
* **Hinterer Batterie-Pack (2er-Modulblock):** Die Montage erfolgt im Motorraum oberhalb des Getriebes (Position des ehemaligen Zylinderkopfs/Einspritzanlage). Zur Befestigung werden die fahrzeugseitigen Original-Aufnahmepunkte der oberen Werks-Motoraufhängung genutzt.

---

### 1.3.8 Thermomanagement und elektronische Steuerung

| Systemkomponente | Technische Ausführung / Spezifikation |
| :--- | :--- |
| **Typ der Wärmeregelung** | **Geschlossener Flüssigkeitskreislauf** bestehend aus:<br>• Wärmetauscher: THERMOTEC D7W073TT<br>• Umwälzpumpe: Original Tesla Wasserpumpe<br>• Ausgleichsbehälter und EPDM-Kühlschläuche (8 x 3,5 mm)<br>• Kühlmedium: G48 (frost- und korrosionsgeschützt) |
| **Elektronische Steuerung (BMS)** | **SimpBMS (Master-Slave-System)**<br>Kommunikation und Überwachung erfolgt über die originalen Tesla Slave-Boards direkt auf den Modulen. |
| **Überladeschutz** | **Integriert (Hardware & Software):** Automatische Trennung der HV-Schütze bei Erreichen der parametrierten Zell-Ladeschlussspannung durch das SimpBMS. |
| **Überhitzungsschutz** | **Redundante Temperaturüberwachung:** Kontinuierliche Erfassung über zwei Sensoren pro Modul. Bei Überschreitung der Grenztemperatur erfolgt eine automatische Notabschaltung des Gesamtsystems. |

---

## 1.4 Ladesystem

| Parameter | Spezifikation / Angabe |
| :--- | :--- |
| **Ladeanschluss** | Typ 2 („Mennekes“) nach IEC 62196 |
| **Ladebetriebsart** | Mode 2 und Mode 3 |
| **Maximale Ladeleistung** | 3,3 kW |
| **Ladespannung** | 230 V AC (einphasig, 16 A) |
| **Ladezeit (SOC 0–100 %)** | Ca. 8 Stunden für vollständige Ladung |
| **Sicherheitsfunktionen** | Automatische Verriegelung des Ladekabels im Injektor während des Ladevorgangs |

---

## 1.5 Hochvolt-Leitungen

| Parameter | Spezifikation / Angabe |
| :--- | :--- |
| **Leitungsart** | Geschirmte, einadrige, flexible Hochvolt-Leitungen (Orange, ISO 19642)<br>• Halogenfrei und flammwidrig<br>• Doppelt isoliert |
| **Leitermaterial** | Kupfer (Cu) |
| **Isolationsmaterial** | Vernetztes Polyethylen (VPE / XLPE) |

---

## 1.6 Sicherheitskomponenten

| Parameter | Spezifikation / Angabe |
| :--- | :--- |
| **Isolationsüberwachung (IMD)** | **BENDER iso165C-1**<br>Kontinuierliche Überwachung des Isolationswiderstands zwischen dem aktiven HV-Kreis und der Fahrzeugmasse (Kl. 31).<br>• Vorwarnung: 400 kΩ<br>• Hauptalarm (Abschaltung): 250 kΩ |
| **Hochvolt-Relais (Schütze)** | Allpolige (Plus- und Minusseite) galvanische Trennung des REESS durch integrierte HV-Schütze. Die Ansteuerung erfolgt redundant durch das BMS, die LV-Bordnetzspannung und die HVIL-Sicherheitskette. |
| **High-Voltage Interlock (HVIL)** | **Echtzeit-Sicherheitskreis:** Eine durchgehende Niedervolt-Schleife überwacht alle HV-Steckverbindungen. Bei physischer Entriegelung eines Steckers wird die HVIL-Kette unterbrochen und die HV-Schütze fallen sofort ab. |

---

## 1.7 Elektrisches Netzsystem

**Ausführung:** Isoliertes Netz (IT-System)

!!! info "Schnittstelle zur Ladeinfrastruktur (Schutzleiter PE)"
    Es erfolgt fahrzeugseitig keine separate Überwachung des Schutzleiters (PE) im reinen IT-Fahrnetz. Die Schutzleiterverbindung wird beim Ladevorgang durch die externe Wallbox über das standardisierte Typ-2-Ladekabel hergestellt. Es wird regulatorisch vorausgesetzt, dass die speisende Ladeinfrastruktur einen normgerechten Schutzleiter bereitstellt und diesen eigenständig überwacht.

---

## 1.8 Gewichtsbilanz und Achslasten

### 1.8.1 Referenzwerte aus dem Fahrzeugschein (Serienzustand vor Umbau)

| Parameter | Zulässiger Wert |
| :--- | :--- |
| **Leergewicht** | 970 kg |
| **Zulässige Achslast vorne** | 510 kg |
| **Zulässige Achslast hinten** | 700 kg |
| **Zulässiges Gesamtgewicht** | 1200 kg |

### 1.8.2 Ermittelte Ist-Werte (Radlastwaage nach EV-Umbau)

| Parameter | Gemessener Ist-Wert |
| :--- | :--- |
| **Ist-Gewicht Vorderachse** | 440 kg |
| **Ist-Gewicht Hinterachse** | 480 kg |
| **Neues Gesamt-Leergewicht** | 995 kg |

---

### 1.8.3 Umbaukonzept und Gewichtsverteilung (Zuladung)

Aufgrund der klassischen Mittelmotor-Architektur des Basisfahrzeugs und der strengen gesetzlichen Limitierung der vorderen Achslast auf maximal 510 kg wurde bei der Umrüstung besonderer Wert auf eine gesetzeskonforme, ausgewogene Gewichtsverteilung gelegt. 

### 1.8.4 Bauliche Maßnahmen zur Einhaltung der Achslasten

Um eine Überladung der Vorderachse im regulären Fahr- und Passagierbetrieb konstruktiv auszuschließen, steht der vordere Gepäckraum durch die feste Positionierung des vorderen Batterie-Packs (105 kg) für weiteres Gepäck nicht mehr zur Verfügung. Er ist baulich so dimensioniert, dass er rein funktionsbedingt nur noch der Aufnahme des originalen Targa-Dachs dient.

Zum Ausgleich der Transportkapazität wurde der Heckbereich modifiziert. Der durch den vollständigen Entfall der Abgasanlage freigewordene Bauraum unterhalb des hinteren Kofferraums wurde genutzt, um das hintere Gepäckraumvolumen spürbar zu erweitern (Gewinn von ca. 70 Litern).