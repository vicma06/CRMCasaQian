package base.datos.controller;

import base.datos.model.Reserva;
import base.datos.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return reservaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reserva createReserva(@RequestBody Reserva reserva) {
        return reservaRepository.save(reserva);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long id, @RequestBody Reserva reservaDetails) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    reserva.setFecha(reservaDetails.getFecha());
                    reserva.setHora(reservaDetails.getHora());
                    reserva.setNumeroPersonas(reservaDetails.getNumeroPersonas());
                    reserva.setNotas(reservaDetails.getNotas());
                    reserva.setEstado(reservaDetails.getEstado());
                    reserva.setMesaId(reservaDetails.getMesaId());
                    // No actualizamos clienteId/nombreCliente normalmente
                    return ResponseEntity.ok(reservaRepository.save(reserva));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteReserva(@PathVariable Long id) {
        reservaRepository.deleteById(id);
    }
}
