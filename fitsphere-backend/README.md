# FitSphere Backend 💪

A comprehensive fitness tracking REST API built with Spring Boot, PostgreSQL, and JWT Authentication.

FitSphere helps users manage workouts, track nutrition, monitor progress, analyze fitness trends, and receive personalized recommendations.

## 🚀 Features

### 🔐 Authentication & Security

* JWT-based authentication
* Secure protected endpoints
* User login and token validation
* Current authenticated user endpoint

### 👤 User Management

* Create user accounts
* Update user profiles
* Calculate BMI
* Set fitness goals
* Configure daily calorie goals

### 🏋️ Workout Management

* Create workouts
* View workout history
* Update workouts
* Delete workouts
* Search workouts
* Track workout duration
* Track calories burned

### 🏃 Exercise Tracking

* Add exercises to workouts
* Update exercise details
* Delete exercises
* View workout exercises

### 🥗 Diet & Nutrition

* Log meals
* Track calories
* Track protein, carbs, and fats
* Daily nutrition summaries
* Calorie goal monitoring
* Diet streak tracking

### 📈 Progress Analytics

* Record weight changes
* Track fitness progress
* Analyze weight trends
* Monitor transformation over time

### 📊 Reports & Dashboard

* Dashboard statistics
* Weekly fitness reports
* Monthly fitness reports
* Workout streak tracking

### 🤖 Recommendations

* Goal-based workout recommendations
* Goal-based diet recommendations

---

## 🛠 Tech Stack

| Technology        | Version |
| ----------------- | ------- |
| Java              | 21      |
| Spring Boot       | 3.5.14  |
| Spring Security   | Latest  |
| Spring Data JPA   | Latest  |
| PostgreSQL        | Latest  |
| JWT (JJWT)        | 0.12.7  |
| Lombok            | Latest  |
| OpenAPI / Swagger | 2.8.13  |
| Maven             | Latest  |

---

## 📂 Project Structure

```text
src/main/java/com/fitsphere/backend
│
├── config
├── controller
├── dto
├── entity
├── repository
├── service
└── BackendApplication.java
```

---

## ⚙️ Database Configuration

Create PostgreSQL database:

```sql
CREATE DATABASE fitnessdb;
```

Configure:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fitnessdb
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## ▶️ Running the Application

Clone the repository:

```bash
git clone https://github.com/yashhpatil03/fitsphere-backend.git
cd fitsphere-backend
```

Build:

```bash
mvn clean install
```

Run:

```bash
mvn spring-boot:run
```

Server:

```text
http://localhost:8080
```

---

## 📖 API Documentation

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI Docs:

```text
http://localhost:8080/v3/api-docs
```

---

## 📌 Main Endpoints

### Authentication

* POST `/auth/login`
* GET `/auth/me`
* GET `/auth/test`

### Users

* POST `/users`
* GET `/users/profile`
* PUT `/users/profile`
* GET `/users/bmi`
* GET `/users/dashboard`
* GET `/users/weekly-report`
* GET `/users/monthly-report`
* GET `/users/streak`
* GET `/users/recommendations/workout`
* GET `/users/recommendations/diet`

### Workouts

* POST `/workouts`
* GET `/workouts`
* PUT `/workouts/{id}`
* DELETE `/workouts/{id}`
* GET `/workouts/search`

### Exercises

* POST `/workouts/{workoutId}/exercises`
* GET `/workouts/{workoutId}/exercises`
* PUT `/workouts/{workoutId}/exercises/{exerciseId}`
* DELETE `/workouts/{workoutId}/exercises/{exerciseId}`

### Diet

* POST `/diets`
* GET `/diets`
* PUT `/diets/{id}`
* DELETE `/diets/{id}`
* GET `/diets/summary/today`
* GET `/diets/calorie-goal`
* GET `/diets/streak`

### Progress

* POST `/progress`
* GET `/progress`
* GET `/progress/analytics`

---

## 🔒 Authentication Example

```http
Authorization: Bearer <jwt-token>
```

---

## 👨‍💻 Author

Yash Patil

GitHub: https://github.com/yashhpatil03
chatGpt-https://chatgpt.com/share/6a1d85e1-6b70-8320-9211-ebb32dc5aa8a

---

## ⭐ Future Improvements

* AI-generated fitness plans
* AI-generated meal plans
* Cloud deployment
* Mobile app integration
* Social fitness challenges
* Push notifications
