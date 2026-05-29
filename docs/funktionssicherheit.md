# 2 Funktionssicherheit

## 2.1 Ladevorgang und Betriebssicherheit (Technisches Sicherheitskonzept)

### 2.1.1 Technische Basisdaten

| Parameter | Spezifikation / Angabe |
| :--- | :--- |
| **Ladeanschluss** | Typ 2 (gemäß DIN EN 62196-2), fahrzeugseitiges Inlet (Berührschutz nach IPXXB) |
| **Ladebetriebsart** | Mode 2 oder Mode 3 (AC-Laden) |
| **Max. Ladeleistung** | 3,3 kW (einphasig) |
| **Onboard-Ladegerät** | Elcon TC Charger HK-MF-108-32 (galvanisch getrennt) |

### 2.1.2 Sicherheitslogik bei Ladebeginn (Handshake & Verriegelung)

Die Initiierung des Ladevorgangs erfolgt über einen normgerechten Ablauf zwischen dem Fahrzeug-Inlet und der Ladeinfrastruktur (Wallbox/Ladesäule):

1. **Steckerkennung (PP-Kontakt):** Beim Einstecken erfasst das dedizierte Ladecontroller-Modul (**„SimpCharge“**) den Widerstandswert des Proximity Pilot (PP) und erkennt die physische Präsenz des Ladekabels.
2. **Wegfahrsperre (Drive Inhibit gem. VdTÜV 764):** Unverzüglich nach der PP-Erkennung setzt das gekoppelte Batteriemanagementsystem (SimpBMS) das Hardware-Sicherheits-Signal *Drive Inhibit*. 
    * Der Inverter erhält software- und hardwareseitig keine Traktionsfreigabe.
    * Auf dem Cockpit-Display wird der Status „CHARGE“ dauerhaft visualisiert. Ein Umschalten in den Modus „DRIVE“ ist blockiert.
3. **Leistungserfassung (CP-Kontakt):** Das SimpCharge-Modul wertet das PWM-Signal des Control Pilot (CP) aus und ermittelt die netzseitige maximale Leistungsvorgabe.
4. **Verriegelung & Freigabe:** Nach erfolgreichem Handshake verriegelt der elektromechanische Aktuator den Stecker im Inlet. Das SimpBMS schließt die Ladeschütze und übermittelt den Ladebefehl via CAN-Bus an das Elcon-Ladegerät.

### 2.1.3 Schutzleiteranbindung (PE) und Isolationsüberwachung

* **Potentialausgleich:** Während des gesamten AC-Ladevorgangs ist das Fahrzeugchassis über den PE-Leiter des Typ-2-Kabels niederohmig mit dem Erdungspotential der Ladeinfrastruktur verbunden.
* **Galvanische Trennung:** Das Onboard-Ladegerät gewährleistet eine strikte galvanische Trennung zwischen der AC-Netzseite und der DC-Hochvoltseite des Fahrzeugs.
* **HV-Isolationsprüfung:** Das integrierte Isolationsüberwachungssystem (IMD) bleibt permanent aktiv und führt vor dem endgültigen Zuschalten der Hochvoltschütze einen automatischen Selbsttest durch.

### 2.1.4 Sicherheitslogik bei Beendigung des Ladevorgangs

Das SimpBMS überwacht fortlaufend die Einzelzellspannungen und den Ladezustand (SoC). Der Abschalt- und Trennvorgang ist sequentiell gegen Lichtbogenbildung und Fehbedienung geschützt:

1. **Ladestopp:** Bei Erreichen der Ladeschlussspannung kommandiert das BMS das Ladegerät zur stufenlosen Leistungsabregelung bis auf 0 Ampere.
2. **Unterbrechung unter Last ausgeschlossen:** Die elektromechanische Verriegelung des Ladekabels im Fahrzeug-Inlet bleibt nach Ladeende aktiv. Eine physische Trennung des Kabels unter Last ist unmöglich.
3. **Manuelle Abschalt-Sequenz:** Zum bewussten Beenden des Ladevorgangs wird ein separater Taster im Innenraum betätigt.
    * **Schritt A:** Der Taster unterbricht die CP-Signalleitung.
    * **Schritt B:** Die Ladeinfrastruktur schaltet die AC-Spannung augenblicklich lastfrei ab.
    * **Schritt C:** Erst nach Spannungsfreiheit gibt der Aktuator den Stecker mechanisch frei.
    * **Schritt D:** Nach dem Abziehen des Steckers hebt das BMS das *Drive Inhibit*-Signal auf.

---

## 2.2 Fahrbetrieb (Betriebssicherheit)

Um eine Gefährdung des Fahrers oder Dritter auszuschließen, ist das Antriebssystem mit harten Verriegelungsbedingungen (Interlocks) ausgestattet. Die Einhaltung der funktionalen Sicherheitsanforderungen gemäß VdTÜV-Merkblatt 764 (Kapitel 3.2) wird wie folgt umgesetzt:

