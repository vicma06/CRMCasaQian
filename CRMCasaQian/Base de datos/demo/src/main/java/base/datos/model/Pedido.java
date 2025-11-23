package base.datos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long clienteId;
    private String nombreCliente;
    private LocalDate fecha;
    private Double total;
    private String estado;
    private Integer mesaId;
    private String metodoPago;
    private String notas;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<PedidoItem> items;
}
