package com.fordgex.forgemind.controller;

import com.fordgex.forgemind.common.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/system")
public class SystemController extends BaseRestController {

    @Value("${info.app.version:1.0.0-SNAPSHOT}")
    private String appVersion;

    private final JdbcTemplate jdbcTemplate;
    private final RedisConnectionFactory redisConnectionFactory;

    public SystemController(JdbcTemplate jdbcTemplate, RedisConnectionFactory redisConnectionFactory) {
        this.jdbcTemplate = jdbcTemplate;
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> getHealth() {
        Map<String, String> status = new HashMap<>();
        
        boolean dbHealthy = false;
        try {
            jdbcTemplate.execute("SELECT 1");
            dbHealthy = true;
        } catch (Exception e) {
            status.put("database_error", e.getMessage());
        }

        boolean redisHealthy = false;
        try {
            String pingResult = redisConnectionFactory.getConnection().ping();
            if ("PONG".equalsIgnoreCase(pingResult)) {
                redisHealthy = true;
            }
        } catch (Exception e) {
            status.put("redis_error", e.getMessage());
        }

        status.put("database", dbHealthy ? "CONNECTED" : "DISCONNECTED");
        status.put("redis", redisHealthy ? "CONNECTED" : "DISCONNECTED");
        status.put("status", (dbHealthy && redisHealthy) ? "UP" : "DOWN");

        return success("System health check completed", status);
    }

    @GetMapping("/version")
    public ResponseEntity<ApiResponse<Map<String, String>>> getVersion() {
        Map<String, String> info = new HashMap<>();
        info.put("version", appVersion);
        info.put("name", "ForgeMind X Backend");
        return success("Version retrieved successfully", info);
    }
}
