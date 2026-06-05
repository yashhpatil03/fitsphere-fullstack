package com.fitsphere.backend.service;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.entity.Exercise;
import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.entity.Workout;
import com.fitsphere.backend.exception.UserNotFoundException;
import com.fitsphere.backend.repository.ExerciseRepository;
import com.fitsphere.backend.repository.UserRepository;
import com.fitsphere.backend.repository.WorkoutRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutService(WorkoutRepository workoutRepository,
                          UserRepository userRepository,
                          ExerciseRepository exerciseRepository) {

        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public void createWorkout(WorkoutRequest request,
                              Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = new Workout();

        workout.setTitle(request.getTitle());
        workout.setDuration(request.getDuration());
        workout.setCaloriesBurned(request.getCaloriesBurned());
        workout.setWorkoutDate(request.getWorkoutDate());

        workout.setUser(user);

        workoutRepository.save(workout);
    }

    public Page<WorkoutResponse> getMyWorkouts(
            Authentication authentication,
            int page,
            int size,
            String sortBy) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy)
        );

        return workoutRepository.findByUser(user, pageable)
                .map(workout -> new WorkoutResponse(
                        workout.getId(),
                        workout.getTitle(),
                        workout.getDuration(),
                        workout.getCaloriesBurned(),
                        workout.getWorkoutDate()
                ));
    }

    public void updateWorkout(Long id,
                              WorkoutRequest request,
                              Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        workout.setTitle(request.getTitle());
        workout.setDuration(request.getDuration());
        workout.setCaloriesBurned(request.getCaloriesBurned());
        workout.setWorkoutDate(request.getWorkoutDate());

        workoutRepository.save(workout);
    }

    public void deleteWorkout(Long id,
                              Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        workoutRepository.delete(workout);
    }

    public void addExercise(Long workoutId,
                            ExerciseRequest request,
                            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository
                .findByIdAndUser(workoutId, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        Exercise exercise = new Exercise();

        exercise.setName(request.getName());
        exercise.setSets(request.getSets());
        exercise.setReps(request.getReps());
        exercise.setWeight(request.getWeight());

        exercise.setWorkout(workout);

        exerciseRepository.save(exercise);
    }

    public List<ExerciseResponse> getExercises(
            Long workoutId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository
                .findByIdAndUser(workoutId, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        return exerciseRepository.findByWorkout(workout)
                .stream()
                .map(exercise -> new ExerciseResponse(
                        exercise.getId(),
                        exercise.getName(),
                        exercise.getSets(),
                        exercise.getReps(),
                        exercise.getWeight()
                ))
                .toList();
    }

    public void updateExercise(Long workoutId,
                               Long exerciseId,
                               ExerciseRequest request,
                               Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository
                .findByIdAndUser(workoutId, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        Exercise exercise = exerciseRepository
                .findByIdAndWorkout(exerciseId, workout)
                .orElseThrow(() ->
                        new RuntimeException("Exercise not found"));

        exercise.setName(request.getName());
        exercise.setSets(request.getSets());
        exercise.setReps(request.getReps());
        exercise.setWeight(request.getWeight());

        exerciseRepository.save(exercise);
    }

    public void deleteExercise(Long workoutId,
                               Long exerciseId,
                               Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Workout workout = workoutRepository
                .findByIdAndUser(workoutId, user)
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));

        Exercise exercise = exerciseRepository
                .findByIdAndWorkout(exerciseId, workout)
                .orElseThrow(() ->
                        new RuntimeException("Exercise not found"));

        exerciseRepository.delete(exercise);
    }

    public List<WorkoutResponse> searchWorkouts(
            String title,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return workoutRepository
                .findByUserAndTitleContainingIgnoreCase(
                        user,
                        title
                )
                .stream()
                .map(workout -> new WorkoutResponse(
                        workout.getId(),
                        workout.getTitle(),
                        workout.getDuration(),
                        workout.getCaloriesBurned(),
                        workout.getWorkoutDate()
                ))
                .toList();
    }
    public WorkoutRecommendationResponse getWorkoutRecommendations(
            String goal) {

        List<String> recommendations;

        switch (goal.toLowerCase()) {

            case "weight loss":

                recommendations = List.of(
                        "Running",
                        "Cycling",
                        "Jump Rope",
                        "HIIT Workout"
                );
                break;

            case "muscle gain":

                recommendations = List.of(
                        "Bench Press",
                        "Deadlift",
                        "Squats",
                        "Pull Ups"
                );
                break;

            case "endurance":

                recommendations = List.of(
                        "Swimming",
                        "Jogging",
                        "Rowing",
                        "Burpees"
                );
                break;

            default:

                recommendations = List.of(
                        "Push Ups",
                        "Walking",
                        "Plank",
                        "Bodyweight Squats"
                );
        }

        return new WorkoutRecommendationResponse(
                goal,
                recommendations
        );
    }
}