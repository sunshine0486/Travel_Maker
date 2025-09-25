package com.tm_back.controller;

import com.tm_back.dto.MemberResponseDto;
import com.tm_back.dto.BoardResponseDto;
import com.tm_back.dto.CommentResponseDto;
import com.tm_back.dto.PagedResponse;
import com.tm_back.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ===== Member =====
    @GetMapping("/members")
    public PagedResponse<MemberResponseDto> getMembers(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        return adminService.getMembers(page, size);
    }

    // ===== Board =====
    @GetMapping("/boards")
    public PagedResponse<BoardResponseDto> getBoards(@RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return adminService.getBoards(page, size);
    }

    @DeleteMapping("/boards/{id}")
    public void deleteBoard(@PathVariable Long id) {
        adminService.deleteBoard(id);
    }

    // ===== Comment =====
    @GetMapping("/comments")
    public PagedResponse<CommentResponseDto> getComments(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return adminService.getComments(page, size);
    }

    @PatchMapping("/comments/{id}/delete")
    public void softDeleteComment(@PathVariable Long id) {
        adminService.softDeleteComment(id);
    }
}
