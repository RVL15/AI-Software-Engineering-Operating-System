package com.fordgex.forgemind.service;

import com.fordgex.forgemind.dto.*;
import com.fordgex.forgemind.entity.*;
import com.fordgex.forgemind.exception.BusinessException;
import com.fordgex.forgemind.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final RequirementRepository requirementRepository;
    private final RequirementSessionRepository sessionRepository;
    private final AuditLogRepository auditLogRepository;
    private final QuestionEngineService questionEngineService;

    public ProjectService(
            ProjectRepository projectRepository,
            QuestionRepository questionRepository,
            AnswerRepository answerRepository,
            RequirementRepository requirementRepository,
            RequirementSessionRepository sessionRepository,
            AuditLogRepository auditLogRepository,
            QuestionEngineService questionEngineService) {
        this.projectRepository = projectRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.requirementRepository = requirementRepository;
        this.sessionRepository = sessionRepository;
        this.auditLogRepository = auditLogRepository;
        this.questionEngineService = questionEngineService;
    }

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request, User user) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreatedBy(user);
        project.setStatus("IN_PROGRESS");
        project.setProgress(0);

        Project savedProject = projectRepository.save(project);

        // Generate custom questions
        questionEngineService.initializeProjectQuestions(savedProject);

        // Start active session
        RequirementSession session = new RequirementSession();
        session.setProject(savedProject);
        session.setStatus("ACTIVE");
        sessionRepository.save(session);

        // Log audit
        auditLogRepository.save(new AuditLog(savedProject, user, "CREATE_PROJECT", "Created project: " + savedProject.getName()));

        return new ProjectResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listProjects(Long userId) {
        return projectRepository.findByCreatedByIdOrderByUpdatedAtDesc(userId).stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id, Long userId) {
        Project project = projectRepository.findByIdAndCreatedById(id, userId)
                .orElseThrow(() -> new BusinessException("Project not found", HttpStatus.NOT_FOUND));
        return new ProjectResponse(project);
    }

    @Transactional
    public void saveAnswer(Long projectId, Long questionId, AnswerRequest request, User user) {
        Project project = projectRepository.findByIdAndCreatedById(projectId, user.getId())
                .orElseThrow(() -> new BusinessException("Project not found", HttpStatus.NOT_FOUND));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new BusinessException("Question not found", HttpStatus.NOT_FOUND));

        if (!question.getProject().getId().equals(projectId)) {
            throw new BusinessException("Question does not belong to this project", HttpStatus.BAD_REQUEST);
        }

        // Save or update answer
        Optional<Answer> existing = answerRepository.findByProjectIdAndQuestionId(projectId, questionId);
        Answer answer;
        if (existing.isPresent()) {
            answer = existing.get();
            answer.setSelectedOption(request.getSelectedOption());
            answer.setText(request.getText());
        } else {
            answer = new Answer();
            answer.setProject(project);
            answer.setQuestion(question);
            answer.setSelectedOption(request.getSelectedOption());
            answer.setText(request.getText());
        }
        answerRepository.save(answer);

        question.setAnswered(true);
        questionRepository.save(question);

        // Calculate progress
        int progress = questionEngineService.calculateProgress(projectId);
        project.setProgress(progress);
        projectRepository.save(project);

        auditLogRepository.save(new AuditLog(project, user, "SAVE_ANSWER", "Answered question: " + question.getText() + " -> " + request.getSelectedOption()));
    }

    @Transactional
    public void completeSession(Long projectId, User user) {
        Project project = projectRepository.findByIdAndCreatedById(projectId, user.getId())
                .orElseThrow(() -> new BusinessException("Project not found", HttpStatus.NOT_FOUND));

        RequirementSession session = sessionRepository.findByProjectId(projectId)
                .orElseThrow(() -> new BusinessException("Requirement wizard session not active", HttpStatus.BAD_REQUEST));

        if ("COMPLETED".equals(session.getStatus())) {
            throw new BusinessException("Session is already completed", HttpStatus.BAD_REQUEST);
        }

        int progress = questionEngineService.calculateProgress(projectId);
        if (progress < 100) {
            throw new BusinessException("Please answer all active questions before completing the session", HttpStatus.BAD_REQUEST);
        }

        // Compile requirements from choices
        questionEngineService.compileRequirements(project, user);

        // Finalize session
        session.setStatus("COMPLETED");
        session.setCompletedAt(Instant.now());
        sessionRepository.save(session);

        auditLogRepository.save(new AuditLog(project, user, "COMPLETE_SESSION", "Completed session questionnaire."));
    }

    @Transactional(readOnly = true)
    public ProjectSummaryResponse getProjectSummary(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndCreatedById(projectId, userId)
                .orElseThrow(() -> new BusinessException("Project not found", HttpStatus.NOT_FOUND));

        List<RequirementResponse> requirements = requirementRepository.findByProjectIdOrderByCategoryNameAsc(projectId)
                .stream()
                .map(RequirementResponse::new)
                .collect(Collectors.toList());

        return new ProjectSummaryResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getProgress(),
                project.getStatus(),
                requirements
        );
    }

    @Transactional(readOnly = true)
    public String exportProjectSummary(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndCreatedById(projectId, userId)
                .orElseThrow(() -> new BusinessException("Project not found", HttpStatus.NOT_FOUND));

        List<Requirement> requirements = requirementRepository.findByProjectIdOrderByCategoryNameAsc(projectId);

        StringBuilder sb = new StringBuilder();
        sb.append("# Software Requirements Specification (SRS)\n\n");
        sb.append("## Project: ").append(project.getName()).append("\n");
        if (project.getDescription() != null && !project.getDescription().isBlank()) {
            sb.append("Description: ").append(project.getDescription()).append("\n");
        }
        sb.append("Status: ").append(project.getStatus()).append("\n");
        sb.append("Compiled At: ").append(Instant.now()).append("\n\n");
        sb.append("---\n\n");

        if (requirements.isEmpty()) {
            sb.append("No requirements compiled for this project yet. Please complete the interactive questioning session first.\n");
        } else {
            String currentCategory = "";
            for (Requirement r : requirements) {
                String catName = r.getCategory().getName();
                if (!catName.equals(currentCategory)) {
                    currentCategory = catName;
                    sb.append("### Category: ").append(currentCategory).append("\n\n");
                }
                sb.append("#### [").append(r.getStatus()).append("] ").append(r.getTitle()).append("\n");
                sb.append(r.getDescription()).append("\n\n");
            }
        }

        return sb.toString();
    }
}
