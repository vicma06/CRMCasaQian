export interface Reserva {
  id: number;
  clienteId: number;
  nombreCliente?: string;
  fecha: string | Date;
  hora: string;
  numeroPersonas: number;
  mesaId?: number;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
}
