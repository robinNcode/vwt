export type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  grand_total: number;
  status: string;
  payment_status: string;
  created_at?: string;
  updated_at?: string;
};

