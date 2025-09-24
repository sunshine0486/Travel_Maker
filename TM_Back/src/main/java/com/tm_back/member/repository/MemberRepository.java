package com.tm_back.member.repository;

import com.tm_back.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String>
{
    boolean existsByLoginId(String loginId);
    boolean existsByNickname(String nickname);
}
