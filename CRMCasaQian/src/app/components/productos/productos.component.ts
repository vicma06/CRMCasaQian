import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias = ['todas', 'carne', 'mariscos', 'verduras', 'caldos', 'salsas', 'bebidas', 'postres'];
  categoriaSeleccionada = 'todas';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    if (this.categoriaSeleccionada === 'todas') {
      this.productos = this.productoService.getProductos();
    } else {
      this.productos = this.productoService.getProductosPorCategoria(this.categoriaSeleccionada);
    }
  }

  cambiarDisponibilidad(id: number) {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      this.productoService.updateProducto(id, { disponible: !producto.disponible });
      this.cargarProductos();
    }
  }
}
