export interface Producto {
  id: number;
  nombre: string;
  categoria: 'carne' | 'pollo' | 'mariscos' | 'verduras' | 'salsas' | 'bebidas' | 'postres' | 'caldos' | 'caldos hotpot' | 'hidratos';
  precio: number;
  descripcion?: string;
  disponible: boolean;
  imagen?: string;
  picante: boolean;
  alergenos?: string[];
}
