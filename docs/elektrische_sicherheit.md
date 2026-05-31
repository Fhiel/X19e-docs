# Elektrische Sicherheit

Die elektrische Sicherheit des umgerüsteten Fahrzeugs wurde gemäß den Maßgaben der DGUV 200-005 als HV-eigensicheres Fahrzeug ausgelegt, um einen vollständigen Berührungs- und Lichtbogenschutz des Hochvolt-Systems zu gewährleisten. Die Umsetzung folgt den Anforderungen der UN-Regelung Nr. 100 in ihrer aktuell gültigen Fassung.

Um die geforderte HV-Eigensicherheit zu erreichen, wurden folgende Maßnahmen umgesetzt:

1. **Sicherheitsgerichtete Abschaltung des HV-Systems**
    * Die **kontrollierte Spannungsfreischaltung** des HV-Systems erfolgt durch Batterie-Hauptrelais (Contactor) am Plus- und Minuspol **jedes Batteriepacks**. Diese Schütze (SMR – System Main Relay) werden vom Batteriemanagementsystem (SimpBMS) gesteuert.
    * Bei **kritischen Fehlern** oder drastischen Grenzwertverletzungen werden die Hauptschütze unmittelbar geöffnet, was eine sofortige galvanische Trennung des HV-Stromkreises zur Folge hat.
    * Ein **Isolationsfehler** wird durch das Isolationsüberwachungssystem (IMD) kontinuierlich detektiert und führt zur Startblockierung.
    * Bei einem internen **Kurzschluss** innerhalb des HV-Systems wird die Überstromsicherung (Hauptsicherung) zerstört, wodurch der Kurzschluss unterbrochen und das Hochvoltsystem passiv abgeschaltet wird. Dies stellt eine **sekundäre Schutzmaßnahme** dar und ergänzt die primäre Sicherheitslogik.

2. **Lichtbogen- und Berührschutz**
    * Alle HV-Kabelverbindungen, die aus den REESS-Gehäusen herausführen, sind in **lichtbogensicherer Ausführung** über berührgeschützte Steckverbinder realisiert. Schraubverbindungen werden ausschließlich innerhalb der geschützten Gehäuse verwendet.
    * Eine **Pilotlinie (HV-Interlock - HVIL)** wurde installiert. Diese 12-Volt-Ringleitung verbindet alle HV-Steckverbinder und Maintenance Service Disconnect (MSD)-Einrichtungen. Sie gewährleistet, dass das HV-System bei Manipulation oder unbedachtem Trennen von Komponenten augenblicklich spannungsfrei schaltet wird, bevor ein direkter kontakt zu spannungsführenden Teilen möglich ist.

3. **Potentialausgleich und elektromagnetische Verträglichkeit**
    * Alle Gehäuse des REESS, der HV-Distribution und die Schirmungen der HV-Leitungen sind miteinander und mit der Fahrzeugmasse (Karosserie) **elektrisch leitend verbunden und geerdet**, um einen sicheren Potentialausgleich zu gewährleisten und die elektromagnetische Verträglichkeit sicherzustellen.

4. **Schutz gegen direktes Berühren (IP-Schutzklassen)**
    * Alle spannungsführenden HV-Komponenten sind gemäß den Anforderungen der UN-Regelung Nr. 100 mit den folgenden Schutzgraden gegen direktes Berühren umgesetzt:
        * **IPXXD (drahtsicher):** Im Fahrgast- und Laderaum
        * **IPXXB (fingersicher):** Am Rest des Fahrzeugs.
    
    **Sicherstellung durch HVIL und MSD:**
    * **HVIL-Steckverbinder:** Bei getrennten HVIL-Steckverbindern (z. B. an den Batteriepacks) wird durch die sofortige Unterbrechung der Pilotlinie und die daraus resultierende Abschaltung der Schütze sichergestellt, dass die verbleibende Spannung **innerhalb einer Sekunde auf unter 60 V DC absinkt**. Dies verhindert eine Gefährdung beim Trennen von Hochvoltkomponenten am Fahrzeug.
    * **Maintenance Service Disconnect (MSD):** Jeder Batteriepack ist mit einem MSD ausgestattet. Diese können **ohne Werkzeug** gezogen werden und erfüllen im getrennten Zustand die Berührschutzanforderung nach **IPXXB**, wodurch ein sicheres Arbeiten am Fahrzeug ermöglicht wird.

5. **Kennzeichnung von Abdeckung und Gehäuse der HV-Komponenten**
    * Auf allen Abdeckungen und Gehäusen, deren Entfernung eine Berührung spannungsführender HV-Komponenten ermöglichen würde, ist ein Warnsymbol gemäß „Warnung vor gefährlicher elektrischer Spannung“ angebracht.

