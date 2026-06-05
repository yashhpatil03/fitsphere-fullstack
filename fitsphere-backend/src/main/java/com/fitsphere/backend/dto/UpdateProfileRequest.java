package com.fitsphere.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotNull
    private Integer age;

    @NotNull
    private String gender;

    @NotNull
    private Double height;

    @NotNull
    private Double weight;

    @NotNull
    private String goal;

    private Integer dailyCalorieGoal;
}