package com.tm_back.controller;

import com.tm_back.config.CommentConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/config")
@RequiredArgsConstructor
public class ConfigController {

    private final CommentConfig commentConfig;

    @GetMapping("/comment-max-length")
    public int getCommentMaxLength() {
        return commentConfig.getMaxLength();
    }
}

