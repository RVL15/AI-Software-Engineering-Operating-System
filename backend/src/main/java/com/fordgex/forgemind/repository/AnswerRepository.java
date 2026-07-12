package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByProjectId(Long projectId);
    Optional<Answer> findByQuestionId(Long questionId);
    Optional<Answer> findByProjectIdAndQuestionId(Long projectId, Long questionId);
}
