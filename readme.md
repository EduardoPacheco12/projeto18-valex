# **Valex**

### <p>Valex é uma API de cartões de benefícios. A API será responsável pela criação, recarga, ativação, assim como o processamento das compras.</p>

# Rotas de criação e gerenciamento de cartões:

## Rota <span style="color:green"> **POST** </span>/card/create/:employeeId

Essa é uma rota autenticada com um header http do tipo "x-api-key"(exemplo abaixo). Sua função é criar novos cartões para os funcionários.

```json
{
  "x-api-key": "key_da_empresa" //string
}
```

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "employeeId": "id_do_funcionario", //number
  "type": "tipo_do_cartão" //string
}
```

## Rota <span style="color:blue"> **PATCH** </span>/card/activate/:cardId

Essa é uma rota não autenticada. Sua função é ativar os cartões criados.

O "cardId" passado na rota é o id do cartão criado na rota mencionada anteriormente.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "securityCode": "cvc_do_cartao", //string
  "password": "senha_escolhida" //string
}
```

## Rota <span style="color:yellow"> **GET** </span>/card/balance/:cardId

Essa é uma rota não autenticada. Sua função é verificar o extrato dos cartões.

O "cardId" passado na rota é o id do cartão criado.

A resposta da requisição virá no seguinte formato:

```json
"balance": 35000,
  "transactions": [
		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
	]
  "recharges": [
		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
	]
```

## Rotas <span style="color:blue"> **PATCH** </span>/card/lock/:cardId e /unlock/:cardId

Rotas não autenticadas, mesmo funcionamento, com o intuito de permitir ao usuário respectivamente bloquear e desbloquear um cartão.

O "cardId" passado na rota é o id do cartão criado.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "password": "senha_do_cartão" //string
}
```

# Rotas de compra e recarga:

## Rota <span style="color:green"> **POST** </span>/recharge/:cardId

Essa é uma rota autenticada com um header http do tipo "x-api-key"(exemplo abaixo). Sua função é recarregar os cartões para os funcionários.

```json
{
  "x-api-key": "key_da_empresa" //string
}
```

O "cardId" passado na rota é o id do cartão criado.

O Body da requisição deve ser feito no seguinte formato:

```json
{
  "amount": "valor_escolhido" //number
}
```

## Rota <span style="color:green"> **POST** </span>/payments/POS

Essa é uma rota não autenticada. Sua função é permitir aos funcionários fazerem compras em estabelecimentos **do mesmo tipo** dos seus cartões.

```json
{
  "businessId": "id_do_estabelecimento", //number
  "cardId": "id_do_cartão", //number
  "amount": "valor_da_compra", //number
  "password": "senha_do_cartão" //string
}
```