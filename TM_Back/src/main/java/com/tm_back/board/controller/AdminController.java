package com.tm_back.board.controller;

import com.tm_back.board.dto.FileSettingDto;
import com.tm_back.board.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    @GetMapping("/admin/filesetting")
    public ResponseEntity<?> getFileSetting(){

        return ResponseEntity.ok(adminService.getFileSetting());
    }

    @PatchMapping("/admin/filesetting")
    public ResponseEntity<FileSettingDto> updateFileSetting(
            @RequestBody FileSettingDto dto) {
        FileSettingDto updated = adminService.updateSetting(dto);
        return ResponseEntity.ok(updated);
    }
}
