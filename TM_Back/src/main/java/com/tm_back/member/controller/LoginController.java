package com.tm_back.member.controller;

import com.tm_back.member.dto.LoginDto;
import com.tm_back.member.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class LoginController
{
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto)
    {
//        try {
//            // 1. 유저의 ID, PW 정보를 기반으로 Authentication 객체 생성
//            UsernamePasswordAuthenticationToken token =
//                    new UsernamePasswordAuthenticationToken(loginDto.getLoginId(), loginDto.getPassword());
//
//            // 2. authenticationManager 에게 전달하여 인증 처리
//            Authentication authentication = authenticationManager.authenticate(token);
//
//            // 3. 인증 성공 시 JWT 토큰 발급
//            String jwtToken = jwtService.generateToken(authentication.getName());
//
//            // 4. 응답 헤더에 토큰 담아 반환
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
//                    .build();
//
//        } catch (AuthenticationException e) {
//            // 인증 실패 시 예외를 잡아서 처리
//
//            // "아이디가 존재하지 않는 경우"
//            if (e instanceof UsernameNotFoundException) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 아이디입니다.");
//            }
//            // "비밀번호가 틀린 경우"
//            else if (e instanceof BadCredentialsException) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 틀렸습니다.");
//            }
//            // 그 외 다른 인증 실패
//            else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인에 실패하였습니다.");
//            }
//        }

        // 1. 유저의 ID, PW 정보를 기반으로 UsernamePasswordAuthenticationToken 생성
        // 2. 생성된 UsernamePasswordAuthenticationToken 을 authenticationManager 에게 전달
        // 3. authenticationManager 는 궁극적으로 UserDetailsService 의 loadUserByUsername 을 호출
        // 4. 조회된 유저 정보(UserDetail)와 UsernamePasswordAuthenticationToken 을 비교해 인증 처리
        // 5. 최종 반환된 Authentication(인증된 유저 정보) 를 기반으로 JWT TOKEN 발급
        // 6. 컨트롤러는 응답 헤더(Authorization) 에 Bearer <JWT TOKEN VALUE> 형태로 응답

        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginDto.getLoginId(), loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(token);

        String jwtToken = jwtService.generateToken(authentication.getName());

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwtToken)
                .build();
    }
}
