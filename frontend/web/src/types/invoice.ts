export type Invoice = {
  id: number;
  order_id: number;
  invoice_number: string;
  issued_at?: string;
  pdf_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

