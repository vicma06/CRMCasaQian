package base.datos.controller;

import base.datos.model.Cliente;
import base.datos.model.Usuario;
import base.datos.repository.ClienteRepository;
import base.datos.repository.UsuarioRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        System.out.println("Intento de login: " + username);

        Optional<Usuario> usuario = usuarioRepository.findByUsernameAndPassword(username, password);

        if (usuario.isPresent()) {
            System.out.println("Login exitoso para: " + username);
            return ResponseEntity.ok(usuario.get());
        } else {
            System.out.println("Login fallido para: " + username);
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales inválidas"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
             return ResponseEntity.badRequest().body(Map.of("message", "El nombre de usuario ya existe"));
        }

        // Crear Cliente asociado
        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre());
        cliente.setApellidos(request.getApellidos());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        cliente.setFechaRegistro(LocalDate.now());
        cliente.setVisitasTotales(0);
        cliente.setGastoTotal(0.0);
        cliente.setVip(false);
        
        Cliente savedCliente = clienteRepository.save(cliente);

        // Crear Usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(request.getPassword());
        usuario.setRole("CLIENTE"); // Default role
        usuario.setCliente(savedCliente);

        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String nombre;
        private String apellidos;
        private String email;
        private String telefono;
        
        // Getters and Setters manually if Lombok fails or just in case
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getApellidos() { return apellidos; }
        public void setApellidos(String apellidos) { this.apellidos = apellidos; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
    }
}
