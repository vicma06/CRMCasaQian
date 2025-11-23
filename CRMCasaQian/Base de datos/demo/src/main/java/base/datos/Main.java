package base.datos;

import base.datos.model.Usuario;
import base.datos.repository.UsuarioRepository;
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
    public CommandLineRunner initData(UsuarioRepository usuarioRepository) {
        return args -> {
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
        };
    }
}