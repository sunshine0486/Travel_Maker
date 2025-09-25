package com.tm_back.repository;

import com.tm_back.entity.Board;
import com.tm_back.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LikesRepository extends JpaRepository<Likes,Long> {
    int countByBoardId(Long boardId);

    boolean existsByBoardIdAndMemberId(Long boardId, Long memberId);

    void deleteByBoardIdAndMemberId(Long boardId, Long memberId);

    // 게시글별 좋아요 집계: [0]=Board, [1]=Long(count)
    @Query("""
        SELECT l.board, COUNT(l)
        FROM Likes l
        GROUP BY l.board
        ORDER BY COUNT(l) DESC, MAX(l.board.regTime) DESC
        """)
    List<Object[]> findBoardLikeCounts();
}
