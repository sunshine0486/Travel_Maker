package com.tm_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommentConfig {

    @Value("${comment.max-length}")
    private int maxLength;

    public int getMaxLength() {
        return maxLength;
    }
}
