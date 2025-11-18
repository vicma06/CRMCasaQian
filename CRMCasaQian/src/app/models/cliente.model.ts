export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaRegistro: Date;
  visitasTotales: number;
  gastoTotal: number;
  preferencias?: string;
  notas?: string;
  vip: boolean;
}
