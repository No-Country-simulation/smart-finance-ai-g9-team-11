package br.com.financeai;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada da aplicação Finance AI.
 */
@SpringBootApplication
public class FinanceAiApiApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(FinanceAiApiApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("Finance AI API is running...");
    }
}