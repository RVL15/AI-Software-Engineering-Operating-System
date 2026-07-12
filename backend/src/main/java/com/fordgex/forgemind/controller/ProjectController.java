package com.fordgex.forgemind.controller;

import com.fordgex.forgemind.common.ApiResponse;
import com.fordgex.forgemind.dto.*;
import com.fordgex.forgemind.entity.Answer;
import com.fordgex.forgemind.entity.Question;
import com.fordgex.forgemind.entity.User;
import com.fordgex.forgemind.exception.BusinessException;
import com.fordgex.forgemind.repository.AnswerRepository;
import com.fordgex.forgemind.repository.UserRepository;
import com.fordgex.forgemind.service.ProjectService;
import com.fordgex.forgemind.service.QuestionEngineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController extends BaseRestController {

    private final ProjectService projectService;
    private final QuestionEngineService questionEngineService;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;

    public ProjectController(
            ProjectService projectService,
            QuestionEngineService questionEngineService,
            UserRepository userRepository,
            AnswerRepository answerRepository) {
        this.projectService = projectService;
        this.questionEngineService = questionEngineService;
        this.userRepository = userRepository;
        this.answerRepository = answerRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectCreateRequest request, Principal principal) {
        User user = getCurrentUser(principal);
        ProjectResponse response = projectService.createProject(request, user);
        return created("Project created successfully", response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> listProjects(Principal principal) {
        User user = getCurrentUser(principal);
        List<ProjectResponse> response = projectService.listProjects(user.getId());
        return success("Projects retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(
            @PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        ProjectResponse response = projectService.getProject(id, user.getId());
        return success("Project retrieved successfully", response);
    }

    @GetMapping("/{id}/next-question")
    public ResponseEntity<ApiResponse<QuestionResponse>> getNextQuestion(
            @PathVariable Long id, Principal principal) {
        // Enforce project security
        User user = getCurrentUser(principal);
        projectService.getProject(id, user.getId());

        Optional<Question> nextQuestionOpt = questionEngineService.getNextQuestion(id);
        if (nextQuestionOpt.isEmpty()) {
            return success("All active questions answered", null);
        }

        Question nextQuestion = nextQuestionOpt.get();
        Optional<Answer> answer = answerRepository.findByProjectIdAndQuestionId(id, nextQuestion.getId());
        String selected = answer.isPresent() ? answer.get().getSelectedOption() : null;

        QuestionResponse response = new QuestionResponse(nextQuestion, selected);
        return success("Next question retrieved successfully", response);
    }

    @PostMapping("/{id}/questions/{questionId}/answer")
    public ResponseEntity<ApiResponse<Void>> saveAnswer(
            @PathVariable Long id,
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerRequest request,
            Principal principal) {
        User user = getCurrentUser(principal);
        projectService.saveAnswer(id, questionId, request, user);
        return success("Answer saved successfully");
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<Integer>> getProgress(
            @PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        projectService.getProject(id, user.getId());
        int progress = questionEngineService.calculateProgress(id);
        return success("Progress retrieved successfully", progress);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Void>> completeSession(
            @PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        projectService.completeSession(id, user);
        return success("Requirements session completed and specifications compiled successfully");
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ApiResponse<ProjectSummaryResponse>> getSummary(
            @PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        ProjectSummaryResponse response = projectService.getProjectSummary(id, user.getId());
        return success("Project summary retrieved successfully", response);
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<String> exportSummary(
            @PathVariable Long id, Principal principal) {
        User user = getCurrentUser(principal);
        String srsMarkdown = projectService.exportProjectSummary(id, user.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"requirements_spec_" + id + ".md\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(srsMarkdown);
    }

    private User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new BusinessException("User is not authenticated", HttpStatus.UNAUTHORIZED);
        }
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new BusinessException("Authenticated user details not found", HttpStatus.UNAUTHORIZED));
    }
}