### 2.2.1 Aktivierung der Fahrbereitschaft (Start-Sequenz)

Die Zuschaltung der Hochvolt-Traktionsbatterie zum Inverter erfordert eine zwingende logische und zeitliche Reihenfolge. Fehlt eine der folgenden Bedingungen, wird die HV-Zuschaltung blockiert:

**Bedingung 1: Lade-Interlock**
: Das Typ-2-Ladekabel muss physisch vom Fahrzeug getrennt sein (Signal *Drive Inhibit* inaktiv).

**Bedingung 2: Mechanische Freigabe**  
: Die Diebstahlsicherung (Lenkradschloss) muss durch den mechanischen Zündschlüssel entriegelt und auf Position 1 (Klemme 15R) gedreht sein.

**Bedingung 3: Fahrtrichtungs-Interlock**  
: Der elektrische Fahrtrichtungsschalter muss sich zwingend in der neutralen Position „N“ befinden.

**Bedingung 4: Brems-Interlock**  
: Das Bremspedal muss aktiv betätigt sein (Signalabgriff redundant über den mechanisch-hydraulischen Bremslichtschalter), um ein unkontrolliertes Anrollen beim Schließen der Schütze zu verhindern.

!!! success "Systemfreigabe"
    Sind alle Bedingungen erfüllt und wird der Schlüssel auf Position 2 (Klemme 15) gedreht, fahren die Steuergeräte (MCU, BMS, VCU) hoch. Das IMD führt den Selbsttest durch und zeigt den Isolationswiderstand ($R_{\text{iso}}$) im Kombi-Instrument an. Die HV-Schütze schließen. Der Zustand „aktiver Fahrbetrieb möglich“ wird durch die optische Anzeige **„DRIVE“** im BMS-Display signalisiert.

---

### 2.2.2 Fahren, Anhalten und Umsteuerung (Fahrtrichtung)

Maßnahmen gegen unbeabsichtigte Beschleunigung und fehlerhafte Umsteuerung im Fahrbetrieb:

**Zweikanaliges Fahrpedal**
: Die Drehmomentanforderung erfolgt über ein redundantes, zweikanaliges Analog-Potentiometer. Die MCU führt fortlaufend eine Plausibilitätsprüfung beider Signalstränge durch. Bei einer unzulässigen Signaldifferenz oder einem Leitungsbruch wird das System sofort in einen sicheren Zustand geregelt (Leistungsbegrenzung oder sofortiger Not-Stopp).

**Neutral-Start-Sicherheit**
: Eine direkte Umschaltung der Fahrtrichtung zwischen Vorwärts (D) und Rückwärts (R) unter Last wird durch die MCU blockiert. Ein Richtungswechsel erfordert zwingend den Stillstand des Fahrzeugs und den bewussten Zwischenschritt über die Position „N“ (Neutral). Die gewählte Fahrtrichtung wird permanent im zentralen Blickfeld angezeigt.

**Drehzahlüberwachung**
: Die Drehrichtung und die exakte Drehzahl des Motors werden sicherheitsgerichtet durch einen integrierten elektronischen Geber (3-Pin Hall-Effekt-Sensor) kontinuierlich erfasst und an die MCU gemeldet.

---

### 2.2.3 Warnsysteme beim Verlassen des Fahrzeugs

Zur Vermeidung eines ungesicherten Verlassens des fahrbereiten Fahrzeugs ist eine akustische Warnlogik (Buzzer) integriert, welche die Signale der Türkontaktschalter auswertet:

**Szenario 1: Aktive Fahrbereitschaft**  
: Öffnet der Fahrer die Fahrertür, während das HV-System noch aktiv ist (Zündung auf Position 2), ertönt ein permanenter, unüberhörbarer Warnton.

**Szenario 2: Fehlende Wegrollsicherung**  
: Wird die Zündung ausgeschaltet (Position 0), aber die mechanische Handbremse wurde nicht angezogen, generiert das System beim Öffnen der Fahrertür ebenfalls ein akustisches Warnsignal.

---

### 2.2.4 Thermomanagement und Leistungsverminderung (Derating)

Das Gesamtsystem schützt sich über eine mehrstufige Kaskade vor kritischen thermischen Zuständen und warnt den Fahrer rechtzeitig vor einer systemseitigen Abschaltung:

**Stufe 1: Aktive Kühlung**
: Die MCU überwacht die Inverter- und Motortemperaturen. Bei ansteigenden Werten steuert die VCU automatisch die elektrische Tesla-Kühlmittelpumpe sowie die Zusatzlüfter an, um die thermische Energie abzuführen.

