package com.tm_back.repository;

import com.tm_back.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFile,Long> {
    List<BoardFile> findByBoardIdOrderByIdAsc(Long boardId);
}
