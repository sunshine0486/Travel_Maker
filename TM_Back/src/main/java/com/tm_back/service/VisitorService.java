package com.tm_back.service;

import com.tm_back.entity.VisitorCnt;
import com.tm_back.repository.VisitorCntRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorCntRepository cntRepo;

    @Transactional
    public long handleVisit(HttpServletRequest request, HttpServletResponse response) {
        LocalDate today = LocalDate.now();

        // 1) 쿠키 확인
        String visitorCookie = getCookieValue(request, "VISITOR");
        if (visitorCookie == null) {
            // 2) 오늘 처음 방문 → 쿠키 발급
            createVisitorCookie(response);

            // 3) 집계 업데이트
            VisitorCnt cnt = cntRepo.findById(today)
                    .orElse(new VisitorCnt(today, 0));
            cnt.increment();
            cntRepo.save(cnt);
        }

        return cntRepo.findById(today).map(VisitorCnt::getCount).orElse(0L);
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(name)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void createVisitorCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("VISITOR", UUID.randomUUID().toString());
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // 오늘 23:59:59에 만료되도록 설정
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime midnight = now.toLocalDate().atStartOfDay().plusDays(1);
        long seconds = Duration.between(now, midnight).getSeconds();
        cookie.setMaxAge((int) seconds);

        response.addCookie(cookie);
    }

    @Transactional(readOnly = true)
    public List<VisitorCnt> findBetweenDates(LocalDate start, LocalDate end) {
        return cntRepo.findAll().stream()
                .filter(v -> !v.getVisitDate().isBefore(start) && !v.getVisitDate().isAfter(end))
                .toList();
    }
}

