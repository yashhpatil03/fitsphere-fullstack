package com.fitsphere.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProgressRequest {
    private Double weight;
    private LocalDate progressDate;
}