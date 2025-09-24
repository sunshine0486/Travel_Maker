package com.tm_back.entity;

import com.tm_back.constant.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id")
    private String loginId;
    private String password;

    private String nickname;
    private String email;
    private String birth;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "zip_code")
    private Integer zipcode;
    private String address;
    @Column(name = "address_detail")
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    private Role role;  // ✅ USER, ADMIN

}
