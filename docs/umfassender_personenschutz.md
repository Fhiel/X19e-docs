# 6 Umfassender Personenschutz -- Schutz für Dritte

Dieses Kapitel beschreibt Maßnahmen, die über die unmittelbare Fahrzeugsicherheit hinausgehen und dem Schutz Dritter im Falle eines Unfalls, einer Bergung oder bei Wartungsarbeiten dienen.

## 6.1 Schutz im Normalbetrieb (Äußere Sicherheit)

Das Fahrzeug wurde so konstruiert, dass von ihm keine vermeidbaren Gefahren für andere Verkehrsteilnehmer ausgehen (§30 StVZO).

- **Keine scharfen Kanten:** Alle neu angebauten oder modifizierten Teile weisen keine vorstehenden, scharfkantigen Bauteile auf.
- **Schutz vor heißen Oberflächen:** Alle im Betrieb potenziell heißen Komponenten des Antriebsstrangs (Motor, Inverter) sind innerhalb des geschlossenen Motorraums verbaut und nicht von außen berührbar.
- **Schutz vor beweglichen Teilen:** Alle rotierenden Teile des Antriebsstrangs sind sicher gekapselt.

## 6.2 Schutz für Rettungs- und Bergungskräfte (Notabschaltkonzept und Rettungsdatenblatt)

Zur sicheren und schnellen Deaktivierung des Hochvoltsystems im Falle eines Unfalls oder für Rettungskräfte sind gemäß VdTÜV-Merkblatt 764 (Kap. 5.5 & 9.2) drei redundante Mechanismen implementiert:

1. **Automatische Abschaltung (Inertia Switch):** Ein mechanischer Trägheitsschalter (Crash-Sensor) unterbricht bei einem Aufprall sofort den 12V-Halteschaltkreis der Hauptschütze. Dadurch wird die Hochvoltspannung direkt an den Batteriepacks galvanisch getrennt.
2. **Manuelle Rettungs-Trennschleife (First Responder Cut-Loop):** Im gut zugänglichen Motorraum (Position des rückwärtigen REESS) befindet sich eine deutlich gekennzeichnete 12V-Trennschleife. Durch das Durchtrennen oder Abziehen dieser markierten Verbindung wird die Energieversorgung der HV-Schütze unterbrochen und das System spannungsfrei geschaltet.
3. **Mechanische Trennung (MSD):** Zusätzlich verfügt jedes Batteriepack über einen Maintenance Service Disconnect (MSD), der den HV-Stromkreis physisch unterbricht und für Wartungszwecke oder Langzeitbergung genutzt wird.

**Rettungsdatenblatt (gemäß ISO 17840):** Basierend auf diesen Mechanismen wird ein fahrzeugspezifisches Rettungsdatenblatt erstellt, welches folgende Informationen grafisch aufbereitet:

- Die genaue Position der beiden Hochvolt-Batteriepacks (REESS).
- Die Lage der Hochvoltleitungen (orange Kabel), HV-Komponenten und der 12V-Batterie.
- Die exakte Position der Rettungs-Trennschleife und der MSDs.
- Die empfohlene Vorgehensweise zur schnellen Deaktivierung.
- **Verfügbarkeit:** Das Rettungsdatenblatt wird im Fahrzeug mitgeführt (z.B. hinter der Sonnenblende) und kann direkt über den Link [*Rettungskarte Bertone X1/9e*](https://fhiel.github.io/x19e-electric-speed/safety/Rettungskarte_Bertone_X19e.pdf) oder diesen QR-Code ![](./Pictures/10038B520000E0B00000E0B004383720.svg)abgerufen werden.

## 6.3 Schutz bei Wartung und Instandsetzung

Um sicherzustellen, dass Wartungs- und Reparaturarbeiten sicher durchgeführt werden können, wird eine **Ergänzung zur Original-Bedienungsanleitung** erstellt. Diese enthält alle sicherheitsrelevanten Informationen für den Fahrzeughalter und das Werkstattpersonal, insbesondere:

- Die exakte Prozedur zur Spannungsfreischaltung des HV-Systems durch Entfernung der MSDs.
- Eindeutige Warnhinweise bezüglich der Gefahren beim Arbeiten am Hochvoltsystem und der Notwendigkeit einer Qualifizierung gemäß DGUV 200-005.
- Eine Erläuterung der HV-spezifischen Warnleuchten und Anzeigen im Kombiinstrument.