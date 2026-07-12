package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.RequirementSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RequirementSessionRepository extends JpaRepository<RequirementSession, Long> {
    Optional<RequirementSession> findByProjectId(Long projectId);
}
