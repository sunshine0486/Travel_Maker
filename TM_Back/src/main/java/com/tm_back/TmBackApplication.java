package com.tm_back;

import com.tm_back.constant.Role;
import com.tm_back.entity.Board;
import com.tm_back.entity.Member;
import com.tm_back.entity.repository.BoardRepository;
import com.tm_back.entity.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@RequiredArgsConstructor
@SpringBootApplication
@EnableJpaAuditing
public class TmBackApplication implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;

    public static void main(String[] args) {
        SpringApplication.run(TmBackApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        memberRepository.save(Member.builder()
                        .nickname("핑핑이")
                        .role(Role.USER)
                        .build());
        boardRepository.save(Board.builder()
                        .title("제목이지롱")
                        .build());
    }

}
