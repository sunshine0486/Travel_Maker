package com.tm_back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class VisitorCnt {

    @Id
    @Column(name = "visitor_day")
    private LocalDate visitDate;  // 날짜가 PK
    @Column(name = "cnt")
    private long count;

    public VisitorCnt(LocalDate visitDate, long count) {
        this.visitDate = visitDate;
        this.count = count;
    }

    public void increment() {
        this.count++;
    }
}

