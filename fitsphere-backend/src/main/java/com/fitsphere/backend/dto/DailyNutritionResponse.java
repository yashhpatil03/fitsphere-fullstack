package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DailyNutritionResponse {

    private int totalCalories;
    private int totalProtein;
    private int totalCarbs;
    private int totalFats;
}