package com.fordgex.forgemind;

import com.fordgex.forgemind.controller.SystemController;
import com.fordgex.forgemind.security.CustomUserDetailsService;
import com.fordgex.forgemind.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = SystemController.class,
        excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                UserDetailsServiceAutoConfiguration.class
        }
)
public class SystemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @MockBean
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @MockBean
    private org.springframework.data.redis.connection.RedisConnectionFactory redisConnectionFactory;

    @org.junit.jupiter.api.BeforeEach
    public void setUp() {
        org.springframework.data.redis.connection.RedisConnection mockConnection = 
                org.mockito.Mockito.mock(org.springframework.data.redis.connection.RedisConnection.class);
        org.mockito.Mockito.when(redisConnectionFactory.getConnection()).thenReturn(mockConnection);
        org.mockito.Mockito.when(mockConnection.ping()).thenReturn("PONG");
    }

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/system/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    public void testVersionEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/system/version")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.version").exists());
    }
}
