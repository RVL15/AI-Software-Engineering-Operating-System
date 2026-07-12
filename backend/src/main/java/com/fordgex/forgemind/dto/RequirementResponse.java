package com.fordgex.forgemind.dto;

import com.fordgex.forgemind.entity.Requirement;

public class RequirementResponse {
    private Long id;
    private String category;
    private String title;
    private String description;
    private String status;

    public RequirementResponse() {}

    public RequirementResponse(Requirement requirement) {
        this.id = requirement.getId();
        this.category = requirement.getCategory().getName();
        this.title = requirement.getTitle();
        this.description = requirement.getDescription();
        this.status = requirement.getStatus();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
