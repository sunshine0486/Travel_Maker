package com.tm_back.service;

import com.tm_back.dto.MyPageDto;
import com.tm_back.entity.Member;
import com.tm_back.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MyPageService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 비밀번호 확인
    public boolean checkPassword(String loginId, String rawPassword) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
        return passwordEncoder.matches(rawPassword, member.getPassword());
    }

    // 회원 정보 조회
    public Member getMemberByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));
    }

    // 회원 정보 수정
    @Transactional
    public void updateMember(String loginId, MyPageDto myPageDto) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));

        // 비밀번호는 반드시 암호화
        if (myPageDto.getPassword() != null && !myPageDto.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(myPageDto.getPassword()));
        }
        member.setNickname(myPageDto.getNickname());
        member.setEmail(myPageDto.getEmail());
        member.setBirth(myPageDto.getBirth());
        member.setPhoneNumber(myPageDto.getPhoneNumber());
        member.setZipcode(myPageDto.getZipcode());
        member.setAddress(myPageDto.getAddress());
        member.setAddressDetail(myPageDto.getAddressDetail());

        memberRepository.save(member);
    }
}
