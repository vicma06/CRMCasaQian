import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias = ['todas', 'carne', 'pollo', 'mariscos', 'verduras', 'caldos', 'caldos hotpot', 'hidratos', 'salsas', 'bebidas', 'postres'];
  categoriaSeleccionada = 'todas';
  
  mostrarModal = false;
  modoEdicion = false;
  productoForm: FormGroup;
  productoIdEditar: number | null = null;
  generandoDescripcion = false;
  generandoImagen = false;

  listaAlergenos = [
    'Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 
    'Lácteos', 'Frutos de cáscara', 'Apio', 'Mostaza', 'Sésamo', 
    'Sulfitos', 'Altramuces', 'Moluscos'
  ];

  constructor(
    private productoService: ProductoService,
    public authService: AuthService,
    private fb: FormBuilder,
    private geminiService: GeminiService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['carne', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      imagen: [''],
      alergenos: [[]], // Array vacío inicial
      picante: [false],
      disponible: [true]
    });
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    if (this.categoriaSeleccionada === 'todas') {
      this.productoService.getProductos().subscribe(productos => {
        this.productos = productos;
      });
    } else {
      this.productoService.getProductosPorCategoria(this.categoriaSeleccionada).subscribe(productos => {
        this.productos = productos;
      });
    }
  }

  cambiarDisponibilidad(id: number) {
    const producto = this.productos.find(p => p.id === id);
    if (producto) {
      this.productoService.updateProducto(id, { disponible: !producto.disponible }).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.productoIdEditar = null;
    this.productoForm.reset({
      categoria: 'carne',
      precio: 0,
      disponible: true,
      picante: false,
      imagen: '',
      alergenos: []
    });
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: Producto) {
    this.modoEdicion = true;
    this.productoIdEditar = producto.id;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      alergenos: producto.alergenos || [],
      picante: producto.picante,
      disponible: producto.disponible
    });
    this.mostrarModal = true;
  }

  toggleAlergeno(alergeno: string) {
    const currentAlergenos = this.productoForm.get('alergenos')?.value || [];
    const index = currentAlergenos.indexOf(alergeno);
    
    if (index > -1) {
      // Si ya existe, lo quitamos
      this.productoForm.patchValue({
        alergenos: currentAlergenos.filter((a: string) => a !== alergeno)
      });
    } else {
      // Si no existe, lo añadimos
      this.productoForm.patchValue({
        alergenos: [...currentAlergenos, alergeno]
      });
    }
  }

  isAlergenoSelected(alergeno: string): boolean {
    return (this.productoForm.get('alergenos')?.value as string[]).includes(alergeno);
  }

  generarDescripcionIA() {
    const nombre = this.productoForm.get('nombre')?.value;
    if (!nombre) return;

    this.generandoDescripcion = true;
    this.geminiService.generateDescription(nombre).subscribe({
      next: (desc) => {
        this.productoForm.patchValue({ descripcion: desc });
        this.generandoDescripcion = false;
      },
      error: () => {
        this.generandoDescripcion = false;
      }
    });
  }

  generarImagen() {
    const nombre = this.productoForm.get('nombre')?.value;
    if (!nombre) return;

    this.generandoImagen = true;
    // Usamos Pollinations.ai para generar una imagen basada en el nombre
    const prompt = `delicious food dish ${nombre}, restaurant quality, professional photography, 4k`;
    const encodedPrompt = encodeURIComponent(prompt);
    // Añadimos un timestamp para evitar caché si se regenera
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?n=${new Date().getTime()}`;
    
    // Simulamos un pequeño retardo para UX y asignamos la URL
    setTimeout(() => {
      this.productoForm.patchValue({ imagen: imageUrl });
      this.generandoImagen = false;
    }, 1500);
  }

  guardarProducto() {
    if (this.productoForm.invalid) return;

    const formValue = this.productoForm.value;
    // alergenos ya es un array gracias a toggleAlergeno
    const productoData: any = {
      ...formValue
    };

    if (this.modoEdicion && this.productoIdEditar) {
      this.productoService.updateProducto(this.productoIdEditar, productoData).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    } else {
      this.productoService.addProducto(productoData).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.productoForm.reset();
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}
