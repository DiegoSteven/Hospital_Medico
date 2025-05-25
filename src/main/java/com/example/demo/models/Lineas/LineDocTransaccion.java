package com.example.demo.models.lineas;

import java.math.BigDecimal;

import javax.persistence.*;

import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;

@Entity
public class LineDocTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private ServicioMedico servicio;

    @ManyToOne
    private Producto producto;

    private Integer cantidad;

    private BigDecimal precioUnitario;

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    // Método robusto para calcular subtotal incluso si producto o servicio son null
    public BigDecimal getSubtotal() {
        BigDecimal total = BigDecimal.ZERO;

        if (producto != null && producto.getPrecio() != null) {
            total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad != null ? cantidad : 0)));
        }

        if (servicio != null && servicio.getCosto() != null) {
            total = total.add(servicio.getCosto());
        }

        return total;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ServicioMedico getServicio() {
        return servicio;
    }

    public void setServicio(ServicioMedico servicio) {
        this.servicio = servicio;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

}
