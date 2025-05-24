package com.example.demo.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.models.DocumentoContable;
import com.example.demo.repositories.DocumentoContableRepository;

@Service
public class DocumentoContableService {

    private final DocumentoContableRepository documentoContableRepository;

    public DocumentoContableService(DocumentoContableRepository documentoContableRepository) {
        this.documentoContableRepository = documentoContableRepository;
    }

    public DocumentoContable guardar(DocumentoContable documento) {
        return documentoContableRepository.save(documento);
    }

    public Optional<DocumentoContable> buscarPorId(Long id) {
        return documentoContableRepository.findById(id);
    }
}
