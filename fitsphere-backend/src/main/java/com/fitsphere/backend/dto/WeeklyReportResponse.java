package com.fitsphere.backend.dto;

public class WeeklyReportResponse {

    private int totalWorkouts;
    private int totalCaloriesBurned;
    private double averageWorkoutDuration;

    public WeeklyReportResponse(int totalWorkouts,
                                int totalCaloriesBurned,
                                double averageWorkoutDuration) {

        this.totalWorkouts = totalWorkouts;
        this.totalCaloriesBurned = totalCaloriesBurned;
        this.averageWorkoutDuration = averageWorkoutDuration;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public int getTotalCaloriesBurned() {
        return totalCaloriesBurned;
    }

    public double getAverageWorkoutDuration() {
        return averageWorkoutDuration;
    }
}