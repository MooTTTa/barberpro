package com.barberpro.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "barbeiros")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Role role = Role.BARBEIRO;

    private String nome;

    public enum Role { ADMIN, BARBEIRO }
}
