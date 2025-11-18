export interface Reserva {
  id: number;
  clienteId: number;
  nombreCliente?: string;
  fecha: Date;
  hora: string;
  numeroPersonas: number;
  mesaId?: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
}
