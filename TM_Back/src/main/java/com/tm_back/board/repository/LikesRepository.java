package com.tm_back.board.repository;

import com.tm_back.board.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikesRepository extends JpaRepository<Likes,Long> {
    int countByBoardId(Long boardId);

    boolean existsByBoardIdAndMemberId(Long boardId, Long memberId);

    void deleteByBoardIdAndMemberId(Long boardId, Long memberId);
}
