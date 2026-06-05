package com.fitsphere.backend.repository;

import com.fitsphere.backend.entity.Exercise;
import com.fitsphere.backend.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByWorkout(Workout workout);
    Optional<Exercise> findByIdAndWorkout(Long id, Workout workout);
    List<Exercise> findByWorkoutIn(List<Workout> workouts);
}