import type { Product } from "@/types/product";
import type { Service } from "@/types/service";

export const mockProducts: Product[] = [
  { id: 1, category_id: 1, product_type: "accessory", name_bn: "ইলেকট্রিক তার", name_en: "Premium Copper Cable", slug: "premium-copper-cable", is_featured: true, is_active: true },
  { id: 2, category_id: 1, product_type: "accessory", name_bn: "এমসিবি", name_en: "Miniature Circuit Breaker", slug: "miniature-circuit-breaker", is_featured: true, is_active: true },
  { id: 3, category_id: 2, product_type: "machinery", name_bn: "ইন্ডাস্ট্রিয়াল ড্রিল", name_en: "Industrial Drill Machine", slug: "industrial-drill-machine", is_featured: false, is_active: true },
];

export const mockServices: Service[] = [
  { id: 1, name_bn: "ইলেকট্রিক্যাল ইন্সটলেশন", name_en: "Electrical Installation", slug: "electrical-installation", price: 3500, is_active: true, sort_order: 1 },
  { id: 2, name_bn: "সাইট ইন্সপেকশন", name_en: "Site Inspection", slug: "site-inspection", price: 1500, is_active: true, sort_order: 2 },
  { id: 3, name_bn: "কাস্টম সল্যুশন", name_en: "Custom Solution Consultation", slug: "custom-solution-consultation", price: null, is_active: true, sort_order: 3 },
  { id: 4, name_bn: "সার্ভিস চার্জ", name_en: "Service Charge", slug: "service-charge", price: 3500, is_active: true, sort_order: 1 },
  { id: 5, name_bn: "ত ", name_en: "Site Inspection", slug: "site-inspection", price: 1500, is_active: true, sort_order: 2 },
  { id: 6, name_bn: "কাস্টম সল্যুশন", name_en: "Custom Solution Consultation", slug: "custom-solution-consultation", price: null, is_active: true, sort_order: 3 },
];
