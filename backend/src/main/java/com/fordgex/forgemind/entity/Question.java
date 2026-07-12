package com.fordgex.forgemind.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private RequirementCategory category;

    @Column(nullable = false, length = 555)
    private String text;

    @Column(nullable = false, length = 1000)
    private String options; // comma-separated options

    @Column(nullable = false)
    private boolean answered = false;

    @Column(name = "dependency_question_id")
    private Long dependencyQuestionId;

    @Column(name = "dependency_answer")
    private String dependencyAnswer;

    @Column(name = "order_index", nullable = false)
    private int orderIndex = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Question() {
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public RequirementCategory getCategory() {
        return category;
    }

    public void setCategory(RequirementCategory category) {
        this.category = category;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public boolean isAnswered() {
        return answered;
    }

    public void setAnswered(boolean answered) {
        this.answered = answered;
    }

    public Long getDependencyQuestionId() {
        return dependencyQuestionId;
    }

    public void setDependencyQuestionId(Long dependencyQuestionId) {
        this.dependencyQuestionId = dependencyQuestionId;
    }

    public String getDependencyAnswer() {
        return dependencyAnswer;
    }

    public void setDependencyAnswer(String dependencyAnswer) {
        this.dependencyAnswer = dependencyAnswer;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
