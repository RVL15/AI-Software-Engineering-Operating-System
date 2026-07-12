package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.RequirementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RequirementCategoryRepository extends JpaRepository<RequirementCategory, Long> {
    Optional<RequirementCategory> findByName(String name);
}
