export type Setting = {
  id: number;
  group: string;
  key: string;
  value?: string | null;
  value_json?: string | null;
  label_bn?: string | null;
  label_en?: string | null;
  updated_at?: string;
};

