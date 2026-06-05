package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProgressAnalyticsResponse {

    private Double startWeight;
    private Double currentWeight;
    private Double change;
    private String trend;
}