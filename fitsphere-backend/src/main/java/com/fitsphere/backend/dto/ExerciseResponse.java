package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ExerciseResponse {

    private Long id;

    private String name;

    private Integer sets;

    private Integer reps;

    private Double weight;
}