<figure id="warning">
  <img src="../Pictures/1000000100000240000000457D57448F.png">
  <figcaption style="text-align: center;">Abbildung 1: Warnung vor gefährlicher elektrischer Spannung</figcaption>
</figure>

* Alle HV-Leitungen, die nicht direkt in geschlossenen Gehäusen verlegt sind, besitzen eine intensiv orangefarbene Außenhülle zur sofortigen, eindeutigen Erkennbarkeit.

---

## Isolationsüberwachungssystem (IMD)

Zur kontinuierlichen Überwachung des galvanisch getrennten Hochvoltsystems (IT-Netz) is ein **BENDER iso165C-1** Isolationsüberwachungssystem (IMD) integriert. Das System überwacht permanent den Isolationswiderstand ($R_{\mathrm{iso}}$) zwischen allen spannungsführenden HV-Komponenten (Plus- und Minusseite) und der Fahrzeugmasse (Karosserie, Kl. 31).

Damit wird die geforderte **Ein-Fehler-Toleranz** nach VdTÜV-Merkblatt 764 vollumfänglich erfüllt: Ein erster, einfacher Isolationsfehler führt nicht zu einer unmittelbaren Gefährdung, sondern wird zuverlässig detektiert und signalisiert.

### Parametrierte Schwellenwerte und Signalisierung

Die Reaktion des Fahrzeugs auf eine Veränderung des Isolationszustandes ist zweistufig ausgeführt:

| Sicherheitsstufe | Widerstandswert | Systemreaktion / Signalisierung im Cockpit |
| :--- | :--- | :--- |
| **Normalzustand** | $> 400\text{ k}\Omega$ | System arbeitet im Nennbereich. Keine optische oder akustische Warnung. |
| **Stufe 1: Vorwarnung** | $\le 400\text{ k}\Omega$ | **Optische Signalisierung:** Auf dem Kombi-Instrument wird permanent die Statusmeldung „ISO WARN“ ausgegeben. Der Fahrbetrieb bleibt uneingeschränkt möglich. |
| **Stufe 2: Hauptalarm** | $\le 250\text{ k}\Omega$ | **Interventionsschwelle:** Auf dem Kombi-Instrument wird das Signal „ISO ERR“ visualisiert. Ein Schließen der HV-Schütze (Startvorgang) wird bei diesem Wert systemseitig blockiert. |

*Hinweis: Eine detaillierte Aufschlüsselung der Displaymeldungen auf den Anzeigegeräten befindet sich im entsprechenden Kapitel der Bedienelemente.*

---

### Systemintegration und zweistufige Zuschaltlogik (Precharge)

Das Hochvoltsystem verfügt über eine sequenzielle Zuschaltlogik. Diese gewährleistet einen lastfreien Start der internen Batterieschütze sowie eine normgerechte Vorschaltladung (Precharge) der Zwischenkreiskondensatoren des Inverters, um schädliche Einschaltströme (Lichtbögen) zu verhindern.

Ein fehlerfreier Isolationswiderstand ($R_{\mathrm{iso}} > 250\text{ k}\Omega$) ist die zwingende logische Voraussetzung (Interlock) für die Einleitung der folgenden Start-Sequenz:

1. **Zuschaltung REESS (Lastfrei):** Bei Aktivierung der Startbereitschaft (Klemme 15) schließt das Batteriemanagementsystem (SimpBMS) zunächst die allpoligen Schütze innerhalb der beiden Batteriepacks (vorn und hinten). Da das nachgelagerte Inverter-Hauptschütz in der zentralen HV-Distribution zu diesem Zeitpunkt noch physisch geöffnet ist, erfolgt das Schließen der Batterie-Schütze völlig strom- und lastfrei. Ein Verschleiß der Schützkontakte wird konstruktiv ausgeschlossen. Das IMD überwacht ab diesem Moment die HV-Strecke bis zur HV-Distribution.
2. **Vorschaltladung (Precharge) durch Inverter:** Das System nutzt die integrierte Precharge-Logik des Motorcontrollers. Das Invertermodell verfügt über einen internen Precharge-Widerstand. Mit Anliegen der Steuerspannung lädt der Inverter seine internen Zwischenkreiskondensatoren kontrolliert hoch, bis das Spannungsniveau der Batteriespannung angeglichen ist.
3. **Freigabe Hauptschütz (HV-Distribution):** Erst nach erfolgreichem und plausibilisiertem Abschluss der Vorschaltladung steuert die Logik des Inverters das Inverter-Hauptschütz in der HV-Distribution an und schließt dieses. Damit ist das Gesamtsystem unterbrechungsfrei und bauteilschonend mit dem Antriebsstrang verbunden. Die volle Leistung des Traktionsantriebs wird freigegeben. Das IMD überwacht nun kontinuierlich das gesamte, geschlossene HV-Bordnetz.

---

## Hochvoltkreise

