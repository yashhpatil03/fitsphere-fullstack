package com.fitsphere.backend.service;

import com.fitsphere.backend.dto.*;
import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.exception.DuplicateEmailException;
import com.fitsphere.backend.exception.UserNotFoundException;
import com.fitsphere.backend.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fitsphere.backend.dto.DashboardResponse;
import com.fitsphere.backend.entity.Exercise;
import com.fitsphere.backend.entity.Workout;
import java.time.LocalDate;
import com.fitsphere.backend.dto.WeeklyReportResponse;
import java.time.LocalDate;
import java.util.List;

import com.fitsphere.backend.entity.Diet;
import com.fitsphere.backend.entity.Progress;
import com.fitsphere.backend.dto.GoalProgressResponse;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkoutRepository workoutRepository;
    private final DietRepository dietRepository;
    private final ProgressRepository progressRepository;
    private final ExerciseRepository exerciseRepository;

    public UserService(
            UserRepository userRepository,
            WorkoutRepository workoutRepository,
            ExerciseRepository exerciseRepository,
            DietRepository dietRepository,
            ProgressRepository progressRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.dietRepository = dietRepository;
        this.progressRepository = progressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .toList();
    }
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        userRepository.delete(user);
    }
    public void updateProfile(UpdateProfileRequest request,
                              Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setGoal(request.getGoal());

        user.setDailyCalorieGoal(
                request.getDailyCalorieGoal()
        );

        userRepository.save(user);
    }
    public ProfileResponse getProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getGender(),
                user.getHeight(),
                user.getWeight(),
                user.getGoal(),
                user.getDailyCalorieGoal()
        );
    }
    public BmiResponse getBmi(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        double heightInMeters = user.getHeight() / 100;

        double bmi = user.getWeight() /
                (heightInMeters * heightInMeters);

        bmi = Math.round(bmi * 100.0) / 100.0;

        String category;

        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 25) {
            category = "Normal Weight";
        } else if (bmi < 30) {
            category = "Overweight";
        } else {
            category = "Obese";
        }

        return new BmiResponse(bmi, category);
    }
    public DashboardResponse getDashboard(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Workout> workouts = workoutRepository.findByUser(user);

        int totalWorkouts = workouts.size();

        int totalCaloriesBurned = workouts.stream()
                .mapToInt(Workout::getCaloriesBurned)
                .sum();

        double averageWorkoutDuration = workouts.stream()
                .mapToInt(Workout::getDuration)
                .average()
                .orElse(0);

        List<Exercise> exercises =
                exerciseRepository.findByWorkoutIn(workouts);

        int totalExercises = exercises.size();

        return new DashboardResponse(
                totalWorkouts,
                totalExercises,
                totalCaloriesBurned,
                averageWorkoutDuration
        );
    }
    public WeeklyReportResponse getWeeklyReport(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        LocalDate oneWeekAgo =
                LocalDate.now().minusDays(7);

        List<Workout> workouts =
                workoutRepository.findByUserAndWorkoutDateAfter(
                        user,
                        oneWeekAgo
                );

        int totalWorkouts = workouts.size();

        int totalCaloriesBurned = workouts.stream()
                .mapToInt(Workout::getCaloriesBurned)
                .sum();

        double averageWorkoutDuration = workouts.stream()
                .mapToInt(Workout::getDuration)
                .average()
                .orElse(0);

        return new WeeklyReportResponse(
                totalWorkouts,
                totalCaloriesBurned,
                averageWorkoutDuration
        );
    }
    public MonthlyReportResponse getMonthlyReport(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        LocalDate oneMonthAgo =
                LocalDate.now().minusDays(30);

        List<Workout> workouts =
                workoutRepository.findByUserAndWorkoutDateAfter(
                        user,
                        oneMonthAgo
                );

        int totalWorkouts = workouts.size();

        int totalCaloriesBurned = workouts.stream()
                .mapToInt(Workout::getCaloriesBurned)
                .sum();

        double averageWorkoutDuration = workouts.stream()
                .mapToInt(Workout::getDuration)
                .average()
                .orElse(0);

        return new MonthlyReportResponse(
                totalWorkouts,
                totalCaloriesBurned,
                averageWorkoutDuration
        );
    }
    public StreakResponse getCurrentStreak(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        List<Workout> workouts =
                workoutRepository.findByUserOrderByWorkoutDateDesc(user);

        if (workouts.isEmpty()) {
            return new StreakResponse(0);
        }

        int streak = 1;

        LocalDate previousDate =
                workouts.get(0).getWorkoutDate();

        for (int i = 1; i < workouts.size(); i++) {

            LocalDate currentDate =
                    workouts.get(i).getWorkoutDate();

            long difference =
                    ChronoUnit.DAYS.between(
                            currentDate,
                            previousDate
                    );

            if (difference == 1) {
                streak++;
                previousDate = currentDate;
            } else if (difference == 0) {
                continue;
            } else {
                break;
            }
        }

        return new StreakResponse(streak);
    }
    public WorkoutRecommendationResponse getWorkoutRecommendations(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        String goal = user.getGoal();

        List<String> recommendations;

        if ("Weight Loss".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Running",
                    "Cycling",
                    "Jump Rope",
                    "HIIT Training"
            );

        } else if ("Muscle Gain".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Bench Press",
                    "Squats",
                    "Deadlifts",
                    "Pull Ups"
            );

        } else if ("Maintain Fitness".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Jogging",
                    "Push Ups",
                    "Bodyweight Squats",
                    "Plank"
            );

        } else {

            recommendations = List.of(
                    "Walking",
                    "Stretching",
                    "Light Cardio"
            );
        }

        return new WorkoutRecommendationResponse(
                goal,
                recommendations
        );
    }
    public DietRecommendationResponse getDietRecommendations(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        String goal = user.getGoal();

        List<String> recommendations;

        if ("Weight Loss".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Oats",
                    "Salad",
                    "Grilled Fish",
                    "Vegetables"
            );

        } else if ("Muscle Gain".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Chicken Breast",
                    "Eggs",
                    "Brown Rice",
                    "Greek Yogurt"
            );

        } else if ("Maintain Fitness".equalsIgnoreCase(goal)) {

            recommendations = List.of(
                    "Fruits",
                    "Whole Grains",
                    "Lean Protein",
                    "Mixed Vegetables"
            );

        } else {

            recommendations = List.of(
                    "Balanced Diet",
                    "Fresh Fruits",
                    "Vegetables"
            );
        }

        return new DietRecommendationResponse(
                goal,
                recommendations
        );
    }
    public FitnessScoreResponse getFitnessScore(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        int score = 0;

        // Workout Score (40 marks)

        int workoutCount =
                workoutRepository.findByUser(user).size();

        score += Math.min(workoutCount * 4, 40);

        // Diet Score (30 marks)

        int dietCount =
                dietRepository.findByUser(user).size();

        score += Math.min(dietCount * 3, 30);

        // Progress Score (20 marks)

        int progressCount =
                progressRepository
                        .findByUserOrderByProgressDateDesc(user)
                        .size();

        score += Math.min(progressCount * 2, 20);

        // Profile Completion (10 marks)

        if (user.getAge() != null &&
                user.getGender() != null &&
                user.getHeight() != null &&
                user.getWeight() != null &&
                user.getGoal() != null) {

            score += 10;
        }

        String level;

        if (score >= 80) {
            level = "Advanced";
        } else if (score >= 60) {
            level = "Intermediate";
        } else if (score >= 40) {
            level = "Beginner";
        } else {
            level = "Starter";
        }

        return new FitnessScoreResponse(
                score,
                level
        );
    }
    public GoalProgressResponse getGoalProgress(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        /*
         * WORKOUT GOAL
         * Target = 5 workouts per week
         */

        LocalDate weekAgo = LocalDate.now().minusDays(7);

        int workoutCount =
                workoutRepository
                        .findByUserAndWorkoutDateAfter(
                                user,
                                weekAgo
                        )
                        .size();

        double workoutProgress =
                Math.min(
                        (workoutCount / 5.0) * 100,
                        100
                );

        /*
         * CALORIE GOAL
         */

        int goalCalories =
                user.getDailyCalorieGoal() == null
                        ? 0
                        : user.getDailyCalorieGoal();

        int consumedCalories =
                dietRepository
                        .findByUserAndMealDate(
                                user,
                                LocalDate.now()
                        )
                        .stream()
                        .mapToInt(Diet::getCalories)
                        .sum();

        double calorieProgress;

        if (goalCalories == 0) {
            calorieProgress = 0;
        } else {

            calorieProgress =
                    Math.min(
                            ((double) consumedCalories /
                                    goalCalories) * 100,
                            100
                    );
        }

        /*
         * WEIGHT GOAL
         */

        double weightProgress = 0;

        List<Progress> progressList =
                progressRepository
                        .findByUserOrderByProgressDateAsc(user);

        if (!progressList.isEmpty()) {

            double startWeight =
                    progressList.get(0).getWeight();

            double currentWeight =
                    progressList.get(
                            progressList.size() - 1
                    ).getWeight();

            String goal =
                    user.getGoal() == null
                            ? ""
                            : user.getGoal().toLowerCase();

            if (goal.contains("loss")) {

                double targetLoss = 10.0;

                double actualLoss =
                        startWeight - currentWeight;

                weightProgress =
                        Math.min(
                                (actualLoss / targetLoss) * 100,
                                100
                        );
            }

            else if (goal.contains("gain")) {

                double targetGain = 10.0;

                double actualGain =
                        currentWeight - startWeight;

                weightProgress =
                        Math.min(
                                (actualGain / targetGain) * 100,
                                100
                        );
            }
        }

        /*
         * OVERALL PROGRESS
         */

        double overallProgress =
                (
                        workoutProgress +
                                calorieProgress +
                                weightProgress
                ) / 3;

        return new GoalProgressResponse(
                round(workoutProgress),
                round(calorieProgress),
                round(weightProgress),
                round(overallProgress)
        );
    }
    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}