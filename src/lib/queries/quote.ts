import type { QuoteRequest } from "@/types";

export type QuoteFormInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_type: string;
  city: string;
  state: string;
  zip: string;
  guests_count: string;
  message: string;
  how_did_you_hear?: string;
  products_interested?: string[];
};

export type CartOrderInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  how_did_you_hear?: string;
  reference: string;
  items: { sku: string; name: string; qty: number; price: number; slug: string }[];
  local_total?: string;
};

export type { QuoteRequest };
