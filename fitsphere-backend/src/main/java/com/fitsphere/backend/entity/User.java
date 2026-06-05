package com.fitsphere.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private Integer age;

    private String gender;

    private Double height;

    private Double weight;

    private String goal;

    private Integer dailyCalorieGoal;

    private String role = "USER";

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Workout> workouts;

    @OneToMany(mappedBy = "user")
    private List<Diet> diets;
}