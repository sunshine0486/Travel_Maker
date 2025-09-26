package com.tm_back.controller;

import com.tm_back.constant.Role;
import com.tm_back.dto.*;
import com.tm_back.repository.MemberRepository;
import com.tm_back.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final MemberRepository memberRepository;
    private final AdminService adminService;

    // 현재 로그인한 사용자 이름 가져오기
    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    // ADMIN 권한 확인 (USER면 RuntimeException 던짐)
    private void checkAdmin() {
        String loginId = getCurrentUsername();
        Role role = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("회원 없음"))
                .getRole();

        if (!"ADMIN".equals(role.toString())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근 권한이 없습니다.");
        }
    }

    // ===== Member =====
    @GetMapping("/members")
    public PagedResponse<MemberDto> getMembers(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        checkAdmin();
        return adminService.getMembers(page, size);
    }

    // ===== Board =====
    @GetMapping("/boards")
    public PagedResponse<BoardDto> getBoards(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        checkAdmin();
        return adminService.getBoards(page, size);
    }

    @DeleteMapping("/boards/{id}")
    public void deleteBoard(@PathVariable Long id) {
        checkAdmin();
        adminService.deleteBoard(id);
    }

    // ===== Comment =====
    @GetMapping("/comments")
    public PagedResponse<CommentResponseDto> getComments(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        checkAdmin();
        return adminService.getComments(page, size);
    }

    @PatchMapping("/comments/{id}/delete")
    public void softDeleteComment(@PathVariable Long id) {
        checkAdmin();
        adminService.softDeleteComment(id);
    }

//    유안코드
    @GetMapping("/filesetting")
    public ResponseEntity<?> getFileSetting(){
        return ResponseEntity.ok(adminService.getFileSetting());
    }

    @PatchMapping("/filesetting")
    public ResponseEntity<FileSettingDto> updateFileSetting(
            @RequestBody FileSettingDto dto) {
        checkAdmin();
        FileSettingDto updated = adminService.updateSetting(dto);
        return ResponseEntity.ok(updated);
    }
}

