package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminStatsResponse {

    private Long totalUsers;

    private Long totalWorkouts;

    private Long totalExercises;

    private Long totalDiets;

    private Long totalProgress;

    private Double avgWorkoutsPerUser;
}