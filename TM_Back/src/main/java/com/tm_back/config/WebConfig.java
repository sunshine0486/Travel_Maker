package com.tm_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${boardFileLocation}")
    private String boardFileLocation;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /image/board/** 요청이 들어오면 로컬 디렉토리에 있는 파일을 매핑
        registry.addResourceHandler("/image/board/**")
                // 실제 파일 위치: file:///C:/upload/board/
                // (boardFileLocation 경로의 파일을 URL로 접근 가능하게 함)
                .addResourceLocations("file:///" + boardFileLocation + "/")
                // 캐시 유지 시간 (초 단위) → 3600초 = 1시간
                .setCachePeriod(3600)
                // 정적 리소스 최적화 체인 활성화
                .resourceChain(true);
    }
}
