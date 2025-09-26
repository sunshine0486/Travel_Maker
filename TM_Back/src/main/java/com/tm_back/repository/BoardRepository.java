package com.tm_back.repository;

import com.tm_back.constant.Category;
import com.tm_back.constant.DeleteStatus;
import com.tm_back.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;

import java.util.List;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board,Long> {
    List<Board> findTop3ByOrderByRegTimeDesc();

    List<Board> findByCategory(Category category);

    List<Board> findByCategoryAndDelYn(Category category, DeleteStatus delYn);

}
