import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    // Carnes
    { id: 1, nombre: 'Ternera en lonchas finas', categoria: 'carne', precio: 12.80, disponible: true, picante: false, descripcion: 'Carne de ternera cortada finamente para hotpot' },
    { id: 2, nombre: 'Cerdo ibérico', categoria: 'carne', precio: 10.50, disponible: true, picante: false },
    { id: 3, nombre: 'Cordero especiado', categoria: 'carne', precio: 13.20, disponible: true, picante: true },
    { id: 4, nombre: 'Pollo tierno', categoria: 'carne', precio: 9.80, disponible: true, picante: false },
    
    // Mariscos
    { id: 5, nombre: 'Gambas frescas', categoria: 'mariscos', precio: 15.90, disponible: true, picante: false },
    { id: 6, nombre: 'Mejillones', categoria: 'mariscos', precio: 11.20, disponible: true, picante: false },
    { id: 7, nombre: 'Calamares', categoria: 'mariscos', precio: 13.50, disponible: true, picante: false },
    { id: 8, nombre: 'Vieiras', categoria: 'mariscos', precio: 16.80, disponible: true, picante: false },
    
    // Verduras
    { id: 9, nombre: 'Mix de setas', categoria: 'verduras', precio: 7.50, disponible: true, picante: false },
    { id: 10, nombre: 'Bok choy', categoria: 'verduras', precio: 5.20, disponible: true, picante: false },
    { id: 11, nombre: 'Espinacas frescas', categoria: 'verduras', precio: 4.80, disponible: true, picante: false },
    { id: 12, nombre: 'Tofu sedoso', categoria: 'verduras', precio: 6.50, disponible: true, picante: false },
    
    // Caldos
    { id: 13, nombre: 'Caldo de Sichuan picante', categoria: 'caldos', precio: 8.90, disponible: true, picante: true, descripcion: 'Caldo tradicional picante con pimienta de Sichuan' },
    { id: 14, nombre: 'Caldo de pollo suave', categoria: 'caldos', precio: 7.50, disponible: true, picante: false },
    { id: 15, nombre: 'Caldo de miso', categoria: 'caldos', precio: 8.20, disponible: true, picante: false },
    { id: 16, nombre: 'Caldo de tomate', categoria: 'caldos', precio: 7.80, disponible: true, picante: false },
    
    // Salsas
    { id: 17, nombre: 'Salsa de sésamo', categoria: 'salsas', precio: 2.50, disponible: true, picante: false },
    { id: 18, nombre: 'Salsa picante Szechuan', categoria: 'salsas', precio: 2.80, disponible: true, picante: true },
    { id: 19, nombre: 'Salsa de soja especial', categoria: 'salsas', precio: 2.20, disponible: true, picante: false },
    
    // Bebidas
    { id: 20, nombre: 'Té verde', categoria: 'bebidas', precio: 3.50, disponible: true, picante: false },
    { id: 21, nombre: 'Cerveza Tsingtao', categoria: 'bebidas', precio: 4.20, disponible: true, picante: false },
    { id: 22, nombre: 'Zumo natural', categoria: 'bebidas', precio: 3.80, disponible: true, picante: false },
    
    // Postres
    { id: 23, nombre: 'Helado de té verde', categoria: 'postres', precio: 5.50, disponible: true, picante: false },
    { id: 24, nombre: 'Mochi variado', categoria: 'postres', precio: 6.80, disponible: true, picante: false }
  ];

  private nextId = 25;

  constructor() { }

  getProductos(): Producto[] {
    return [...this.productos];
  }

  getProductoById(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  getProductosPorCategoria(categoria: string): Producto[] {
    return this.productos.filter(p => p.categoria === categoria);
  }

  getProductosDisponibles(): Producto[] {
    return this.productos.filter(p => p.disponible);
  }

  addProducto(producto: Omit<Producto, 'id'>): Producto {
    const nuevoProducto: Producto = {
      ...producto,
      id: this.nextId++
    };
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  updateProducto(id: number, producto: Partial<Producto>): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { ...this.productos[index], ...producto };
      return true;
    }
    return false;
  }

  deleteProducto(id: number): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      return true;
    }
    return false;
  }
}
