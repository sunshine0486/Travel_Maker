package com.tm_back.dto;

import com.tm_back.entity.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberResponseDto {
    private Long id;
    private String loginId;
    private String nickname;
    private String email;
    private String birth;
    private String phoneNumber;
    private Integer zipcode;
    private String address;
    private String addressDetail;
    private String role;  // ENUM → String

    public static MemberResponseDto from(Member member) {
        MemberResponseDto dto = new MemberResponseDto();
        dto.setId(member.getId());
        dto.setLoginId(member.getLoginId());
        dto.setNickname(member.getNickname());
        dto.setEmail(member.getEmail());
        dto.setBirth(member.getBirth());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setZipcode(member.getZipcode());
        dto.setAddress(member.getAddress());
        dto.setAddressDetail(member.getAddressDetail());
        dto.setRole(member.getRole().name()); // ENUM → String
        return dto;
    }

}
