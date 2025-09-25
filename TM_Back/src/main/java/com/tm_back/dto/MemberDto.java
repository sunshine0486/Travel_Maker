package com.tm_back.dto;

import com.tm_back.constant.Role;
import com.tm_back.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class MemberDto
{
    private Long id;
    @NotBlank(message = "ID는 필수 입력 값입니다.")
    private String loginId;

    @NotEmpty(message = "비밀번호는 필수 입력 값입니다.")
    @Length(min=8, max=16, message = "비밀번호는 8자 이상,  16자 이하로 입력해주세요.")
    private String password;

    @NotBlank(message = "닉네임은 필수 입력 값입니다.")
    private String nickname;

    @NotEmpty(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식으로 입력해주세요.")
    private String email;

    @NotBlank(message = "생년월일은 필수 입력 값입니다.")
    private String birth;

    @NotBlank(message = "핸드폰 번호는 필수 입력 값입니다.")
    private String phoneNumber;

    @NotEmpty(message = "주소는 필수 입력 값입니다.")
    private String zipcode;

    @NotEmpty(message = "상세주소는 필수 입력 값입니다.")
    private String address;

    @NotEmpty(message = "상세주소는 필수 입력 값입니다.")
    private String addressDetail;

    private Role role;

    public static MemberDto from(Member member) {
        MemberDto dto = new MemberDto();
        dto.setId(member.getId());
        dto.setLoginId(member.getLoginId());
        dto.setNickname(member.getNickname());
        dto.setEmail(member.getEmail());
        dto.setBirth(member.getBirth());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setZipcode(member.getZipcode());
        dto.setAddress(member.getAddress());
        dto.setAddressDetail(member.getAddressDetail());
        dto.setRole(member.getRole()); // ENUM → String
        return dto;
    }
}
