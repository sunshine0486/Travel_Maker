package com.tm_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TmBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(TmBackApplication.class, args);
    }

}
