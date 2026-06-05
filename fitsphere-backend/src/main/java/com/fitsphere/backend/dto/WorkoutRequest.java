package com.fitsphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WorkoutRequest {

    @NotBlank
    private String title;

    @NotNull
    private Integer duration;

    @NotNull
    private Integer caloriesBurned;

    private LocalDate workoutDate;
}
