package com.fitsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileResponse {

    private String name;

    private String email;

    private Integer age;

    private String gender;

    private Double height;

    private Double weight;

    private String goal;

    private Integer dailyCalorieGoal;
}
