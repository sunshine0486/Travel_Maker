package com.tm_back.board.repository;

import com.tm_back.board.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardFileRepository extends JpaRepository<BoardFile,Long> {
}
