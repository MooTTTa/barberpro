package com.barberpro.repository;

import com.barberpro.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    @Query("SELECT a FROM Agendamento a WHERE a.dataHora BETWEEN :inicio AND :fim ORDER BY a.dataHora")
    List<Agendamento> findByPeriodo(@Param("inicio") LocalDateTime inicio,
                                    @Param("fim") LocalDateTime fim);

    @Query("SELECT a FROM Agendamento a WHERE a.dataHora = :dataHora AND a.status != 'CANCELADO'")
    List<Agendamento> findHorarioOcupado(@Param("dataHora") LocalDateTime dataHora);
}
