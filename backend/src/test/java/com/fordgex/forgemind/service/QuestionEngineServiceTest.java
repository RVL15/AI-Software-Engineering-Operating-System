package com.fordgex.forgemind.service;

import com.fordgex.forgemind.entity.Project;
import com.fordgex.forgemind.entity.Question;
import com.fordgex.forgemind.entity.RequirementCategory;
import com.fordgex.forgemind.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class QuestionEngineServiceTest {

    private QuestionEngineService questionEngineService;

    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private AnswerRepository answerRepository;
    @Mock
    private RequirementRepository requirementRepository;
    @Mock
    private RequirementCategoryRepository categoryRepository;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private ProjectRepository projectRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        questionEngineService = new QuestionEngineService(
                questionRepository,
                answerRepository,
                requirementRepository,
                categoryRepository,
                auditLogRepository,
                projectRepository
        );
    }

    @Test
    public void testInitializeProjectQuestionsForHospitalSystem() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Hospital Management System");
        project.setDescription("Intake workflow for hospital beds.");

        RequirementCategory cat = new RequirementCategory("CORE_FUNCTIONALITY", "Core");
        when(categoryRepository.findAll()).thenReturn(List.of(cat));
        when(questionRepository.save(any(Question.class))).thenAnswer(invocation -> invocation.getArgument(0));

        questionEngineService.initializeProjectQuestions(project);

        // Verify save was called for the questions template
        verify(questionRepository, atLeastOnce()).save(any(Question.class));
    }

    @Test
    public void testCalculateProgressEmpty() {
        when(questionRepository.findByProjectIdOrderByOrderIndexAsc(1L)).thenReturn(new ArrayList<>());
        when(answerRepository.findByProjectId(1L)).thenReturn(new ArrayList<>());

        int progress = questionEngineService.calculateProgress(1L);
        assertEquals(100, progress);
    }
}
