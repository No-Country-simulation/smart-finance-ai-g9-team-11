package br.com.financeai.config;

import br.com.financeai.entity.AppUser;
import br.com.financeai.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    private static final String TEST_USER_EMAIL = "teste@financeai.com";

    private final UserRepository userRepository;

    DatabaseInitializer(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!userRepository.existsByEmail(TEST_USER_EMAIL)) {

            AppUser appUser = new AppUser();

            appUser.setNome("Usuário Teste");
            appUser.setEmail(TEST_USER_EMAIL);
            appUser.setSenha("123456"); // Criptografar com BCrypt

            userRepository.save(appUser);

            System.out.println("Usuário de teste criado.");

        }
    }
}
