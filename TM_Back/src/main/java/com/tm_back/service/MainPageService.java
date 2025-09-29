package com.tm_back.service;

import com.tm_back.constant.DeleteStatus;
import com.tm_back.dto.BoardDto;
import com.tm_back.dto.BoardFormDto;
import com.tm_back.dto.PagedResponse;
import com.tm_back.entity.Board;
import com.tm_back.entity.VisitorCnt;
import com.tm_back.repository.BoardRepository;
import com.tm_back.repository.LikesRepository;
import com.tm_back.repository.MemberRepository;
import com.tm_back.repository.VisitorCntRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MainPageService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final LikesRepository likesRepository;
    private final VisitorCntRepository visitorCntRepository;

    public ResponseEntity<List<BoardFormDto>> getCurrentBoards() {
        List<Board> boards = boardRepository.findTop3ByDelYnOrderByRegTimeDesc(DeleteStatus.N);
        List<BoardFormDto> dtos = boards.stream()
                .map(BoardFormDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 인기 5개: 좋아요 수 기준. LikesRepository에서 집계한 Board 순서대로 가져와서 BoardDto.from(board) 사용.
    public ResponseEntity<List<BoardDto>> getHotBoards() {
        // likesRepository.findBoardLikeCounts() returns List<Object[]> where [0]=Board, [1]=Long(count)
        List<Object[]> rows = likesRepository.findBoardLikeCounts(); // ordered by count desc, regTime desc
        List<BoardDto> result = new ArrayList<>();
        int limit = Math.min(5, rows.size());
        for (int i = 0; i < limit; i++) {
            Board board = (Board) rows.get(i)[0];
            BoardDto dto = BoardDto.from(board);
            // optional: you could set a rank field in DTO if you extend it
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    // 전체 통계
    public ResponseEntity<Map<String, Object>> getTotalcnt() {
        Map<String, Object> result = new HashMap<>();
        result.put("boardCnt", boardRepository.count());
        result.put("memberCnt", memberRepository.count());

        long todayVisitors = visitorCntRepository.findByVisitDate(LocalDate.now())
                .map(VisitorCnt::getCount)
                .orElse(0L);

        result.put("todayVisitor", todayVisitors);
        return ResponseEntity.ok(result);
    }

}
