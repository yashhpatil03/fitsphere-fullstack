package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.entity.Workout;
import com.fitsphere.backend.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    public void createWorkout(@RequestBody @Valid WorkoutRequest request,
                              Authentication authentication) {
        workoutService.createWorkout(request, authentication);
    }
    @GetMapping
    public Page<WorkoutResponse> getMyWorkouts(
            Authentication authentication,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy) {

        return workoutService.getMyWorkouts(
                authentication,
                page,
                size,
                sortBy
        );
    }
    @PutMapping("/{id}")
    public void updateWorkout(@PathVariable Long id,
                              @RequestBody @Valid WorkoutRequest request,
                              Authentication authentication) {
        workoutService.updateWorkout(id, request, authentication);
    }
    @DeleteMapping("/{id}")
    public void deleteWorkout(@PathVariable Long id,
                              Authentication authentication) {

        workoutService.deleteWorkout(id, authentication);
    }
    @PostMapping("/{workoutId}/exercises")
    public void addExercise(@PathVariable Long workoutId,
                            @RequestBody @Valid ExerciseRequest request,
                            Authentication authentication) {

        workoutService.addExercise(workoutId, request, authentication);
    }
    @GetMapping("/{workoutId}/exercises")
    public List<ExerciseResponse> getExercises(
            @PathVariable Long workoutId,
            Authentication authentication) {

        return workoutService.getExercises(workoutId, authentication);
    }
    @PutMapping("/{workoutId}/exercises/{exerciseId}")
    public void updateExercise(
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId,
            @RequestBody @Valid ExerciseRequest request,
            Authentication authentication) {

        workoutService.updateExercise(
                workoutId,
                exerciseId,
                request,
                authentication
        );
    }
    @DeleteMapping("/{workoutId}/exercises/{exerciseId}")
    public void deleteExercise(
            @PathVariable Long workoutId,
            @PathVariable Long exerciseId,
            Authentication authentication) {

        workoutService.deleteExercise(
                workoutId,
                exerciseId,
                authentication
        );
    }
    @GetMapping("/search")
    public List<WorkoutResponse> searchWorkouts(
            @RequestParam String title,
            Authentication authentication) {

        return workoutService.searchWorkouts(
                title,
                authentication
        );
    }
    @GetMapping("/recommendations")
    public WorkoutRecommendationResponse getRecommendations(
            @RequestParam String goal) {

        return workoutService
                .getWorkoutRecommendations(goal);
    }
}