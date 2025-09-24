package com.tm_back;

import com.tm_back.constant.Category;
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
//        Member member1 = memberRepository.save(Member.builder()
//                        .loginId("asdf")
//                        .nickname("핑핑이")
//                        .password("123456")
//                        .phoneNumber("010-1234-5678")
//                        .birth("20150215")
//                        .email("asdf@as")
//                        .zipcode(12345)
//                        .address("지구")
//                        .addressDetail("창원")
//                        .role(Role.USER)
//                        .build());
//
//        boardRepository.save(Board.builder()
//                        .title("제목이지롱")
//                        .category(Category.QNA)
//                        .content("본문임본문본문본문")
//                        .views(20L)
//                        .member(member1)
//                        .build());


    }

}
