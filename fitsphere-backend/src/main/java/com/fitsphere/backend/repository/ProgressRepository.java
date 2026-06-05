package com.fitsphere.backend.repository;

import com.fitsphere.backend.entity.Progress;
import com.fitsphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {

    List<Progress> findByUserOrderByProgressDateDesc(User user);
    List<Progress> findByUserOrderByProgressDateAsc(User user);
}