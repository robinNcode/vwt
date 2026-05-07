export type Service = {
  id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  price?: number | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

