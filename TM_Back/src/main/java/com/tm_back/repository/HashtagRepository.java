package com.tm_back.repository;

import com.tm_back.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag,Long> {
    Optional<Hashtag> findByHashtagName(String tagName);
}
