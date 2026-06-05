package com.fitsphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseRequest {

    @NotBlank
    private String name;

    @NotNull
    private Integer sets;

    @NotNull
    private Integer reps;

    @NotNull
    private Double weight;
}