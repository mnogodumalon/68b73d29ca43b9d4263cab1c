// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface BproBeteiligte {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    mitarbeiter?: string; // applookup -> URL zu 'BproMitarbeiter' Record
    beschlussprotokoll?: string; // applookup -> URL zu 'BproBeschlussprotokoll' Record
    typ?: 'kenntnisnahme' | 'zustimmung';
    erledigt?: boolean;
  };
}

export interface BproAufgaben {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    erinnerung_versendet?: boolean;
    beschreibung?: string;
    erledigt?: boolean;
    bearbeiter?: string;
    faellig?: string; // Format: YYYY-MM-DD oder ISO String
    datei_bild_12?: string;
    datei_bild_22?: string;
    datei_bild_32?: string;
    kunden_interaktion?: string; // applookup -> URL zu 'BproBeschlussprotokoll' Record
  };
}

export interface BproMitarbeiter {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    funktion?: string;
    e_mail?: string;
    bereich?: string;
  };
}

export interface BproBeschlussprotokoll {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    letzte_erinnerung?: string; // Format: YYYY-MM-DD oder ISO String
    ort?: string;
    bild_1?: string;
    text_1?: string;
    erinnerung_versendet?: boolean;
    status?: 'in_planung' | 'aktuell' | 'abgeschlossen_archiv' | 'archiv';
    erinnerung?: string; // Format: YYYY-MM-DD oder ISO String
    zweck2?: string;
    mitarbeiter?: string;
    datum?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface BproHowto {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    beschriftung?: string;
    text_farbe_dunkel?: string;
    hintergrund_farbe_1_dunkel?: string;
    hintergrund_farbe_2_dunkel?: string;
    hintergrund_bild_dunkel2?: string;
    breite_mobil?: number;
    hoehe_mobil?: number;
    spalte_mobil?: number;
    breite_tablet2?: number;
    hoehe_tablet2?: number;
    spalte_tablet2?: number;
    breite_desktop2?: number;
    hoehe_desktop2?: number;
    spalte_desktop2?: number;
    breite_widescreen2?: number;
    hoehe_widescreen2?: number;
    spalte_widescreen2?: number;
    breite_fullhd?: number;
    hoehe_fullhd2?: number;
    spalte_fullhd2?: number;
    icon?: string;
    beschreibung?: string;
    title?: string;
    parameter_ist_pflichtfeld?: boolean;
    parameter_identifizierer?: string;
    target?: string;
    css_class?: string;
    url?: string;
    reihenfolge?: number;
    hintergrund?: 'einfache_farbe' | 'linearer_farbverlauf' | 'kreisfoermiger_farbverlauf' | 'bild';
    text_farbe?: string;
    hintergrund_farbe_1?: string;
    hintergrund_farbe_2?: string;
    hintergrund_bild?: string;
    darstellung?: 'titel' | 'karte';
    uebergeordnetes_panel?: string; // applookup -> URL zu 'BproHowto' Record
  };
}

export interface BproBerichte {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    datum?: string; // Format: YYYY-MM-DD oder ISO String
    notiz?: string;
    datei_bild_1?: string;
    datei_bild_3?: string;
    autor?: string;
    kd_interaktion?: string; // applookup -> URL zu 'BproBeschlussprotokoll' Record
    datei_bild_2?: string;
  };
}

export interface BproTemplates {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    dummy?: string;
  };
}

export const APP_IDS = {
  BPRO_BETEILIGTE: '66d5c047fbcc2c0f7d2728cf',
  BPRO_AUFGABEN: '66d585471f439cf065e31328',
  BPRO_MITARBEITER: '66d5854721398e70e4b91640',
  BPRO_BESCHLUSSPROTOKOLL: '66d585474669a57f9e3d6197',
  BPRO_HOWTO: '66d5dafdf1988425a91b6510',
  BPRO_BERICHTE: '66d5854790409f2f0017c0f1',
  BPRO_TEMPLATES: '66d585476915c5bd09295b50',
} as const;

// Helper Types for creating new records
export type CreateBproBeteiligte = BproBeteiligte['fields'];
export type CreateBproAufgaben = BproAufgaben['fields'];
export type CreateBproMitarbeiter = BproMitarbeiter['fields'];
export type CreateBproBeschlussprotokoll = BproBeschlussprotokoll['fields'];
export type CreateBproHowto = BproHowto['fields'];
export type CreateBproBerichte = BproBerichte['fields'];
export type CreateBproTemplates = BproTemplates['fields'];