**Stufe 2: Optische Vorwarnung**
: Steigt die Temperatur trotz maximaler Kühlleistung weiter an, wird im Kombi-Instrument die Warnmeldung **„TEMP“** ausgegeben. Der Fahrer wird hierdurch aufgefordert, die Leistungsentnahme proaktiv und manuell zu reduzieren.

**Stufe 3: Automatisches Hard-Derating**
: Bei Erreichen des kritischen Temperatur-Grenzwerts greift die MCU autonom ein und begrenzt die maximale Leistungsabgabe schlagartig auf **50 %**. Das Fahrzeug bleibt zur Gefahrenabwehr voll manövrierfähig (kein plötzlicher Vortriebsverlust im fließenden Verkehr), die Hardware wird jedoch effektiv vor thermischer Zerstörung geschützt.

---

# 2.3 Sicherstellung des Antriebs (Dimensionierung)

Dieses Kapitel belegt die rechnerische Leistungsfähigkeit des elektrischen Antriebsstrangs sowie die Speicherkapazität der Hochvoltbatterie (REESS). Es dient dem Nachweis, dass die Anforderungen an Fahrperformance, Reichweite und Steigfähigkeit gemäß den gesetzlichen Vorgaben sicher erfüllt werden.

### 2.3.1 Leistung des Motors und elektrische Dimensionierung

Der eingesetzte Elektromotor (NetGain HyPer 9) verfügt über eine nominelle Dauerleistung von 38 kW. Die Hochvoltbatterie besteht aus 5 Tesla Model S Modulen mit einer Gesamtkapazität von 26,5 kWh bei einer Nennspannung von 114 V DC. 

Nachfolgend wird die physische Fähigkeit des Speichers zur Bereitstellung der Ströme hergeleitet:

* **Strombedarf bei kontinuierlicher Dauerleistung (38 kW):**
  Zur Bereitstellung der Dauerleistung von 38 kW bei der System-Nennspannung von 114 V DC ergibt sich ein kontinuierlicher Strombedarf von:

<div class="arithmatex">
$$I_{\text{Motor}_{\text{Dauer}}} = \frac{P}{U_{\text{Batt}}} = \frac{38.000\text{ W}}{114\text{ V}} \approx 333,3\text{ A}$$
</div>

* **Rechnerische Batteriekapazität ($Q_{\text{Batt}}$):**
  Aus der bereitgestellten Energie von 26,5 kWh und der Nennspannung resultiert eine Gesamtkapazität von:

<div class="arithmatex">
$$Q_{\text{Batt}} = \frac{\text{Energie (kWh)} \times 1000}{U_{\text{Standard}}} = \frac{26,5\text{ kWh} \times 1000}{114\text{ V}} \approx 232,5\text{ Ah}$$
</div>

* **Maximaler physikalischer Entladestrom (C-Rating):**
  Basierend auf dem konservativen C-Rating von 3 (Zell-Herstellerangabe für kontinuierliche Entladung) kann der Akkupack theoretisch folgenden maximalen Dauerstrom abgeben:

<div class="arithmatex">
$$I_{\text{Batt}_{\text{max}}} = Q_{\text{Batt}} \times C_{\text{Rating}} = 232,5\text{ Ah} \times 3 \approx 697,5\text{ A}$$
</div>

* **Maximale physikalische Leistungsabgabe der Batterie:**
  Daraus resultiert eine maximale, vom Energiespeicher physisch bereitstellbare Leistung von:

<div class="arithmatex">
$$P_{\text{Batt}_{\text{max}}} = U_{\text{Batt}} \times I_{\text{Batt}_{\text{max}}} = 114\text{ V} \times 697,5\text{ A} \approx 79.515\text{ W} \approx 79,5\text{ kW}$$
</div>

!!! success "Fazit zur elektrischen Dimensionierung"
    Die physikalische Belastbarkeit der Batterie ($79,5\text{ kW}$) übertrifft die Motordauerleistung ($38\text{ kW}$) spürbar. Auch für die kurzzeitige Spitzenleistung des Inverters ($95\text{ kW}$ für max. 10 Sekunden) bietet das Gesamtsystem ein inhärent sicheres Fundament, da die Zellen kurzzeitig Ströme weit über $3\text{C}$ schadlos abgeben können.

---

### 2.3.1 Leistung des Motors und elektrische Dimensionierung

Der eingesetzte Elektromotor (NetGain HyPer 9) verfügt über eine nominelle Dauerleistung von 38 kW. Die Hochvoltbatterie besteht aus 5 Tesla Model S Modulen mit einer Gesamtkapazität von 26,5 kWh bei einer Nennspannung von 114 V DC. 

Nachfolgend wird die physische Fähigkeit des Speichers zur Bereitstellung der Ströme hergeleitet:

* **Strombedarf bei kontinuierlicher Dauerleistung (38 kW):**
  Zur Bereitstellung der Dauerleistung von 38 kW (38.000 W) bei der System-Nennspannung von 114 V DC ergibt sich ein kontinuierlicher Strombedarf von:

