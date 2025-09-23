package com.tm_back.entity.repository;

import com.tm_back.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardIdAndParentIsNullOrderByRegTimeAsc(Long boardId);

    // 특정 부모 댓글의 자식 개수 조회
    int countByParentId(Long parentId);
}

