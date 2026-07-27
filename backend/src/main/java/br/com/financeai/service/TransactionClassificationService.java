package br.com.financeai.service;

import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.response.TransactionClassificationResponse;
import br.com.financeai.entity.AppUser;
import br.com.financeai.entity.Transaction;
import br.com.financeai.exception.UserNotFoundException;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import br.com.financeai.repository.TransactionRepository;
import br.com.financeai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionClassificationService {

    private final MlClient mlClient;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public TransactionClassificationService(MlClient mlClient, UserRepository userRepository, TransactionRepository transactionRepository){
        this.mlClient = mlClient;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }


    public List<TransactionClassificationResponse> createTransactions(List<TransactionRequest> requests) {

        AppUser user = getTestUser();

        List<Transaction> transactions = new ArrayList<>();

        for (TransactionRequest request : requests) {

            // Classifica a transação utilizando a IA
            TransactionClassificationResponse classification = classify(request);

            // Cria a entidade
            Transaction transaction = new Transaction();

            transaction.setDescricao(request.descricao());
            transaction.setValor(request.valor());
            transaction.setTipo(request.tipo());
            transaction.setDataTransacao(request.dataTransacao());

            transaction.setCategoria(classification.categoria());
            transaction.setUsuario(user);

            transactions.add(transaction);
        }

        transactionRepository.saveAll(transactions);

        List<TransactionClassificationResponse> response = new ArrayList<>();

        for (Transaction transaction : transactions) {

            response.add(new TransactionClassificationResponse(
                    transaction.getDescricao(),
                    transaction.getValor(),
                    transaction.getTipo(),
                    transaction.getCategoria(),
                    transaction.getDataTransacao()
            ));
        }

        return response;
    }


        public TransactionClassificationResponse classify(TransactionRequest request){

            MlTransactionRequest mlRequest =
                    new MlTransactionRequest(
                            request.descricao(),
                            request.valor(),
                            request.tipo(),
                            request.dataTransacao()
                    );


            MlTransactionResponse mlResponse = mlClient.classifyTransaction(mlRequest);

            return new TransactionClassificationResponse(
                    mlResponse.descricao(),
                    mlResponse.valor(),
                    mlResponse.tipo(),
                    mlResponse.categoria(),
                    mlResponse.dataTransacao()

            );
    }

    private AppUser getTestUser() {

        return userRepository.findByEmail("teste@financeai.com")
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Usuário de teste não encontrado."
                        ));
    }
}
