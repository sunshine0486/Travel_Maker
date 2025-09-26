package com.tm_back.controller;

import com.tm_back.dto.LoginDto;
import com.tm_back.dto.MyPageDto;
import com.tm_back.entity.Member;
import com.tm_back.service.MemberService;
import com.tm_back.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

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
    public ResponseEntity<MyPageDto> getMemberInfo(Authentication authentication) {
        Member member = myPageService.getMemberByLoginId(authentication.getName());

        // ✅ Base64 복호화
        String decodedBirth = new String(Base64.getDecoder().decode(member.getBirth()));
        String decodedPhone = new String(Base64.getDecoder().decode(member.getPhoneNumber()));
        String decodedZipcode = new String(Base64.getDecoder().decode(member.getZipcode()));
        String decodedAddress = new String(Base64.getDecoder().decode(member.getAddress()));
        String decodedDetail = new String(Base64.getDecoder().decode(member.getAddressDetail()));

        // ✅ DTO로 변환
        MyPageDto myPageDto = new MyPageDto();
        myPageDto.setNickname(member.getNickname());
        myPageDto.setEmail(member.getEmail());
        myPageDto.setBirth(decodedBirth);
        myPageDto.setPhoneNumber(decodedPhone);
        myPageDto.setZipcode(decodedZipcode);
        myPageDto.setAddress(decodedAddress);
        myPageDto.setAddressDetail(decodedDetail);
        System.out.println(myPageDto);

        return ResponseEntity.ok(myPageDto);
    }

    // 3. 회원 정보 수정
    @PutMapping("/{loginId}")
    public ResponseEntity<?> updateMember(@PathVariable String loginId, @RequestBody MyPageDto myPageDto) {
        myPageService.updateMember(loginId, myPageDto);
        return ResponseEntity.ok("회원 정보가 업데이트 되었습니다.");
    }
}