Alle Hochvoltkreise des Antriebssystems sind als **isoliertes Netz (IT-System)** ausgeführt. Die Leitungen des Plus- und Minuspols werden vollständig vom Fahrzeugchassis getrennt geführt und sind zu keinem Zeitpunkt mit der Fahrzeugmasse verbunden.

---

## Ausfallsicherheit elektrisches Netz

Das elektrische Netz des Antriebssystems ist so dimensioniert und ausgelegt, dass unter allen vorhersehbaren Betriebsbedingungen und Lastfällen ein vorzeitiges Versagen ausgeschlossen ist (gemäß VdTÜV-Merkblatt 764, Kap. 4.5). Die Absicherung teilt sich auf in einen hardwarebasierten Kurzschlussschutz und einen softwarebasierten Überlastschutz.

### Leitungsquerschnitte und Absicherung

| Systemkomponente | Strombelastbarkeit Leitungen ($\text{mm}^2$) | Sicherung (A) | Schutzfunktion (Software) |
| :--- | :---: | :---: | :--- |
| **REESS und Inverter** (38.000 W) | 70 | 630 (Schmelz) | Begrenzung auf max. 200 A DC (VCU-Algorithmus) |
| **Ladegerät / Charger** (3.300 W) | 4 | 40 (Schmelz) | Elektronische Überwachung durch BMS und Ladegerät |
| **Motor / Inverter** (38.000 W) | 50 | 200 (MCU) | Elektronisch über Inverter: Begrenzung auf max. 154 Nm Drehmoment |
| **DC/DC Converter** (1.000 W) | 4 | 12 (Schmelz) | Elektronische Begrenzung im Wandler |
| **Heizung / Heating** (500 W) | 0,75 | 5 (Schmelz) | Thermische Abschaltung |

!!! info "Hinweis zur Absicherung des Motors"
    Die Absicherung des Motors ist in der Motor Control Unit (MCU) integriert und wird elektronisch überwacht.

### Spezifikation der Hochvolt-Komponenten

| Komponente | Hersteller / Typ | Nennstrom (Dauer) | Spitzenstrom (Peak) | Normkonformität / Nachweis |
| :--- | :--- | :---: | :---: | :--- |
| **HV-Kabel** | Huber + Suhner | ca. 350 A | > 700 A | ISO 19642 (Automotive Standard) |
| **HV-Steckverbinder** | Amphenol / Radsert | 200 A | ca. 400 A | IEC 61984 / UL 1977 |
| **Hauptschütze** | Gigavac | 350 A | > 1.000 A | UL 508 / IEC 60947 |
| **Hauptsicherung** | Eaton Bussmann EBSD | 630 A | Kurzschluss-Abschaltung | IEC 60269-4 / Träge Charakteristik |

!!! info "Hinweis zum Überlastschutz der Steckverbinder"
    Da die Steckverbinder für einen nominalen Dauerstrom von 200 A ausgelegt sind, wird der maximale DC-Batteriestrom durch die VCU (ESP32) über das BMS-Proxy-CAN-Protokoll (ID 0x246) bei steigender Motordrehzahl dynamisch begrenzt (siehe Software-Berechnung in Kap. 3.5.3). Ein thermisches Versagen der Steckverbinder wird dadurch zuverlässig verhindert.

---

### Konzept des softwarebasierten Überlastschutzes (VCU-Algorithmus)

Um die im System verbauten HV-Steckverbinder (Spezifikation: 200 A Nennstrom) vor thermischer Überlastung im Dauerbetrieb zu schützen, wird ein dynamischer Schutzalgorithmus in der Vehicle Control Unit (VCU / ESP32) implementiert. Da der Inverter im Torque-Modus betrieben wird, erfolgt die Strombegrenzung indirekt über eine drehzahlabhängige Reduzierung des Drehmoment-Sollwerts entlang einer definierten Hüllkurve.

#### A. Mathematischer Nachweis und physikalische Herleitung

Die maximale elektrische Leistung bei einer Nennspannung von 114 V DC und einem maximal zulässigen Dauerstrom der Steckverbinder von 200 A beträgt:

$$P_{\mathrm{el,max}} = 114\text{ V} \times 200\text{ A} = 22.800\text{ W} = 22,8\text{ kW}$$

Unter Berücksichtigung eines konservativen Gesamtwirkungsgrades von $\eta = 90\,\%$ (Inverter und Motor zusammen) ergibt sich die maximal zulässige mechanische Leistung an der Motorwelle, bevor die thermische Grenze der Steckverbinder erreicht wird:

$$P_{\mathrm{mech,max}} = P_{\mathrm{el,max}} \times 0,90 = 22.800\text{ W} \times 0,90 = 20.520\text{ W} = 20,52\text{ kW}$$

Die mechanische Leistung eines rotierenden Motors berechnet sich aus dem Drehmoment ($M$ in Nm) und der Drehzahl ($n$ in U/min):

