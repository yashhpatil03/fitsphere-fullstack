package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoalProgressResponse {

    private double workoutProgress;

    private double calorieProgress;

    private double weightProgress;

    private double overallProgress;
}