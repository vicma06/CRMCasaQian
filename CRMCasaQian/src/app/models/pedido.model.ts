export interface Pedido {
  id: number;
  clienteId: number;
  nombreCliente?: string;
  fecha: Date;
  items: PedidoItem[];
  total: number;
  estado: 'pendiente' | 'preparando' | 'servido' | 'pagado' | 'cancelado';
  mesaId?: number;
  metodoPago?: string;
  notas?: string;
}

export interface PedidoItem {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
