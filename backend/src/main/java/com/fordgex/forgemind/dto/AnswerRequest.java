package com.fordgex.forgemind.dto;

import jakarta.validation.constraints.NotBlank;

public class AnswerRequest {

    @NotBlank(message = "Selected option is required")
    private String selectedOption;

    private String text;

    public AnswerRequest() {}

    public AnswerRequest(String selectedOption, String text) {
        this.selectedOption = selectedOption;
        this.text = text;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