$$P_{\mathrm{mech}} = M \times 2\pi \times \frac{n}{60}$$

Umgestellt nach der Drehzahl ($n$) unter Einsatz des gewünschten Hardware-Drehmomentlimits zum Schutz des Getriebes ($M = 154\text{ Nm}$) ergibt sich der exakte Umschaltpunkt der Regelung:

$$n = \frac{P_{\mathrm{mech,max}} \times 60}{M \times 2\pi} = \frac{20.520\text{ W} \times 60}{154\text{ Nm} \times 2\pi} = \frac{1.231.200}{967,61} \approx 1.272,4\text{ U/min}$$

Für alle Drehzahlen oberhalb dieses Schnittpunktes lässt sich das maximal zulässige Drehmoment ($M_{\mathrm{Limit}}$ in Nm) als hyperbolische Funktion beschreiben, bei der der DC-Batteriestrom exakt konstant auf der 200 A-Grenze verbleibt:

$$M_{\mathrm{Limit}}(n) = \frac{P_{\mathrm{mech,max}}}{\omega} = \frac{P_{\mathrm{mech,max}}}{2\pi \times \frac{n}{60}} = \frac{20.520\text{ W} \times 60}{2\pi \times n} \approx \frac{127.240}{n}$$

---

#### B. Ablauf der softwareseitigen Regelung

Der in der VCU hinterlegte Algorithmus teilt das Kennfeld basierend auf der errechneten Grenzdrehzahl von **1.272 U/min** in zwei distinkte Regelbereiche auf:

* **Bereich 1 ($n \le 1.272\text{ U/min}$ - Konstantes Drehmoment):** Das maximal vom Fahrer angeforderte Drehmoment wird bis zum vordefinierten Hardware-Schutzlimit von **154 Nm** vollständig freigegeben. In diesem Drehzahlbereich bleibt der DC-Batteriestrom anfahrbedingt und aufgrund der geringen mechanischen Leistung weit unter der kritischen 200 A-Schwelle (z. B. ca. 78 A bei 500 U/min).
* **Bereich 2 ($n > 1.272\text{ U/min}$ - Konstante Leistung / Hyperbolische Drosselung):** Der VCU-Algorithmus berechnet zyklisch bei jeder eingehenden CAN-Botschaft des Motors das reduzierte Drehmoment-Limit ($M_{\mathrm{Limit}}$). Dieses wird als maximal zulässiger Prozentwert über das BMS-Proxy-Protokoll (CAN-ID 0x246) an den Inverter übermittelt. Das Drehmoment wird präzise entlang der 20,52 kW-Hyperbel gedrosselt. Ein Ansteigen des DC-Batteriestroms über 200 A wird dadurch softwareseitig aktiv unterbunden.

!!! info ""
    Die genaue softwareseitige Implementierung (C++ Quellcode der VCU auf dem ESP32) ist im Anhang unter Kapitel 8.3 vollumfänglich dokumentiert.

## Spannungsfreischaltung des HV-Systems bei Wartung und Notfall

Zur Durchführung von Wartungsarbeiten oder in Notfallsituationen kann das HV-System schnell und sicher spannungsfrei geschaltet werden:

* **Maintenance Service Disconnect (MSD):** An jedem Batteriepack ist ein MSD-Stecker vorhanden, der ohne Werkzeug zugänglich ist (nach Öffnen des vorderen Kofferraums bzw. des Motorraums). Das Ziehen des MSD-Steckers unterbricht die interne Serienschaltung des Batteriepacks und somit physikalisch den HV-Stromkreis im gesamten Fahrzeug.
* **Pilotlinie (HVIL):** Die 12-Volt-Pilotlinie ist integraler Bestandteil aller HV-Steckverbinder. Die Gestaltung der Steckerkontakte gewährleistet, dass die HVIL-Verbindung bei einem Trennvorgang **immer zuerst unterbrochen** wird. Dies führt zur sofortigen Abschaltung der Hochvolt-Hauptrelais. Erst im Anschluss daran, bei weiterer Trennung der Steckverbindung, werden die HV-Kontakte selbst gelöst, wodurch eine **lichtbogensichere Trennung** sichergestellt wird.
* **Allpolige Abschaltung:** Das HV-System wird seitens des REESS immer allpolig (Plus- und Minuspol mit separaten Schützen) innerhalb der Gehäuse abgeschaltet.
* **Notwendigkeit des MSD:** Obwohl die Pilotlinie das HV-System auch beim Abklemmen der 12-Volt-Bordbatterie spannungsfrei schaltet, ist das **Abziehen des MSD-Steckers** für Wartungsarbeiten am Hochvoltsystem **zwingend vorgeschrieben**, um eine physische Trennung und somit höchste Sicherheit zu gewährleisten.