package base.datos.controller;

import base.datos.model.Cliente;
import base.datos.model.Usuario;
import base.datos.repository.ClienteRepository;
import base.datos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    // List all users (for Admin)
    @GetMapping
    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }

    // Get specific user
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUser(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Role (Admin only)
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> roleData) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            String newRole = roleData.get("role");
            if ("ADMIN".equals(newRole) || "CLIENTE".equals(newRole)) {
                usuario.setRole(newRole);
                return ResponseEntity.ok(usuarioRepository.save(usuario));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Rol inválido"));
            }
        }
        return ResponseEntity.notFound().build();
    }

    // Update Profile (User or Admin)
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, Object> profileData) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // Update password if provided
            if (profileData.containsKey("password") && profileData.get("password") != null && !((String)profileData.get("password")).isEmpty()) {
                usuario.setPassword((String) profileData.get("password"));
            }

            // Update Cliente details if linked
            if (usuario.getCliente() != null) {
                Cliente cliente = usuario.getCliente();
                if (profileData.containsKey("nombre")) cliente.setNombre((String) profileData.get("nombre"));
                if (profileData.containsKey("apellidos")) cliente.setApellidos((String) profileData.get("apellidos"));
                if (profileData.containsKey("email")) cliente.setEmail((String) profileData.get("email"));
                if (profileData.containsKey("telefono")) cliente.setTelefono((String) profileData.get("telefono"));
                
                clienteRepository.save(cliente);
            }
            
            return ResponseEntity.ok(usuarioRepository.save(usuario));
        }
        return ResponseEntity.notFound().build();
    }
}
