package base.datos;

import base.datos.model.Usuario;
import base.datos.model.Producto;
import base.datos.repository.UsuarioRepository;
import base.datos.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
        return args -> {
            // Inicializar Usuarios
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword("admin");
                admin.setRole("ADMIN");
                usuarioRepository.save(admin);
                System.out.println("Usuario admin creado: admin/admin");
            }
            
            if (usuarioRepository.findByUsername("cliente").isEmpty()) {
                Usuario cliente = new Usuario();
                cliente.setUsername("cliente");
                cliente.setPassword("cliente");
                cliente.setRole("CLIENTE");
                usuarioRepository.save(cliente);
                System.out.println("Usuario cliente creado: cliente/cliente");
            }

            // Inicializar Productos si está vacío
            if (productoRepository.count() == 0) {
                crearProducto(productoRepository, "Pato Laqueado", "carne", 18.50, "Pato asado crujiente servido con crepes, cebollino y salsa hoisin.", false, true);
                crearProducto(productoRepository, "Dim Sum Variado", "entrante", 8.50, "Selección de 4 piezas de dumplings al vapor rellenos de gambas y carne.", false, true);
                crearProducto(productoRepository, "Arroz Tres Delicias", "arroz", 6.50, "Arroz salteado con guisantes, zanahoria, jamón y huevo.", false, true);
                crearProducto(productoRepository, "Pollo Kung Pao", "pollo", 10.50, "Pollo salteado con cacahuetes, verduras y guindilla picante.", true, true);
                crearProducto(productoRepository, "Ternera con Bambú y Setas", "carne", 11.50, "Finas tiras de ternera salteadas con bambú y setas shiitake.", false, true);
                System.out.println("Productos iniciales creados");
            }
        };
    }

    private void crearProducto(ProductoRepository repo, String nombre, String categoria, Double precio, String descripcion, boolean picante, boolean disponible) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setPrecio(precio);
        p.setDescripcion(descripcion);
        p.setPicante(picante);
        p.setDisponible(disponible);
        repo.save(p);
    }
}