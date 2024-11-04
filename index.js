//IMPORTA A CONFIGURAÇÃO DO ARQUIVO .ENV
require("dotenv").config();

//IMPORTA O MYSQL
const mysql = require("mysql2");

//DEFINE AS CONSTANTES DE ACESSO AO WANGUARD E MYSQL ATRAVÉS DA CONFIG DO .ENV
const wanguard_api_url = process.env.WANGUARD_API_URL;
const wanguard_api_key = process.env.WANGUARD_API_KEY;
const mysql_host = process.env.MYSQL_HOST;
const mysql_user = process.env.MYSQL_USER;
const mysql_pass = process.env.MYSQL_PASS;
const mysql_database = process.env.MYSQL_DB;

//CRIA A CONEXÃO COM O MYSQL
const conn = mysql.createConnection({
  host: mysql_host,
  user: mysql_user,
  password: mysql_pass,
  database: mysql_database,
});

//DEFINE A FUNÇÃO QUE IRÁ FAZER A REQUISIÇÃO DAS ANOMALIAS
async function getAnomalies() {
  let anomalies;
  //EXECUTA UM TRY/CATCH A FIM DE CAPTURAR UM ERRO CASO OCORRA
  try {
    //FAZ A REQUISIÇÃO HTTP GET
    const response = await fetch(
      `${wanguard_api_url}/wanguard-api/v1/anomalies?status=Active&fields=anomaly_id%2Cprefix%2Cdecoder%2Cduration%2Cbits%2Fs%2Cbits%2Cip_group`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${wanguard_api_key}`,
        },
      }
    );
    //CHECA SE A RESPONSE RETORNOU OK, CASO NÃO, CHAMA UM ERRO E INTERROMPE A FUNÇÃO
    if (!response.ok)
      throw new Error(
        "HTTP Error: " + response.status + " | " + response.statusText
      );
    //TRANSFORMA OS DADOS DA RESPONSE EM JSON
    const data = await response.json();
    //RETORNA OS DADOS
    anomalies = data;
  } catch (error) {
    //SE CAPTURAR UM ERRO, EXIBE NO LOG
    console.log(error.message);
  } finally {
    saveOnDB(anomalies);
  }
}

//DEFINE A FUNÇÃO QUE IRÁ SALVAR OS DADOS DAS ANOMALIAS NO MYSQL
function saveOnDB(data) {
  //CONECTA O MYSQL
  conn.connect((err) => {
    //RETORNA ERRO SE A CONEXÃO NÃO FOR REALIZADA
    if (err) console.log(err.message);
    //RETORNA NO LOG SE A CONEXÃO FOI BEM SUCEDIDA.
    console.log("Mysql Conectado.");
    //REALIZA UM LOOP PARA CADA ANOMALIA
    for (let i = 0; i < data.length; i++) {
      //PEGA A ANOMALIA ATUAL NO LOOP
      let attack = data[i];
      //DEFINE A DATA
      const timestamp = new Date();
      //STRING DA QUERY SQL
      let sql = `INSERT INTO ddos_metrics (timestamp, attack_type, attack_target, attack_size, attack_duration, ip_group) VALUES ("${timestamp
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}", "${attack.decoder.decoder_name}", "${
        attack.prefix
      }", ${attack.bits}, "${attack.duration}", "${attack.ip_group}")`;
      //REALIZA A QUERY COM O INSERT DA ANOMALIA
      conn.query(sql, (err, result) => {
        
      });
    }
    console.log("Anomalias salvas no DB")
  });
  conn.destroy()
}

//DEFINE A VARIÁVEL QUE IRÁ RECEBER AS ANOMALIAS E CHAMA A FUNÇÃO
getAnomalies();
//SALVA AS ANOMALIAS NO BANCO DE DADOS
//if (anomalies) saveOnDB(anomalies);
