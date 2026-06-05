package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.service.DietService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diets")
public class DietController {

    private final DietService dietService;

    public DietController(DietService dietService) {
        this.dietService = dietService;
    }

    @PostMapping
    public void addDiet(@RequestBody DietRequest request,
                        Authentication authentication) {

        dietService.addDiet(
                request,
                authentication
        );
    }
    @GetMapping
    public List<DietResponse> getMyDiets(
            Authentication authentication) {

        return dietService.getMyDiets(
                authentication
        );
    }
    @PutMapping("/{id}")
    public void updateDiet(@PathVariable Long id,
                           @RequestBody DietRequest request,
                           Authentication authentication) {

        dietService.updateDiet(
                id,
                request,
                authentication
        );
    }
    @DeleteMapping("/{id}")
    public void deleteDiet(@PathVariable Long id,
                           Authentication authentication) {

        dietService.deleteDiet(
                id,
                authentication
        );
    }
    @GetMapping("/summary/today")
    public DailyNutritionResponse getTodaySummary(
            Authentication authentication) {

        return dietService.getTodaySummary(
                authentication
        );
    }
    @GetMapping("/calorie-goal")
    public CalorieGoalResponse getCalorieGoalStatus(
            Authentication authentication) {

        return dietService.getCalorieGoalStatus(
                authentication
        );
    }
    @GetMapping("/streak")
    public DietStreakResponse getDietStreak(
            Authentication authentication) {

        return dietService.getDietStreak(authentication);
    }
}