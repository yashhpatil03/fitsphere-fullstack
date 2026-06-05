package com.fitsphere.backend.dto;

import java.time.LocalDate;

public class DietResponse {

    private Long id;
    private String mealName;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private LocalDate mealDate;

    public DietResponse(Long id,
                        String mealName,
                        Integer calories,
                        Integer protein,
                        Integer carbs,
                        Integer fats,
                        LocalDate mealDate) {

        this.id = id;
        this.mealName = mealName;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
        this.mealDate = mealDate;
    }

    public Long getId() {
        return id;
    }

    public String getMealName() {
        return mealName;
    }

    public Integer getCalories() {
        return calories;
    }

    public Integer getProtein() {
        return protein;
    }

    public Integer getCarbs() {
        return carbs;
    }

    public Integer getFats() {
        return fats;
    }

    public LocalDate getMealDate() {
        return mealDate;
    }
}