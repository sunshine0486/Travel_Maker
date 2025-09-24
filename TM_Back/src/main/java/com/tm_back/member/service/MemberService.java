package com.tm_back.member.service;

import com.tm_back.member.entity.Member;
import com.tm_back.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService
{
    private final MemberRepository memberRepository;

    public void saveMember(Member member)
    {
        validateDuplicateMember(member);
        memberRepository.save(member);
    }

    public void validateDuplicateMember(Member member)
    {
        boolean loginIdExists = memberRepository.existsByLoginId(member.getLoginId());
        if (loginIdExists)
        {
            throw new IllegalStateException ("이미 사용 중인 아이디입니다.");
        }

        boolean nicknameExists = memberRepository.existsByNickname(member.getNickname());
        if (nicknameExists)
        {
            throw new IllegalStateException("이미 사용중인 닉네임입니다.");
        }
    }
}