<div class="arithmatex">
$$I_{\text{Motor}_{\text{Dauer}}} = \frac{P}{U_{\text{Batt}}} = \frac{38.000\text{ W}}{114\text{ V}} \approx 333,3\text{ A}$$
</div>

* **Rechnerische Batteriekapazität (<i>Q</i><sub>Batt</sub>):**
  Aus der bereitgestellten Energie von 26,5 kWh und der Nennspannung resultiert eine Gesamtkapazität von:

<div class="arithmatex">
$$Q_{\text{Batt}} = \frac{\text{Energie (kWh)} \times 1000}{U_{\text{Standard}}} = \frac{26,5\text{ kWh} \times 1000}{114\text{ V}} \approx 232,5\text{ Ah}$$
</div>

* **Maximaler physikalischer Entladestrom (C-Rating):**
  Basierend auf dem konservativen C-Rating von 3 (Zell-Herstellerangabe für kontinuierliche Entladung) kann der Akkupack theoretisch folgenden maximalen Dauerstrom abgeben:

<div class="arithmatex">
$$I_{\text{Batt}_{\text{max}}} = Q_{\text{Batt}} \times C_{\text{Rating}} = 232,5\text{ Ah} \times 3 \approx 697,5\text{ A}$$
</div>

* **Maximale physikalische Leistungsabgabe der Batterie:**
  Daraus resultiert eine maximale, vom Energiespeicher physisch bereitstellbare Leistung von:

<div class="arithmatex">
$$P_{\text{Batt}_{\text{max}}} = U_{\text{Batt}} \times I_{\text{Batt}_{\text{max}}} = 114\text{ V} \times 697,5\text{ A} \approx 79.515\text{ W} \approx 79,5\text{ kW}$$
</div>

!!! success "Fazit zur elektrischen Dimensionierung"
    Die physikalische Belastbarkeit der Batterie (79,5 kW) übertrifft die Motordauerleistung (38 kW) spürbar. Auch für die kurzzeitige Spitzenleistung des Inverters (95 kW für max. 10 Sekunden) bietet das Gesamtsystem ein inhärent sicheres Fundament, da die Zellen kurzzeitig Ströme weit über 3C schadlos abgeben können.

---

### 2.3.2 Fahrleistungen und Reichweitenabschätzung

Die folgenden mechanischen Berechnungen basieren auf den ermittelten Ist-Werten des umgerüsteten Fahrzeugs (<i>m</i> = 995 kg Leergewicht).

**Fahrzeug-Eckdaten für die Simulation:**    

* **Effektiver Raddurchmesser (185/60 R13):** 0,552 m (Radius <i>r</i> = 0,276 m)  
* **Luftwiderstandsbeiwert (<i>c</i><sub>w</sub>):** 0,36 (konservative Schätzung für Karosserieform)  
* **Stirnfläche (<i>A</i>):** ca. 1,7 m²  
* **Gesamtwirkungsgrad Antrieb (&eta;):** ca. 90 % (Motor inkl. Inverter)  
* **Getriebeübersetzung (konstant im 4. Gang):** <i>i</i> = 4,252  

#### A. Anfahrvermögen an Steigungen (gemäß VdTÜV 764, Kap. 3.3)
Das Fahrzeug muss eine Steigung von 12 % (&alpha; &approx; 6,82&deg;) aus dem Stillstand heraus problemlos fünfmal innerhalb von fünf Minuten bewältigen können.

* **Hangabtriebskraft (<i>F</i><sub>Steigung</sub>):**

<div class="arithmatex">
$$F_{\text{Steigung}} = m \times g \times \sin(\alpha) = 995\text{ kg} \times 9,81\text{ m/s}^2 \times \sin(6,82^\circ) \approx 1172,7\text{ N}$$
</div>

* **Rollwiderstandskraft (<i>F</i><sub>Roll</sub>) bei <i>c</i><sub>rr</sub> = 0,01:**

<div class="arithmatex">
$$F_{\text{Roll}} = m \times g \times c_{\text{rr}} = 995\text{ kg} \times 9,81\text{ m/s}^2 \times 0,01 \approx 97,6\text{ N}$$
</div>

* **Erforderliche Gesamtzugkraft beim Anfahren:**

<div class="arithmatex">
$$F_{\text{Total}_{\text{Anfahren}}} = F_{\text{Steigung}} + F_{\text{Roll}} = 1172,7\text{ N} + 97,6\text{ N} \approx 1270,3\text{ N}$$
</div>

* **Erforderliches Drehmoment an den Hinterrädern:**

<div class="arithmatex">
$$M_{\text{Rad}_{\text{Anfahren}}} = F_{\text{Total}_{\text{Anfahren}}} \times r = 1270,3\text{ N} \times 0,276\text{ m} \approx 350,6\text{ Nm}$$
</div>

