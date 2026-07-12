package com.fordgex.forgemind;

import com.fordgex.forgemind.security.JwtTokenProvider;
import com.fordgex.forgemind.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    public void setUp() {
        tokenProvider = new JwtTokenProvider(
                "9a4f2c8d3b7a1e5f8c6b4d2a1c3e5f7a9f0e2d4c6b8a0e2f4a6c8b0d2e4f6a8b",
                3600000
        );
    }

    @Test
    public void testGenerateAndValidateToken() {
        UserPrincipal principal = new UserPrincipal(
                1L,
                "testuser",
                "test@fordgex.com",
                "pass",
                true,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()
        );

        String token = tokenProvider.generateToken(authentication);
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));

        String username = tokenProvider.getUsernameFromJWT(token);
        assertEquals("testuser", username);
    }

    @Test
    public void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalidTokenString"));
    }
}
