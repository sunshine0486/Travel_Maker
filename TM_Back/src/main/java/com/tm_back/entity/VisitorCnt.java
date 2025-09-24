package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "visitor_cnt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorCnt {

    @Id
    @Column(name = "visitor_day")
    private LocalDate visitorDay; // 날짜 (PK)

    private Long cnt;
}
