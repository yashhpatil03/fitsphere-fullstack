package com.fitsphere.backend.repository;

import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUser(User user);
    Optional<Workout> findByIdAndUser(Long id, User user);
    Page<Workout> findByUser(User user, Pageable pageable);
    List<Workout> findByUserAndTitleContainingIgnoreCase(
            User user,
            String title
    );
    List<Workout> findByUserAndWorkoutDateAfter(
            User user,
            LocalDate date
    );
    List<Workout> findByUserOrderByWorkoutDateDesc(
            User user
    );
}
