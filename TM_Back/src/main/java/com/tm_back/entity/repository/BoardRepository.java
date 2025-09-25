package com.tm_back.entity.repository;

import com.tm_back.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository  extends JpaRepository<Board, Long> {
}
