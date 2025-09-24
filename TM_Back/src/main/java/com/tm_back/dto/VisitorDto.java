package com.tm_back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VisitorDto {
    private String label; // 일자(date) 또는 월(month)
    private long count;
}