package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DietRecommendationResponse {

    private String goal;
    private List<String> recommendedMeals;
}