* **Resultierendes Motordrehmoment (im 4. Gang):**

<div class="arithmatex">
$$M_{\text{Motor}_{\text{Anfahren}}} = \frac{M_{\text{Rad}_{\text{Anfahren}}}}{i} = \frac{350,6\text{ Nm}}{4,252} \approx 82,5\text{ Nm}$$
</div>

!!! note "Anmerkung zum Single-Speed-Betrieb"
    Da der Motor das benötigte Drehmoment von 82,5 Nm im 4. Gang aus dem Stand heraus spielend bereitstellt (Maximalmoment ungedrosselt 234 Nm), ist ein permanentes Fahren im 4. Gang als „Single-Speed-Konzept“ möglich. Ein mechanischer Schaltvorgang ist im Regelbetrieb nicht erforderlich.

#### B. Energieverbrauch und Reichweitenprognose (konstant 80 km/h)
* **Luftwiderstandskraft (<i>F</i><sub>Luft</sub>) bei <i>v</i> = 22,2 m/s (80 km/h) und Luftdichte &rho; = 1,225 kg/m³:**

<div class="arithmatex">
$$F_{\text{Luft}} = 0,5 \times c_{\text{w}} \times A \times \rho \times v^2 = 0,5 \times 0,36 \times 1,7\text{ m}^2 \times 1,225\text{ kg/m}^3 \times (22,2\text{ m/s})^2 \approx 194,0\text{ N}$$
</div>

* **Gesamtfahrwiderstandskraft (<i>F</i><sub>Total</sub>):**

<div class="arithmatex">
$$F_{\text{Total}} = F_{\text{Roll}} + F_{\text{Luft}} = 97,6\text{ N} + 194,0\text{ N} = 291,6\text{ N}$$
</div>

* **Leistungsbedarf an der Radachse:**

<div class="arithmatex">
$$P_{\text{Achse}} = F_{\text{Total}} \times v = 291,6\text{ N} \times 22,2\text{ m/s} \approx 6472\text{ W} \approx 6,5\text{ kW}$$
</div>

* **Elektrischer Leistungsbedarf (ab Batterie, bei &eta; = 0,90):**

<div class="arithmatex">
$$P_{\text{Elektrisch}} = \frac{P_{\text{Achse}}}{\eta} = \frac{6,5\text{ kW}}{0,90} \approx 7,2\text{ kW}$$
</div>

* **Mathematischer Netto-Verbrauch pro 100 km:**

<div class="arithmatex">
$$\text{Verbrauch}_{100} = P_{\text{Elektrisch}} \times \left(\frac{100\text{ km}}{80\text{ km/h}}\right) = 7,2\text{ kW} \times 1,25\text{ h} = 9,0\text{ kWh/100 km}$$
</div>

!!! info "Reichweitenprognose unter Realbedingungen"
    Unter Berücksichtigung von Nebenverbrauchern (Heizung, LV-Bordnetzwandler) sowie variablen Fahrzyklen wird ein realistischer Praxisverbrauch von **10 bis 12 kWh/100 km** projektiert. Mit der nutzbaren Batteriekapazität von 26,5 kWh resultiert daraus eine verlässliche Aktionsreichweite von **200 bis 250 km**.

!!! success "Fazit zur elektrischen Dimensionierung"
    Die physikalische Belastbarkeit der Batterie (79,5 kW) übertrifft die Motordauerleistung (38 kW) spürbar. Auch für die kurzzeitige Spitzenleistung des Inverters (95 kW für max. 10 Sekunden) bietet das Gesamtsystem ein inhärent sicheres Fundament, da die Zellen kurzzeitig Ströme weit über 3C schadlos abgeben können.

---

### 2.3.3 Parametrierung des elektrischen Antriebs (Softwareseitige Begrenzungen)

Um die mechanischen Kraftübertragungskomponenten des Basisfahrzeugs (Serien-Getriebe und Kupplung) wirksam vor den extremen, schlagartigen Drehmomentspitzen des Elektromotors zu schützen, wird die Motorsteuerung (MCU) als primäres Begrenzungsorgan eingesetzt. 

Die softwareseitige Limitierung wird über die Steuerungssoftware *SMARTView* direkt auf dem SME-Controller hinterlegt. Das detaillierte Herleitungskonzept des softwarebasierten Überlastschutzes wird vertiefend in **Kapitel 3.5.4** dargelegt.

Die folgende Tabelle zeigt die im System fest hinterlegten Parameter zur Gewährleistung der Betriebssicherheit:

