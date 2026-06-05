package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class WorkoutRecommendationResponse {

    private String goal;
    private List<String> recommendedWorkouts;

}