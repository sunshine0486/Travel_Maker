package com.tm_back.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MyPageDto {
    private String password;
    private String nickname;
    private String email;
    private String birth;
    private String phoneNumber;
    private String zipcode;
    private String address;
    private String addressDetail;
}
