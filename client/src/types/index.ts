export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  description: string;
  cuisineType: CuisineType;
  contactInfo: ContactInfo;
  locations: Location[];
  menu: MenuItem[];
  images: string[];
  paymentMethods: PaymentMethod[];
  ratings: Rating;
  reviews: Review[];
  isOpen: boolean;
}

export type CuisineType =
  | "Mexican"
  | "Japanese"
  | "Greek"
  | "French"
  | "Thai"
  | "Indian"
  | "Italian"
  | "American"
  | "Chinese"
  | "Other";

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Location {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  schedules: Schedule[];
}

export interface Schedule {
  day: Day;
  open: string;
  close: string;
}

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  popular?: boolean;
  dietary?: string[];
  image?: string;
}

export type PaymentMethod = "Cash" | "Card" | "Mobile";

export interface Rating {
  average: number;
  count: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedVendors: string[];
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export interface FilterOptions {
  search: string;
  distance: number;
  cuisineTypes: CuisineType[];
  priceRange: string[];
  openNow: boolean;
}

export type PriceRange = "$" | "$$" | "$$$";

export type ViewMode = "list" | "map";

export interface RegistrationFormData {
  businessName: string;
  cuisineType: CuisineType;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  description: string;
  image?: File;
  termsConditions: boolean;
}
