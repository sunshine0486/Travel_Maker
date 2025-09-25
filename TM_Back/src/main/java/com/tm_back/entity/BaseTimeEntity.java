package com.tm_back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class) // auditing 기능 적용
@MappedSuperclass // 공통 매핑 정보만 제공
@Getter
@Setter
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(name = "reg_time", updatable = false, columnDefinition = "DATETIME(0)")
    private LocalDateTime regTime;   // 생성 시각

    @LastModifiedDate
    @Column(name = "update_time", columnDefinition = "DATETIME(0)")
    private LocalDateTime updateTime; // 수정 시각


}
