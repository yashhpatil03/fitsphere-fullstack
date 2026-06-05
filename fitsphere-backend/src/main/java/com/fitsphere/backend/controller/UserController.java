package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fitsphere.backend.dto.DashboardResponse;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(@RequestBody @Valid UserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    @PutMapping("/profile")
    public void updateProfile(
            @RequestBody @Valid UpdateProfileRequest request,
            Authentication authentication) {

        userService.updateProfile(request, authentication);
    }
    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication authentication) {

        return userService.getProfile(authentication);
    }
    @GetMapping("/bmi")
    public BmiResponse getBmi(Authentication authentication) {

        return userService.getBmi(authentication);
    }
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(Authentication authentication) {

        return userService.getDashboard(authentication);
    }
    @GetMapping("/weekly-report")
    public WeeklyReportResponse getWeeklyReport(
            Authentication authentication) {

        return userService.getWeeklyReport(
                authentication
        );
    }
    @GetMapping("/monthly-report")
    public MonthlyReportResponse getMonthlyReport(
            Authentication authentication) {

        return userService.getMonthlyReport(
                authentication
        );
    }
    @GetMapping("/streak")
    public StreakResponse getCurrentStreak(
            Authentication authentication) {

        return userService.getCurrentStreak(
                authentication
        );
    }
    @GetMapping("/recommendations/workout")
    public WorkoutRecommendationResponse
    getWorkoutRecommendations(
            Authentication authentication) {

        return userService
                .getWorkoutRecommendations(
                        authentication
                );
    }
    @GetMapping("/recommendations/diet")
    public DietRecommendationResponse
    getDietRecommendations(
            Authentication authentication) {

        return userService
                .getDietRecommendations(
                        authentication
                );
    }
    @GetMapping("/fitness-score")
    public FitnessScoreResponse getFitnessScore(
            Authentication authentication) {

        return userService.getFitnessScore(
                authentication
        );
    }
    @GetMapping("/goal-progress")
    public GoalProgressResponse getGoalProgress(
            Authentication authentication) {

        return userService.getGoalProgress(
                authentication
        );
    }
}