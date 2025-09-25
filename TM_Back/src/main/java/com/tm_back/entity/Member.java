package com.tm_back.entity;

import com.tm_back.constant.Role;
import com.tm_back.dto.MemberDto;
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

    @Column(unique = true, nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String birth;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String zipcode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
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
