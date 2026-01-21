interface Category {
  id: string
  name?: string
}

export interface GastoExtraido {
  concepto: string;
  comercio: string;
  monto: number;
  categoria: Category[];
  fecha: string;
}