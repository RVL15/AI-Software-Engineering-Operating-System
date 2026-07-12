package com.fordgex.forgemind.dto;

import com.fordgex.forgemind.entity.Question;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionResponse {
    private Long id;
    private String text;
    private List<String> options;
    private String category;
    private boolean answered;
    private String selectedOption;

    public QuestionResponse() {}

    public QuestionResponse(Question question, String selectedOption) {
        this.id = question.getId();
        this.text = question.getText();
        this.options = Arrays.stream(question.getOptions().split(","))
                .map(String::trim)
                .collect(Collectors.toList());
        this.category = question.getCategory().getName();
        this.answered = question.isAnswered();
        this.selectedOption = selectedOption;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isAnswered() {
        return answered;
    }

    public void setAnswered(boolean answered) {
        this.answered = answered;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
