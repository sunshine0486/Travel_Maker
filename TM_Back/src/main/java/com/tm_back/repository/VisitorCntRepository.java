package com.tm_back.repository;

import com.tm_back.entity.VisitorCnt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VisitorCntRepository extends JpaRepository<VisitorCnt, LocalDate> {

    List<VisitorCnt> findByVisitDateBetween(LocalDate start, LocalDate end);

}

