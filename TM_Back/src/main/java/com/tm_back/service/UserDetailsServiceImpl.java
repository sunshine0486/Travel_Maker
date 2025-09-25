package com.tm_back.service;

import com.tm_back.entity.Member;
import com.tm_back.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService
{
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        // 실제 해당 username(ID)을 가지는 유저가 DB에 존재하는지 확인
        // + 해당 유저정보를 UserDetails 타입으로 반환하는 메서드

        Optional<Member> user = memberRepository.findByLoginId(loginId);

        UserDetails userDetails = null;
        if (user.isPresent())
        {
            Member member = user.get();
            userDetails = User.withUsername(loginId)
                    .password(member.getPassword())
                    .roles(member.getRole().name())
                    .build();
        }
        else
        {
            throw new UsernameNotFoundException("User not found.");
        }
        return userDetails;
    }
}
