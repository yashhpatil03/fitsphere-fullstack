package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.ProgressAnalyticsResponse;
import com.fitsphere.backend.dto.ProgressRequest;
import com.fitsphere.backend.dto.ProgressResponse;
import com.fitsphere.backend.service.ProgressService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    public void addProgress(@RequestBody ProgressRequest request,
                            Authentication authentication) {
        progressService.addProgress(request, authentication);
    }

    @GetMapping
    public List<ProgressResponse> getProgress(Authentication authentication) {
        return progressService.getProgress(authentication);
    }
    @GetMapping("/analytics")
    public ProgressAnalyticsResponse getAnalytics(Authentication authentication) {
        return progressService.getAnalytics(authentication);
    }
}