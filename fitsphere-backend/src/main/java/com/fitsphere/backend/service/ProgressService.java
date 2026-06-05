package com.fitsphere.backend.service;

import com.fitsphere.backend.dto.ProgressAnalyticsResponse;
import com.fitsphere.backend.dto.ProgressRequest;
import com.fitsphere.backend.dto.ProgressResponse;
import com.fitsphere.backend.entity.Progress;
import com.fitsphere.backend.entity.User;
import com.fitsphere.backend.exception.UserNotFoundException;
import com.fitsphere.backend.repository.ProgressRepository;
import com.fitsphere.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public ProgressService(ProgressRepository progressRepository,
                           UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    public void addProgress(ProgressRequest request,
                            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Progress progress = Progress.builder()
                .weight(request.getWeight())
                .progressDate(request.getProgressDate())
                .user(user)
                .build();

        progressRepository.save(progress);
    }

    public List<ProgressResponse> getProgress(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return progressRepository.findByUserOrderByProgressDateDesc(user)
                .stream()
                .map(p -> new ProgressResponse(
                        p.getId(),
                        p.getWeight(),
                        p.getProgressDate()
                ))
                .toList();
    }
    public ProgressAnalyticsResponse getAnalytics(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Progress> list =
                progressRepository.findByUserOrderByProgressDateAsc(user);

        if (list.isEmpty()) {
            return new ProgressAnalyticsResponse(0.0, 0.0, 0.0, "NO_DATA");
        }

        Double start = list.get(0).getWeight();
        Double current = list.get(list.size() - 1).getWeight();

        Double change = current - start;

        String trend;
        if (change < 0) trend = "IMPROVING";
        else if (change > 0) trend = "DECLINING";
        else trend = "STABLE";

        return new ProgressAnalyticsResponse(
                start,
                current,
                change,
                trend
        );
    }

}