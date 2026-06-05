package com.fitsphere.backend.service;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.entity.Diet;
import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.exception.UserNotFoundException;
import com.fitsphere.backend.repository.DietRepository;
import com.fitsphere.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

import java.util.List;

@Service
public class DietService {

    private final DietRepository dietRepository;
    private final UserRepository userRepository;

    public DietService(DietRepository dietRepository,
                       UserRepository userRepository) {

        this.dietRepository = dietRepository;
        this.userRepository = userRepository;
    }

    public void addDiet(DietRequest request,
                        Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Diet diet = new Diet();

        diet.setMealName(request.getMealName());
        diet.setCalories(request.getCalories());
        diet.setProtein(request.getProtein());
        diet.setCarbs(request.getCarbs());
        diet.setFats(request.getFats());
        diet.setMealDate(request.getMealDate());

        diet.setUser(user);

        dietRepository.save(diet);
    }
    public List<DietResponse> getMyDiets(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return dietRepository.findByUser(user)
                .stream()
                .map(diet -> new DietResponse(
                        diet.getId(),
                        diet.getMealName(),
                        diet.getCalories(),
                        diet.getProtein(),
                        diet.getCarbs(),
                        diet.getFats(),
                        diet.getMealDate()
                ))
                .toList();
    }
    public void updateDiet(Long dietId,
                           DietRequest request,
                           Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Diet diet = dietRepository
                .findByIdAndUser(dietId, user)
                .orElseThrow(() ->
                        new RuntimeException("Diet not found"));

        diet.setMealName(request.getMealName());
        diet.setCalories(request.getCalories());
        diet.setProtein(request.getProtein());
        diet.setCarbs(request.getCarbs());
        diet.setFats(request.getFats());
        diet.setMealDate(request.getMealDate());

        dietRepository.save(diet);
    }
    public void deleteDiet(Long dietId,
                           Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Diet diet = dietRepository
                .findByIdAndUser(dietId, user)
                .orElseThrow(() ->
                        new RuntimeException("Diet not found"));

        dietRepository.delete(diet);
    }
    public DailyNutritionResponse getTodaySummary(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        List<Diet> diets = dietRepository.findByUserAndMealDate(
                user,
                LocalDate.now()
        );

        int totalCalories = diets.stream()
                .mapToInt(Diet::getCalories)
                .sum();

        int totalProtein = diets.stream()
                .mapToInt(Diet::getProtein)
                .sum();

        int totalCarbs = diets.stream()
                .mapToInt(Diet::getCarbs)
                .sum();

        int totalFats = diets.stream()
                .mapToInt(Diet::getFats)
                .sum();

        return new DailyNutritionResponse(
                totalCalories,
                totalProtein,
                totalCarbs,
                totalFats
        );
    }
    public CalorieGoalResponse getCalorieGoalStatus(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        int goalCalories =
                user.getDailyCalorieGoal() == null
                        ? 0
                        : user.getDailyCalorieGoal();

        List<Diet> diets = dietRepository.findByUserAndMealDate(
                user,
                LocalDate.now()
        );

        int consumedCalories = diets.stream()
                .mapToInt(Diet::getCalories)
                .sum();

        int remainingCalories =
                goalCalories - consumedCalories;

        return new CalorieGoalResponse(
                goalCalories,
                consumedCalories,
                remainingCalories
        );
    }
    public DietStreakResponse getDietStreak(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        List<Diet> diets =
                dietRepository.findByUserOrderByMealDateDesc(user);

        if (diets.isEmpty()) {
            return new DietStreakResponse(0);
        }

        List<LocalDate> dates = diets.stream()
                .map(Diet::getMealDate)
                .distinct()
                .toList();

        int streak = 0;
        LocalDate expectedDate = LocalDate.now();

        for (LocalDate date : dates) {

            if (date.equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }

        return new DietStreakResponse(streak);
    }
}