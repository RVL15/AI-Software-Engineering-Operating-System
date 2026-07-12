package com.fordgex.forgemind.controller;

import com.fordgex.forgemind.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/protected")
public class ProtectedExampleController extends BaseRestController {

    @GetMapping("/example")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProtectedData(Principal principal) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Access granted! This is a secure resource.");
        data.put("username", principal != null ? principal.getName() : "anonymous");
        data.put("timestamp", System.currentTimeMillis());
        return success("Secured data retrieved successfully", data);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminData(Principal principal) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Access granted to admin-only area!");
        data.put("username", principal != null ? principal.getName() : "anonymous");
        return success("Admin secured data retrieved successfully", data);
    }
}
