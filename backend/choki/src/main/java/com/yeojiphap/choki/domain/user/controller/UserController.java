package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.TokenResponse;
import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import com.yeojiphap.choki.global.auth.service.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.user.message.UserSuccessMessage.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements SpringDocUserController {
    private final UserService userService;
    private final CookieService cookieService;

    @PostMapping("/signup")
    public ApiResponse signup(@RequestBody signUpRequest signUpRequest,  HttpServletResponse response) {
        TokenResponse tokenResponse = userService.signUp(signUpRequest);
        response.setHeader("access", tokenResponse.accessToken());
        response.addCookie(cookieService.createCookie("refresh", tokenResponse.refreshToken()));
        return ApiResponse.success(HttpStatus.CREATED, SIGN_UP_SUCCESS.getMessage());
    }
}