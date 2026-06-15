// Types for the property JSON config schema.

export interface PropertyConfig {
  name: string;
  title: string;
  subtitle: string;
  shortName: string;
  description: string;
  siteUrl: string;
  heroImage: string;
  logo: string;
  themeColor: string;
  type: "cottage" | "barn" | string;
}

export interface Contact {
  address: string;
  addressFull: string;
  email: string;
  homePhone: string;
  homePhoneHref: string;
  contacts: Array<{ name: string; phone: string; phoneHref: string }>;
  what3words: string;
  what3wordsUrl: string;
  what3wordsSiteUrl: string;
  mapEmbed: string;
  directions: string[];
  parking: { summary: string; detail: string[] };
}

export interface Restaurant {
  name: string;
  location: string;
  description: string;
  url: string;
  hearts: number;
}

export interface Beach {
  name: string;
  location: string;
  url: string;
  description: string;
  image: string;
}

export interface Attraction {
  name: string;
  location: string;
  url: string;
  title: string;
  description: string;
  image: string;
}

export interface Shop {
  name: string;
  location: string;
  url: string;
  mapEmbed: string;
}

export interface FacilityLink {
  label: string;
  url: string;
  phone?: string;
  phoneHref?: string;
}

export interface Facility {
  id: string;
  icon: string;
  title: string;
  summary: string;
  detail: string[];
  links?: FacilityLink[];
}

export interface ArrivalInfo {
  checkIn: { summary: string; detail: string[] };
  access: { summary: string; detail: string[] };
  welcomePack: { summary: string; detail: string[] };
  wifi: { summary: string; detail: string[] };
}

export interface DepartureItem {
  id: string;
  icon: string;
  title: string;
  summary: string;
  detail: string[];
}

export interface EmergencySection {
  summary: string;
  steps?: string[];
  detail?: string[];
  note?: string;
}

export interface SectionMeta {
  label: string;
  title: string;
  intro?: string;
}

export interface GuidebookData {
  property: PropertyConfig;
  contact: Contact;
  hero: { heading: string; body: string; navbarTitle?: string };
  arrival: ArrivalInfo;
  houseManual: { intro: string; facilities: Facility[] };
  departure: {
    intro: string;
    items: DepartureItem[];
    label?: string;
    title?: string;
  };
  emergency: {
    fire: EmergencySection;
    medical: EmergencySection;
    police: EmergencySection;
  };
  restaurants: Restaurant[];
  beaches: Beach[];
  attractions: Attraction[];
  shopping: Shop[];
  sections?: {
    restaurants?: SectionMeta;
    beaches?: SectionMeta;
    attractions?: SectionMeta;
    shopping?: SectionMeta;
  };
}
