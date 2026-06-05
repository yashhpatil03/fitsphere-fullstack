package com.fitsphere.backend.controller;

import com.fitsphere.backend.dto.ChatRequest;
import com.fitsphere.backend.dto.ChatResponse;
import com.fitsphere.backend.service.OllamaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiCoachController {

    private final OllamaService ollamaService;

    public AiCoachController(
            OllamaService ollamaService
    ) {
        this.ollamaService = ollamaService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestBody ChatRequest request
    ) {

        String reply =
                ollamaService.ask(
                        request.getMessage()
                );

        return new ChatResponse(reply);
    }
}