package com.fitsphere.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mealName;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private LocalDate mealDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}