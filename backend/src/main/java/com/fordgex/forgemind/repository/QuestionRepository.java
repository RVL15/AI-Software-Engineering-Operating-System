package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByProjectIdOrderByOrderIndexAsc(Long projectId);
    List<Question> findByProjectIdAndAnsweredOrderByOrderIndexAsc(Long projectId, boolean answered);
}