| Parameter (SmartView) | Parametrierter Wert | Schutzziel / Technische Begründung |
| :--- | :--- | :--- |
| Control Mode | Torque Mode | Lineares Ansprechverhalten analog zum Serienzustand. |
| Max. Motor Speed |5.500 rpm | Einhaltung der max. Getriebeeingangsdrehzahl |
| Max. Torque Limit | 154 Nm | Hardware-Schutz: Begrenzung ist das Nennmoment der Kupplung (160 | Nm). |
| Min. Torque Accel Time | 1,8 s | Lastschlagdämpfung: Verhindert schlagartige Belastung der Mechanik. |
| Brake Priority | Aktiviert | Sicherheitsabschaltung bei Bremsbetätigung |
| SRO (Static Return) | Aktiviert | Verhindert Anfahren beim Einschalten |
| Controlled Roll-Off | Aktiviert | Verhindert unkontrolliertes Rollen im Stand |
| Hill Hold | By Pedal Brake | Erleichert das Anfahren an Steigungen |
| Neutral Braking Rate | 15 % | Simulation eines moderaten Motor-Schleppmoments (Segel-Modus) |
| Activation Delay|150 ms| Geschmeidiges Ansprechverhalten |

!!! success "Fazit zur mechanischen Sicherstellung des Antriebs"
    Die Zusammenführung der mechanischen Mindestanforderungen und der softwareseitigen Schutzbegrenzungen (aus Kap. 2.3.3) belegt die uneingeschränkte Betriebssicherheit des Fahrzeugs:
    
    * **Steigfähigkeit:** Das softwareseitig parametrierte Drehmomentlimit von **154 Nm** liegt spürbar über dem maximal erforderlichen Drehmoment von **82,5 Nm**, welches für das normgerechte Anfahren an einer 12 % Steigung im Single-Speed-Betrieb (4. Gang) benötigt wird.
    * **Dauerleistung:** Das thermische Schutzlimit der HV-Steckverbinder von **200 A** erlaubt eine kontinuierliche mechanische Leistungsabgabe von **20,52 kW**. Dies übertrifft den realen Leistungsbedarf bei einer konstanten Autobahnfahrt von 80 km/h (ca. **7,2 kW** benötigte elektrische Leistung) um mehr als das Doppelte.
    
    **Gesamtergebnis:** Die softwareseitigen Begrenzungen der Motorsteuerung stellen einen hocheffektiven Komponentenschutz dar, ohne die Alltagstauglichkeit, die gesetzlichen Performance-Vorgaben oder die thermische Stabilität des Antriebsstrangs im realen Fahrbetrieb einzuschränken.

---

## 2.4 Mindestladezustand des Energiespeichers

Der Mindestladezustand des Energiespeichers (SOC - State of Charge) ist vom Batteriemanagementsystem (BMS) hardwareseitig auf 5 % der maximalen Kapazität festgelegt. Die eingebauten Anzeigen im Kombi-Instrument visualisieren den aktuellen SOC analog und digital. Bei Erreichen des Mindestladezustands wird eine zusätzliche Warnmeldung im Kombi-Instrument angezeigt, um den Fahrer über die verbleibende Restreichweite zu informieren und sicherzustellen, dass das Fahrzeug auch unter diesen Bedingungen aus dem Verkehrsbereich hinausgefahren werden kann (gemäß VdTÜV 764, Kap. 3.4).

---

## 2.5 Heizung/Lüftung sowie Entfrostung, Trocknung

Zur Erfüllung der Anforderungen nach § 35c StVZO bezüglich Beheizung, Belüftung und Entfrostung der Scheiben wurde das bestehende manuelle Lüftungssystem des Basisfahrzeugs beibehalten und mit einem elektrischen PTC-Heizer ergänzt.
- **Belüftung der Fahrgastzelle:** Die aktive Belüftung der
  Fahrgastzelle erfolgt über die vorhandenen Lüftungswege und den
  ursprünglichen Lüfter gemäß der OEM-Spezifikation.
- **Beheizung der Fahrgastzelle und Windschutzscheiben-Entfrostung:** Ein elektrischer PTC-Heizer ist in den Luftstrom des vorhandenen Lüftungssystems integriert. Dieser Heizer wird elektrisch zugeschaltet und gewährleistet die Versorgung der Fahrgastzelle und insbesondere der Windschutzscheibe mit   ausreichend warmer Luft zur Funktion der Beheizung und Entfrostung/Trocknung. Die Luftverteilung für die Windschutzscheibe erfolgt durch manuelle Steuerung der Luftaustrittsklappen (Fußraum/Mittelkonsole) zur Priorisierung des Luftstroms zur Scheibe hin.

---

## 2.6 Bremse

Das Fahrzeug ist mit einer zweikreisigen Bremsanlage mit vier Scheiben-bremsen ausgerüstet. Es verfügt weder über einen Unterdruckbrems-verstärker noch über ein Antiblockiersystem (ABS). Die Feststellbremse wirkt mechanisch auf die Bremsen der Hinterachse. Die vorhandene Bremsanlage des Basisfahrzeugs wurde unverändert beibehalten.

