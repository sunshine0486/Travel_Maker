package com.tm_back.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class JPAConfig {

//    private final EntityManager entityManager;
//
//    @Bean
//    public JPAQueryFactory jpaQueryFactory(){
//        return new JPAQueryFactory(entityManager);
//    }
}
