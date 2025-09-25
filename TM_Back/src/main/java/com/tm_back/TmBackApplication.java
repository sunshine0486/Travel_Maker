package com.tm_back;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@RequiredArgsConstructor
@SpringBootApplication
@EnableJpaAuditing
public class TmBackApplication implements CommandLineRunner {


    public static void main(String[] args) {
        SpringApplication.run(TmBackApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

    }

}
