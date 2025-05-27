package com.example.demo.models.lineas;

import java.math.BigDecimal;

import javax.persistence.*;

import com.example.demo.models.Producto;
import com.example.demo.models.ServicioMedico;

@MappedSuperclass
public abstract class LineaDocTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private ServicioMedico servicio;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private Integer cantidad;

    public BigDecimal getSubtotal() {
        if (producto != null && producto.getPrecio() != null) {
            return producto.getPrecio().multiply(BigDecimal.valueOf(cantidad != null ? cantidad : 0));
        }

        if (servicio != null && servicio.getCosto() != null) {
            return servicio.getCosto();
        }

        return BigDecimal.ZERO;
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
