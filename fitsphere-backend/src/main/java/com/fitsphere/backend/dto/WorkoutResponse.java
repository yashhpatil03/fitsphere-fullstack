package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class WorkoutResponse {

    private Long id;
    private String title;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDate workoutDate;
}