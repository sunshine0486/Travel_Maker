package com.tm_back.member.controller;

import com.tm_back.member.dto.LoginDto;
import com.tm_back.member.dto.MyPageDto;
import com.tm_back.member.entity.Member;
import com.tm_back.member.service.MemberService;
import com.tm_back.member.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;
    private final MyPageService myPageService;

    // 1. 비밀번호 확인
    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody LoginDto loginDto) {
        String loginId = loginDto.getLoginId();
        String password = loginDto.getPassword();
        boolean matches = myPageService.checkPassword(loginId, password);
        if (matches) return ResponseEntity.ok("비밀번호 일치");
        else return ResponseEntity.status(401).body("비밀번호가 틀렸습니다.");
    }

    // 2. 회원 정보 조회
    @GetMapping
    public ResponseEntity<Member> getMemberInfo(Authentication authentication) {
        Member member = myPageService.getMemberByLoginId(authentication.getName());
        return ResponseEntity.ok(member);
    }

    // 3. 회원 정보 수정
    @PutMapping("/{loginId}")
    public ResponseEntity<?> updateMember(@PathVariable String loginId, @RequestBody MyPageDto myPageDto) {
        myPageService.updateMember(loginId, myPageDto);
        return ResponseEntity.ok("회원 정보가 업데이트 되었습니다.");
    }
}

