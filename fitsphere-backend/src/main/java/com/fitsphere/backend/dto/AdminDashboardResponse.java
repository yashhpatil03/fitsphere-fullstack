package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalWorkouts;

    private Long totalExercises;

    private Long totalDietRecords;

    private Long totalProgressRecords;
}