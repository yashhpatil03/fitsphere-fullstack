package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private Integer totalWorkouts;

    private Integer totalExercises;

    private Integer totalCaloriesBurned;

    private Double averageWorkoutDuration;
}