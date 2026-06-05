package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CalorieGoalResponse {

    private int goalCalories;
    private int consumedCalories;
    private int remainingCalories;
}