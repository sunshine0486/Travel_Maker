package com.tm_back.controller;

import com.tm_back.dto.MemberDto;
import com.tm_back.entity.Member;
import com.tm_back.repository.MemberRepository;
import com.tm_back.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(("/signup"))
@RequiredArgsConstructor
public class SignUpController {
    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    @PostMapping
    public ResponseEntity<?> signup(@RequestBody @Valid MemberDto memberDto) {
        try {
            Member member = Member.createMember(memberDto, passwordEncoder);
            memberService.saveMember(member);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // 중복확인 눌렀을때
    @GetMapping("/check_loginid")
    public ResponseEntity<?> checkLoginId(@RequestParam String loginId) {
        boolean exists = memberRepository.existsByLoginId(loginId);
        return ResponseEntity.ok().body(Map.of("exists", exists));
    }

    @GetMapping("/check_nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return ResponseEntity.ok().body(Map.of("exists", exists));
    }


}
