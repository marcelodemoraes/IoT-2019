#include <BLEAdvertisedDevice.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <WiFi.h>
#include <HTTPClient.h>


const int PIN = 2; //led azul da esp32

const char* ssid = ""; //nome da rede em que a esp32 vai se conectar como cliente
const char* password =  ""; //senha da rede que a esp32 vai se conectar como cliente

const String SERVER_URL = ""; //servidor para qual a esp32 vai enviar os dados obtidos

String espWiFiMacAddress = ""; //WiFi Mac da propria esp32, obtido numa funcao

const bool isFiltering = true; //ativa ou desativo filtro de mac - para pegar apenas alguns dispositivos especificos
const String MAC_FILTER = ""; //mac a ser filtrado


void sendPOST(String rssi, String mac, String URL){
  
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
     digitalWrite(PIN, HIGH); //liga o led azul
     HTTPClient http; //objeto que fez as requisicoes http
     http.begin(URL);  //Specify destination for HTTP request
     http.addHeader("Content-Type", "application/x-www-form-urlencoded");  //Specify content-type header
     
     //myWifiMac=macDaEsp&rssi=rssi&SniffedBluetoothMac=macSniffado
     String data = "sourceMac="+ espWiFiMacAddress + "&rssi=" + rssi + "&sniffedMac=" + mac; //payload do POST
     
     int httpResponseCode = http.POST(data);   //Send the actual POST request
     if(httpResponseCode>0){ //caso tenha feito o envido
      String response = http.getString();      //Get the response to the request
      Serial.println(httpResponseCode);   //Print return http code
      Serial.println(response);           //Print request answer
     } 
     else{
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode); //resposta de erro - nao é um codigo http, mas um codigo da lib WiFi
     }
     http.end();  //Free resources
   }
   else{ //nao estava conectado no wifi
      Serial.println("Error in WiFi connection");   
   }
    //delay(100);
    digitalWrite(PIN, LOW); //desliga o led, faz com que pisque quando envie POSTs
}

void wifiInit(){
  delay(4000);   //Delay needed before calling the WiFi.begin
  WiFi.mode(WIFI_MODE_STA); //modo station, um cliente wifi
  espWiFiMacAddress = WiFi.macAddress(); //pega o mac wifi do proprio dispositivo
  
  WiFi.begin(ssid, password); //conecta na rede wifi
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}
void setup() {
  Serial.begin(115200);
  wifiInit(); //função que inicia rotina wifi
  pinMode(PIN, OUTPUT);
  BLEDevice::init(""); //inicia bluetooth low energy
  Serial.println("Starting...");
}

void loop() {
  BLEScan *scan = BLEDevice::getScan(); //objeto que realiza o scanning
  scan->setActiveScan(true); //scanning ativo é mais preciso mas mais custoso energeticamente
  BLEScanResults results = scan->start(1); 
  int counter = results.getCount(); //numero de dispositivos bluetooth descobertos
  if(counter == 0){
    Serial.println("No Bluetooth devices found )=");
  }
  else{
    for (int i = 0; i < counter; i++) {
      BLEAdvertisedDevice device = results.getDevice(i); //pega um dispositivo dentre os encontrados
      
      int deviceRssi = device.getRSSI(); //pega o rssi do dispositivo encontrado
      
      //String deviceName = device.getName().c_str(); //pega o nome, nao funcionou
      //String deviceMac = device.getAddress().toString().c_str(); //pega o endereço mac bluetooth do dispositivo encontrado
      String deviceMac = device.getAddress().toString().c_str(); 
      
       
      
      //Serial.println("Name: " + deviceName);
      
      if(isFiltering == true){ //caso o filtro esteja ativado
        if(deviceMac == MAC_FILTER){ //caso seja o mac que procuramos
          Serial.println("::FOUND:: RSSI: " + String(deviceRssi) + "  Address: " + deviceMac);
          sendPOST(String(deviceRssi), deviceMac, SERVER_URL); //envia ao servidor os dados obtidos
        }
      }
      else{ //caso não tenha filtro, envia todo e qualquer mac encontrado
        Serial.println("::FOUND:: RSSI: " + String(deviceRssi) + "  Address: " + deviceMac);
        sendPOST(String(deviceRssi), deviceMac, SERVER_URL); //envia ao servidor os dados obtidos
      }
    }
  }
}
