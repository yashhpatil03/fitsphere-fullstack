package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.AdminDashboardResponse;
import com.fitsphere.backend.dto.AdminStatsResponse;
import com.fitsphere.backend.dto.AdminUserResponse;
import com.fitsphere.backend.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.fitsphere.backend.entity.User;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final DietRepository dietRepository;
    private final ProgressRepository progressRepository;

    public AdminController(
            UserRepository userRepository,
            WorkoutRepository workoutRepository,
            ExerciseRepository exerciseRepository,
            DietRepository dietRepository,
            ProgressRepository progressRepository
    ) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.dietRepository = dietRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return new AdminDashboardResponse(

                userRepository.count(),

                workoutRepository.count(),

                exerciseRepository.count(),

                dietRepository.count(),

                progressRepository.count()
        );
    }
    @GetMapping("/stats")
    public AdminStatsResponse getStats() {

        long users = userRepository.count();

        long workouts = workoutRepository.count();

        double avg =
                users == 0
                        ? 0
                        : (double) workouts / users;

        return new AdminStatsResponse(
                users,
                workouts,
                exerciseRepository.count(),
                dietRepository.count(),
                progressRepository.count(),
                avg
        );
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getGoal(),
                        user.getRole()
                ))
                .toList();
    }
}