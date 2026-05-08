export type QuotationItemPayload = {
  variant_id?: number;
  product_name_en: string;
  sku: string;
  unit_price: number;
  quantity: number;
};

export type Quotation = {
  id: number;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  notes?: string | null;
  status: string;
  items?: Array<{
    id: number;
    quotation_id: number;
    variant_id?: number | null;
    product_name_en: string;
    sku: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }>;
};