Das elektrische Antriebssystem ermöglicht eine zusätzliche elektrische Bremsunterstützung durch Energierückgewinnung (Rekuperationsprinzip).
Dieses System ist wie folgt nach UN-Regelung Nr. 13/13H als **Kategorie A** realisiert:

- **Rekuperationsaktivierung (Kategorie A):** Die Aktivierung der Rekuperation erfolgt ausschließlich durch das Loslassen des Fahrpedals (Coast-Down-Rekuperation).
- **Deaktivierung der Rekuperation:** Die Rekuperation kann für besondere Fahrbedingungen (z.B. Glatteis) über den Schalter „**RECU OFF**" deaktiviert werden.
- **Keine Integration in die Betriebsbremsanlage:** Die  Rekuperationsfunktion ist **nicht** in die Betriebsbremsanlage integriert. Das Bremspedal betätigt ausschließlich die mechanischen Reibbremsen. Ein Blockieren der Räder durch das Rekuperationssystem ist durch die ausschließliche Aktivierung über das Fahrpedal und fehlende Koppelung mit dem Bremspedal ausgeschlossen.

---

## 2.7 Lenkung

Die Lenkeinrichtung des Fahrzeugs ist unverändert und entspricht der Originalspezifikation. Das Fahrzeug verfügt über keine Servolenkung und die mechanische Lenkeinheit wurde nicht modifiziert.

---

## 2.8 Grundfunktion der elektrischen Systeme

Die grundlegenden elektrischen Funktionen des Fahrzeugs, insbesondere die in § 47 StVZO geforderten Beleuchtungseinrichtungen (z.B. Standlicht, Warnblinkanlage) sowie das akustische Warnsystem, bleiben auch bei einem Ausfall oder der Deaktivierung des Hochvolt-Antriebssystems uneingeschränkt funktionsfähig. Dies wird durch das Vorhandensein eines separaten 12V-Bordnetz-Energiespeichers (12V-Batterie) sichergestellt.

---

## 2.9 Batterie und Batteriemanagementsystem (REESS, BMS)

Das Rechargeable Energy Storage System (REESS) ist das zentrale Bauteil für die Speicherung der elektrischen Energie. Um die geforderte elektrische und funktionale Sicherheit zu gewährleisten, ist es mit einem dedizierten Batteriemanagementsystem (BMS) ausgestattet.

### 2.9.1 REESS (Energiespeicher)

* **Bestandteile:** Das REESS besteht aus insgesamt fünf gebrauchten Tesla Model S Modulen (5.3 kWh/Modul), die zu einem 2er-Pack und einem 3er-Pack konfiguriert sind. Details zur Kapazität und Nennspannung sind in Kapitel 1.3 dargestellt.
* **Qualitätssicherung der Zellen:** Der Nachweis der Prüfung und Zertifizierung der verwendeten Zellen gemäß den Anforderungen der  UN-Regelung Nr. 38.3 ist im **Anhang X.X** beigefügt. *(*todo:* passende Anhangs-Referenz einfügen)*. Die verbauten Zellen (Panasonic NCR18650B) sind Teil zertifizierter Module.
* **Integration:** Die Module werden durch das BMS überwacht, um einen  sicheren Betrieb auch mit gebrauchten Komponenten zu gewährleisten.

### 2.9.2 BMS (Batteriemanagementsystem)

* **Architektur:** Es wird ein **SimpBMS** in einer Master-Slave-Konfiguration eingesetzt. Dieses System nutzt die originalen Tesla-Slave-Boards, die direkt auf den Modulen verbaut sind, zur kontinuierlichen Datenakquise.
* **Überwachungsfunktionen:**
    * **Zellspannungen:** Das SimpBMS erfasst und überwacht kontinuierlich sämtliche Einzelzellspannungen innerhalb der Module. Die integrierten Balancierfunktionen der Slave-Boards werden zur Zellpflege aktiv genutzt.
    * **Temperaturüberwachung:** Die in den Tesla-Modulen integrierten Temperatursensoren werden vom SimpBMS zyklisch ausgelesen und überwacht.
    * **C-Rating und Strom:** Der maximale Entlade- und Ladestrom wird permanent überwacht und bei Überschreitung der Grenzwerte systemseitig limitiert.
    * **Gesamtspannung:** Das System führt eine kontinuierliche Plausibilitätsprüfung der Gesamtspannung des REESS durch.
* **Grenzwertüberwachung:** Das BMS ist mit fest definierten Ansprech- und Schwellenwerten für alle sicherheitskritischen Parameter (Spannung, Strom, Temperatur) parametriert, um bei Grenzwertverletzungen eine automatische Sicherheitsabschaltung einzuleiten.

### 2.9.3 Aktive Systemreaktion bei Grenzwertverletzungen

Bei Über- oder Unterschreitung der definierten Ansprech- und Schwellwerte reagiert das BMS aktiv und sicherheitsgerichtet, um Personen- und Sachschäden zu vermeiden und die Lebensdauer der Batterie zu maximieren:

