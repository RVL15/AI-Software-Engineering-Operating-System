package com.fordgex.forgemind.repository;

import com.fordgex.forgemind.entity.Role;
import com.fordgex.forgemind.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
