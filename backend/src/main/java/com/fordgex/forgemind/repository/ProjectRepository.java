package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreatedByIdOrderByUpdatedAtDesc(Long userId);
    Optional<Project> findByIdAndCreatedById(Long id, Long userId);
}
