package com.tm_back.repository;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface BoardRepository extends JpaRepository<Board,Long> {
    List<Board> findTop3ByDelYnOrderByRegTimeDesc(DeleteStatus delYn);

    List<Board> findByCategory(Category category);

    List<Board> findByCategoryAndDelYn(Category category, DeleteStatus delYn);

    Page<Board> findByDelYn(DeleteStatus delYn, Pageable pageable);
    List<Board> findByDelYn(DeleteStatus delYn);

}
