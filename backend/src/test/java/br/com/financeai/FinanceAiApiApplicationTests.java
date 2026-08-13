package br.com.financeai;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("Disabled because service unit tests should not depend on the real database")
@SpringBootTest
class FinanceAiApiApplicationTests {

    @Test
    void contextLoads() {
    }
}
