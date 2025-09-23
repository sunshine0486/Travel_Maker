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

    private String nickname;

    @Enumerated(EnumType.STRING)
    private Role role;  // ✅ USER, ADMIN

}
