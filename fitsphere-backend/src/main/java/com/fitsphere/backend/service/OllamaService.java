package com.fitsphere.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate =
            new RestTemplate();

    private final ObjectMapper mapper =
            new ObjectMapper();

    public String ask(String userMessage) {

        try {

            String systemPrompt = """
                    You are FitSphere AI Coach.

                    You are an expert fitness trainer.

                    Help users with:
                    - Workout plans
                    - Weight loss
                    - Muscle gain
                    - Nutrition
                    - Healthy habits

                    Keep answers practical and concise.
                    """;

            String prompt =
                    systemPrompt +
                            "\n\nUser Question:\n" +
                            userMessage;

            Map<String, Object> body = Map.of(
                    "model", "llama3",
                    "prompt", prompt,
                    "stream", false
            );

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            String response =
                    restTemplate.postForObject(
                            "http://localhost:11434/api/generate",
                            request,
                            String.class
                    );

            JsonNode json =
                    mapper.readTree(response);

            return json.get("response").asText();

        } catch (Exception e) {
            return "AI Coach is currently unavailable.";
        }
    }
}