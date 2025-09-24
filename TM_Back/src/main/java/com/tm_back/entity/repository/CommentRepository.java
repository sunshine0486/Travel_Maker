package com.tm_back.entity.repository;

import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoardIdAndParentIsNullOrderByRegTimeAsc(Long boardId);
    // ✅ 삭제되지 않은 댓글만 조회
    Page<Comment> findByBoardIdAndDelYn(Long boardId, DeleteStatus delYn, Pageable pageable);
    // 특정 부모 댓글의 자식 개수 조회
    long countByParentIdAndDelYn(Long parentId, DeleteStatus delYn);
}

