package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BmiResponse {

    private Double bmi;

    private String category;
}