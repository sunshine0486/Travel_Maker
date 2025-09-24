package com.tm_back.controller;

import com.tm_back.dto.VisitorDto;
import com.tm_back.entity.VisitorCnt;
import com.tm_back.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;

    // 방문자 카운트 (쿠키 발급 + 증가)
    @GetMapping("/visit")
    public long countVisitor(HttpServletRequest request, HttpServletResponse response) {
        return visitorService.handleVisit(request, response);
    }

    // 최근 N일 조회
    @GetMapping("/visitors/daily")
    public List<VisitorDto> getDailyVisitors(@RequestParam int days) {

        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(days - 1);

        return visitorService.findBetweenDates(start, today).stream()
                .map(v -> new VisitorDto(
                                            v.getVisitDate().format(DateTimeFormatter.ofPattern("MM-dd")),
                                            v.getCount()))
                .toList();
    }

    // 최근 N개월 조회
    @GetMapping("/visitors/monthly")
    public List<VisitorDto> getMonthlyVisitors(int months) {
        YearMonth thisMonth = YearMonth.now();
        YearMonth startMonth = thisMonth.minusMonths(months - 1);

        return visitorService.findBetweenDates(startMonth.atDay(1), thisMonth.atEndOfMonth())
                .stream()
                .collect(Collectors.groupingBy(
                        v -> YearMonth.from(v.getVisitDate()),
                        Collectors.summingLong(VisitorCnt::getCount)
                ))
                .entrySet().stream()
                .map(e -> new VisitorDto(e.getKey().toString(), e.getValue()))
                .sorted((a, b) -> a.getLabel().compareTo(b.getLabel()))
                .toList();
    }

}
