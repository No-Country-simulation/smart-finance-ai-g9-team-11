package br.com.financeai.service;

import br.com.financeai.dto.request.TransactionRequest;
import br.com.financeai.dto.response.TransactionClassificationResponse;
import br.com.financeai.integration.client.MlClient;
import br.com.financeai.integration.dto.request.MlTransactionRequest;
import br.com.financeai.integration.dto.response.MlTransactionResponse;
import org.springframework.stereotype.Service;

@Service
public class TransactionClassificationService {

    private final MlClient mlClient;

    public TransactionClassificationService(MlClient mlClient){
            this.mlClient = mlClient;
        }


        public TransactionClassificationResponse classify(TransactionRequest request){

            MlTransactionRequest mlRequest =
                    new MlTransactionRequest(
                            request.descricao(),
                            request.valor()
                    );


            MlTransactionResponse mlResponse = mlClient.classifyTransaction(mlRequest);

            return new TransactionClassificationResponse(
                    mlResponse.descricao(),
                    mlResponse.valor(),
                    mlResponse.categoria()
            );
    }
}
