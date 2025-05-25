package com.example.demo.models.lineas;
import java.math.BigDecimal;

import javax.persistence.*;

import com.example.demo.models.Descargo;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class LineaDescargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "line_doc_transaccion_id")
    private LineDocTransaccion lineDocTransaccion;

    @ManyToOne
@JsonBackReference
private Descargo descargo;

    public LineDocTransaccion getLineDocTransaccion() {
        return lineDocTransaccion;
    }

    public void setLineDocTransaccion(LineDocTransaccion lineDocTransaccion) {
        this.lineDocTransaccion = lineDocTransaccion;
    }

    public Descargo getDescargo() {
        return descargo;
    }

    public void setDescargo(Descargo descargo) {
        this.descargo = descargo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public BigDecimal getSubtotal() {
    if (lineDocTransaccion != null) {
        return lineDocTransaccion.getSubtotal();
    } else {
        return BigDecimal.ZERO;
    }
}

}
