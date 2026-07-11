export type Client = {
  id: number;
  name: string;
  phone: string | null;
  unit_name: string | null;
  created_at: string;
};

export type CreateClientInput = {
  name: string;
  phone?: string;
  unitName?: string;
};