package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private Double weight;
    private LocalDate progressDate;
}