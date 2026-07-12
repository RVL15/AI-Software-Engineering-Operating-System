package com.fordgex.forgemind.dto;

import java.util.List;

public class ProjectSummaryResponse {
    private Long projectId;
    private String projectName;
    private String description;
    private int progress;
    private String status;
    private List<RequirementResponse> requirements;

    public ProjectSummaryResponse() {}

    public ProjectSummaryResponse(Long projectId, String projectName, String description, int progress, String status, List<RequirementResponse> requirements) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.description = description;
        this.progress = progress;
        this.status = status;
        this.requirements = requirements;
    }

    // Getters and Setters
    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<RequirementResponse> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<RequirementResponse> requirements) {
        this.requirements = requirements;
    }
}
