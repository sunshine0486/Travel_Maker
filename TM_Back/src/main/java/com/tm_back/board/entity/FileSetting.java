package com.tm_back.board.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "filesetting")
@Getter
@Setter
@ToString
public class FileSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_setting_id")
    private Long id;

    @Column(nullable = false)
    private Integer maxUploadCnt;

    @Column(nullable = false)
    private Long fileMaxUploadSize; // byte 단위

    @Column( nullable = false)
    private String allowedExtension;
}
