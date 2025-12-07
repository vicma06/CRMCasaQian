package base.datos.controller;

import base.datos.model.Producto;
import base.datos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/categoria/{categoria}")
    public List<Producto> getProductosByCategoria(@PathVariable String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Producto updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            if (productoDetails.getNombre() != null) producto.setNombre(productoDetails.getNombre());
            if (productoDetails.getCategoria() != null) producto.setCategoria(productoDetails.getCategoria());
            if (productoDetails.getPrecio() != null) producto.setPrecio(productoDetails.getPrecio());
            if (productoDetails.getDescripcion() != null) producto.setDescripcion(productoDetails.getDescripcion());
            if (productoDetails.getImagen() != null) producto.setImagen(productoDetails.getImagen());
            if (productoDetails.getDisponible() != null) producto.setDisponible(productoDetails.getDisponible());
            if (productoDetails.getPicante() != null) producto.setPicante(productoDetails.getPicante());
            
            return productoRepository.save(producto);
        }
        return null;
    }
    
    @DeleteMapping("/{id}")
    public void deleteProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }
}
