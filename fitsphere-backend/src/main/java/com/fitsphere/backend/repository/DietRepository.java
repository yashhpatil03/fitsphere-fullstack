package com.fitsphere.backend.repository;

import com.fitsphere.backend.entity.Diet;
import com.fitsphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DietRepository
        extends JpaRepository<Diet, Long> {

    List<Diet> findByUser(User user);
    Optional<Diet> findByIdAndUser(
            Long id,
            User user
    );

    List<Diet> findByUserAndMealDate(
            User user,
            LocalDate mealDate
    );
    List<Diet> findByUserOrderByMealDateDesc(User user);
}