export type Product = {
  id: number;
  category_id: number;
  product_type: string;
  sku_prefix?: string | null;
  name_bn: string;
  name_en: string;
  slug: string;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

