# Rastreamento Inteligente

Este projeto tem o objetivo de desenvolver um protótipo para rastreamento inteligente bluetooth por salas. Ele funciona baseado na captação da força do sinal (RSSI) bluetooth de um beacon acoplado ao objeto rastreado, e vários sensores localizados cada um em uma sala. A cada 5 segundos o beacon envia pacotes bluetooth para os sensores, que captam as forças do sinal e enviam esses dados para um servidor, que por sua vez faz o cálculo de qual sala está mais próxima do objeto e portanto é onde mais provavelmente o objeto está. Todos os registros são salvos em um banco de dados Postgres localizados no servidor, e uma página HTML é fornecida para a monitoração ao vivo do rastreamento.

## Equipamentos

Os equipamentos utilizados para Beacon e Sensores foram ESP32, e uma Raspberry PI 3 como servidor.

## Execução

Para rodar o sistema, só é preciso instalar nas ESP32 os códigos ino de Beacon e Sniffer, e rodar no servidor o arquivo `index.js`, presente no diretório `RaspberryFiles`, com o comando

```node index.js```

Depois, para acessar a monitoração do sistema, basta abrir `front.html`, presente na pasta `Client`, em um browser na mesma rede que os equipamentos para visualizar a localização do beacon.