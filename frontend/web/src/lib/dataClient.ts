import { apiFetch } from "@/lib/api";
import { mockProducts, mockServices } from "@/lib/mockData";
import type { ContactMessagePayload } from "@/types/contact";
import type { Product } from "@/types/product";
import type { Quotation, QuotationItemPayload } from "@/types/quotation";
import type { Service } from "@/types/service";

export async function getProductsSafe(): Promise<{ items: Product[]; source: "api" | "mock" }> {
  try {
    const res = await apiFetch<Product[]>("/products");
    return { items: res.data, source: "api" };
  } catch {
    return { items: mockProducts, source: "mock" };
  }
}

export async function getServicesSafe(): Promise<{ items: Service[]; source: "api" | "mock" }> {
  try {
    const res = await apiFetch<Service[]>("/services");
    return { items: res.data, source: "api" };
  } catch {
    return { items: mockServices, source: "mock" };
  }
}

export async function submitContact(payload: ContactMessagePayload): Promise<{ source: "api" | "mock" }> {
  try {
    await apiFetch("/contact-messages", { method: "POST", body: JSON.stringify(payload) });
    return { source: "api" };
  } catch {
    return { source: "mock" };
  }
}

export async function submitQuotation(payload: {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  items: QuotationItemPayload[];
}): Promise<{ source: "api" | "mock"; quotation?: Quotation }> {
  try {
    const res = await apiFetch<Quotation>("/quotations", { method: "POST", body: JSON.stringify(payload) });
    return { source: "api", quotation: res.data };
  } catch {
    return { source: "mock" };
  }
}
