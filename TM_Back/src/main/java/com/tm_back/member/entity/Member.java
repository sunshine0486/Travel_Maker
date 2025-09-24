package com.tm_back.member.entity;

import com.tm_back.member.constant.Role;
import com.tm_back.member.dto.MemberDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Builder
@Entity
@Table(name = "member")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(unique = true)
    private String loginId;

    private String password;

    @Column(unique = true)
    private String nickname;

    private String email;

    private String birth;

    private String phoneNumber;

    private String zipcode;

    private String address;

    private String addressDetail;

    @Enumerated(EnumType.STRING)
    private Role role;

    public static Member createMember(MemberDto dto, PasswordEncoder encoder) {
        return Member.builder()
                .loginId(dto.getLoginId())
                .password(encoder.encode(dto.getPassword()))
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .birth(dto.getBirth())
                .phoneNumber(dto.getPhoneNumber())
                .zipcode(dto.getZipcode())
                .address(dto.getAddress())
                .addressDetail(dto.getAddressDetail())
                .role(Role.USER) // 기본 권한 설정
                .build();
    }
}