* **Kommunikation/Regelung:** Das BMS kommuniziert via CAN-Bus mit dem  Onboard-Ladegerät (zur Reduzierung oder Abschaltung des Ladestroms), dem Inverter (zur Reduzierung oder Abschaltung der Leistungsanforderung) und der Vehicle Control Unit (VCU).
* **Direkte Abschaltung (Schütze):** Bei kritischen Fehlern oder  drastischer Grenzwertverletzung aktiviert das BMS unmittelbar die  Notabschaltung durch die direkte Ansteuerung der Hauptschütze (Contactor) im REESS, welche (getrennt für Plus- und Minuspol) den Hochvolt-Stromkreis trennen. Dies gewährleistet die sofortige Spannungsfreischaltung des Antriebssystems.
* **Display:** Das SimpBMS Master-Modul verfügt über ein separates Display, welches dem Servicepersonal den Abruf aller relevanten Parameter und Systemzustände für Diagnosezwecke ermöglicht.

## 2.10 Mechanische Antriebsintegration

Die betriebsfeste und passgenaue Verbindung des Elektromotors (NetGain Hyper9) mit dem Original-Fünfganggetriebe des Bertone X1/9 wird durch eine professionell gefertigte Adapterlösung sichergestellt. Alle Komponenten zur mechanischen Kraftübertragung wurden vom europäischen Fachbetrieb **evshop.eu** bezogen bzw. in Auftrag gegeben, der auf die Komponenten des Herstellers NetGain Motors spezialisiert ist.

### 2.10.1 Motor-Getriebe-Adapterplatte

Eine speziell für diese Fahrzeug-Motor-Kombination angefertigte Adapterplatte aus hochfestem Stahl stellt die exakte koaxiale Ausrichtung zwischen der Motorwelle und der Getriebeeingangswelle sicher. Die präzise Fertigung der Platte durch einen Fachbetrieb gewährleistet die für eine lange Lebensdauer der Wellenlager und der Kupplung notwendige Fluchtungsgenauigkeit. Die Verschraubung der Platte erfolgt mit Schrauben der Festigkeitsklasse 10.9 (todo: prüfen!), die mit dem vom Hersteller empfohlenen Drehmoment angezogen wurden.

### 2.10.2 Wellenkupplung

Die Kraftübertragung zwischen Motor- und Getriebewelle erfolgt über eine **Klauenkupplung mit einem Elastomer-Dämpfungselement**. Diese Kupplung wurde als passendes Zubehör für den Hyper9-Antriebsstrang vom genannten Fachhändler bezogen.

***Begründung der Auslegung und Maßnahmen zur Dauerhaltbarkeit:***
Die Verwendung dieser Kupplungsart bietet den Vorteil, minimale Fluchtungsungenauigkeiten sowie hochfrequente Vibrationen des Antriebsstrangs durch das elastische Zwischenelement effektiv zu dämpfen.
Um die für Klauenkupplungen kritischen, harten Lastwechsel zu minimieren und die Dauerhaltbarkeit des Elastomerelements zu maximieren, wurden im Motorcontroller (MCU) folgende Maßnahmen parametriert:
**- Drehmomentenrampen ("Slew Rate"):** Die Anstiegs- und Abfallzeit des Drehmoments wurde auf einen weichen Übergang eingestellt (siehe Kap. 6 todo: korrigieren), um schlagartige Belastungen auf die Kupplung zu vermeiden.
**- Begrenzung des Maximaldrehmoments:** Das maximale Motordrehmoment wurde softwareseitig auf 154 Nm begrenzt, was sowohl dem Schutz des Original-Getriebes als auch der Entlastung des Kupplungselements dient.

Durch die Kombination aus professionell gefertigten mechanischen Komponenten und einer darauf abgestimmten, bauteilschonenden Software-Parametrierung wird eine betriebssichere und dauerhaltbare Kraftübertragung gewährleistet.

### 2.10. Motoraufhängung (Motor Cradle)

Zur Abstützung des Motorgewichts am hinteren Ende (Encoder-Seite) und zur Aufnahme des Reaktionsdrehmoments kommt eine originale Motorhalterung „Motor Cradle" des Herstellers NetGain Motors zum Einsatz:  

* **Konstruktion:** Der Halter aus korrosionsbeständigem, verzinktem Stahl umschließt mit 220 mm Innendurchmesser das Motorgehäuse formschlüssig.
* **Schwingungsentkopplung:** Die Aufhängung erfolgt über integrierte **Gummibuchsen** (Rubber Bushings). Diese sorgen für eine Schwingungstechnische Entkopplung zwischen der Antriebseinheit und der Fahrzeugkarosserie, minimieren die Übertragung von Körperschall und verhindern Spannungsrisse in der Struktur.

---