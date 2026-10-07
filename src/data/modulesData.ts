import { ModuleDefinition } from '../types/echse';

export const MODULES_DATA: ModuleDefinition[] = [
  // 1. WIRTSCHAFT & RECHT
  {
    id: 1,
    name: 'Juristisches Blueprint- & Behörden-Center',
    category: 'FINANZEN & RECHT',
    shortDesc: 'Rechtssichere Schriftsätze, Mietminderung (§ 536 BGB) & Behörden-Widersprüche.',
    directive: 'Generiert sofort einsetzbare Schriftsätze für Mietminderungen, fristlose Kündigungen, Widersprüche gegen Bescheide, DSGVO-Löschanfragen und Fluggastrechte. Mit interaktivem KI-Rechtsassistenten.',
    economicValue: 'Spart 300 € bis 800 € Anwalts-/Beratungskosten pro Vorgang.',
    iconName: 'Scale',
    status: 'ARMED',
    systemOrigin: 'V6'
  },
  {
    id: 2,
    name: 'Finanz-Souveränität & 48h-Kaufgatter',
    category: 'FINANZEN & RECHT',
    shortDesc: 'Impulskaufsperre (>50 €), Lebensarbeitszeit-Kalkulator & Abo-Radar.',
    directive: 'Hält deine Fixkosten auf dem absoluten Minimum. Sperrt Spontankäufe für 48 Stunden, berechnet die benötigten Lebensarbeitsstunden und kalkuliert die tatsächlichen Kosten pro Nutzung (Cost-Per-Use).',
    economicValue: 'Erzielt durchschnittlich +2.500 € bis +4.800 € jährliche Netto-Ersparnis.',
    iconName: 'Lock',
    status: 'ONLINE',
    systemOrigin: 'V6'
  },

  // 2. HAUSHALT & VORRAT
  {
    id: 3,
    name: 'Vorratskammer, Zero-Food-Waste & Smarte Einkaufsliste',
    category: 'HAUSHALT & VORRAT',
    shortDesc: 'MHD-Ampel, Vorratsbestand & KI-Restekoch für Null Lebensmittelverschwendung.',
    directive: 'Verhindert das Verderben von Lebensmitteln durch Frische-Ampel und Mindesthaltbarkeits-Tracker. Der interaktive KI-Restekoch kreiert 15-Minuten-Gerichte aus ablaufenden Zutaten. Strukturierte Einkaufsliste mit Budget-Deckel.',
    economicValue: 'Spart 800 € bis 1.400 € Lebensmittelkosten pro Jahr; schont Umwelt & Ressourcen.',
    iconName: 'ShoppingBag',
    status: 'ONLINE',
    systemOrigin: 'HYBRID'
  },
  {
    id: 4,
    name: 'Smarter Haushalts- & Wartungs-Takt',
    category: 'HAUSHALT & VORRAT',
    shortDesc: 'Geräteschutz (Entkalkung, Filter, Brandschutz) & smarter Hygiene-Rhythmus.',
    directive: 'Schützt Haushaltsgeräte vor teuren Verschleißschäden durch automatisierte Wartungsintervalle (Kaffeemaschine entkalken, Waschmaschinen-Flusensieb, Dunstabzugshaube Fettfilter). Inklusive KI-Haushalts-Doktor für DIY-Reparaturen.',
    economicValue: 'Verhindert 450 € bis 900 € vorzeitige Geräteneukäufe und Handwerkerrechnungen.',
    iconName: 'Wrench',
    status: 'ONLINE',
    systemOrigin: 'HYBRID'
  },

  // 3. ENERGIE & UMWELT
  {
    id: 5,
    name: 'Umwelt-, Energie- & Nebenkosten-Senker',
    category: 'ENERGIE & UMWELT',
    shortDesc: 'Nutzen für Umwelt & Geldbeutel: Strom-, Gas- & Standby-Killer, Taupunkt-Wächter.',
    directive: 'Berechnet den realen Stromverbrauch und die Jahreskosten von Elektrogeräten, deckt verdeckte Standby-Verluste auf, kalkuliert CO₂-Äquivalente und ermittelt den Taupunkt zur Schimmelprävention ohne Heizverschwendung.',
    economicValue: 'Spart 300 € bis 700 € Strom- & Heizkosten pro Jahr; schont Klima & Geldbeutel.',
    iconName: 'Zap',
    status: 'OPTIMAL',
    systemOrigin: 'HYBRID'
  },

  // 4. GÄRTNEREI & AGRO-TECH
  {
    id: 6,
    name: 'Smarte Gärtnerei & Precision Agro-Tech',
    category: 'GÄRTNEREI & AGRO-TECH',
    shortDesc: 'Umfassendes Botanik-OS: Zimmerpflanzen, Kräuter, Balkon & Grow-Zelt mit API-Aktoren.',
    directive: 'Vereint alle Pflanzenwelten: Zimmerpflanzen Urban Jungle, Kräuter- & Microgreen-Lab, Balkon-Permakultur und Indoor CEA Grow-Zelt. Wissenschaftliches VPD mit Blatt-Temperatur-Offset, DLI-Planer, interaktiver KI-Agro-Doktor und echte ausführbare API-Aktoren für Beleuchtung, Bewässerung und Lüftung.',
    economicValue: 'Maximiert Ernteertrag & Raumklima; verhindert Pflanzenschäden und Energieverschwendung (500–1.200 €/Jahr).',
    iconName: 'Sprout',
    status: 'OPTIMAL',
    systemOrigin: 'HYBRID'
  },

  // 5. FAMILIE & GESUNDHEIT
  {
    id: 7,
    name: 'Erdungs-Takt & Haustier-Fürsorge',
    category: 'FAMILIE & GESUNDHEIT',
    shortDesc: 'Lebensanker: Haustiere (Katzen/Hunde Prio 1), Gift-Radar & Bildschirmpausen-Notaus.',
    directive: 'Stellt Haustiere als unumstößlichen Hardware-Interrupt an oberste Stelle. Überwacht Futtervorräte und Fütterungszeiten, bietet lebensrettendes Notfall-Gift-Radar für Pflanzen & Nahrungsmittel sowie interaktiven KI-Tierarzt-Ratgeber.',
    economicValue: 'Schützt vor kognitivem Burnout & erhält die Gesundheit von Tier und Mensch (spart teure Tierarzt-Notfälle).',
    iconName: 'Cat',
    status: 'OPTIMAL',
    systemOrigin: 'V7'
  },

  // 6. SCHUTZ & SOUVERÄNITÄT
  {
    id: 8,
    name: 'Kommunikations-Filter & Reiz-Schutz',
    category: 'SCHUTZ & SOUVERÄNITÄT',
    shortDesc: 'Schmeißt 85% Textmüll raus; dekodiert toxische Manipulation & Gaslighting.',
    directive: 'Filtert passiv-aggressive Mails, Vorwürfe und bürokratischen Ballast. Dekodiert Manipulationstaktiken (Gaslighting, künstlicher Zeitdruck, Schuldumkehr) und generiert kühle, juristisch unangreifbare Gegenschriften.',
    economicValue: 'Spart täglich bis zu 45 Minuten Lesezeit & schützt vor emotionalen und juristischen Fallen.',
    iconName: 'Trash2',
    status: 'ARMED',
    systemOrigin: 'V6'
  },
  {
    id: 9,
    name: 'Strategisches War-Gaming & Entscheidungs-Matrix',
    category: 'SCHUTZ & SOUVERÄNITÄT',
    shortDesc: 'Gnadenloser Stresstest für Lebens-, Job- & Finanzentscheidungen vor dem Ernstfall.',
    directive: 'Berechnet vor riskanten Schritten (Jobwechsel, Umzug, Großanschaffung) den Best Case, Worst Case und Most Likely Case. Formuliert unerbittliche Stop-Loss Kriterien und quantifiziert Eintrittswahrscheinlichkeiten.',
    economicValue: 'Verhindert existenzgefährdende Fehlinvestitionen und kostspielige Vertragsfallen.',
    iconName: 'TrendingUp',
    status: 'ONLINE',
    systemOrigin: 'HYBRID'
  },

  // 7. MENSCHLICHKEIT & RESONANZ
  {
    id: 10,
    name: 'Symbiosis-Raum & Mentale Resonanz',
    category: 'FAMILIE & GESUNDHEIT',
    shortDesc: 'Geschützter Zuhör-Raum: Empathie ohne Belehrung, Sinn- & Wertekompass.',
    directive: 'Schaltet jede rationale Problemlösung ab. Bietet echten empathischen Dialog mit Gemini KI, spiegelt Gefühle wider, begleitet achtsam durch Isolation/Überreizung und verankert das Handeln im Sinn- und Wertekompass.',
    economicValue: 'Unbezahlbare seelische Entlastung, Angstreduktion & dauerhafte innere Ruhe.',
    iconName: 'HeartHandshake',
    status: 'WARM',
    systemOrigin: 'V7'
  },

  // 8. SOUVERÄNITÄT & AUTARKIE
  {
    id: 11,
    name: 'Zero-Decay Datentresor & Autarkie',
    category: 'SCHUTZ & SOUVERÄNITÄT',
    shortDesc: '100% lokale Datenhoheit, kein Cloud-Abo-Zwang & 1-Klick-Backup.',
    directive: 'Unvergänglicher Wissens- und Faktenspeicher. Arbeitet vollständig lokal und container-isoliert. Ermöglicht 1-Klick Komplett-Export & Import aller Daten, Verträge und Notizen ohne Cloud-Abhängigkeit.',
    economicValue: 'Macht unabhängig von teuren Cloud-Abonnements (120-300 €/Jahr) & sichert Privatsphäre.',
    iconName: 'Database',
    status: 'ONLINE',
    systemOrigin: 'V6'
  }
];
