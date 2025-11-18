export interface Producto {
  id: number;
  nombre: string;
  categoria: 'carne' | 'mariscos' | 'verduras' | 'salsas' | 'bebidas' | 'postres' | 'caldos';
  precio: number;
  descripcion?: string;
  disponible: boolean;
  imagen?: string;
  picante: boolean;
}
