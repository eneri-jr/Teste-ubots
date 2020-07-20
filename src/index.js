import "core-js";
import "regenerator-runtime/runtime";

import Cliente from "./cliente";
import {getClientes} from "./api_service";
import Venda from "./venda";
import {getVendas} from "./api_service";
import Vinhos from "./vinhos";

async function principal() {
  //Cria um array com os dados de cliente da API
  let clientes = [];
  let clientesJSON = await getClientes();
  clientesJSON.forEach(cliente => {
    const novoCliente = new Cliente(cliente["id"], cliente["nome"],cliente["cpf"], 0, 0);
    clientes.push(novoCliente);
  })
  
  //Cria um array com os dados das vendas da API
  let vendas = [];
  let vendasJSON = await getVendas();
  vendasJSON.forEach(venda => {
    const novaVenda = new Venda(venda["codigo"], venda["data"],venda["cliente"],venda["itens"],venda["valorTotal"]);
    vendas.push(novaVenda);
  })
  
  //chamada de funções para a criação da tela principal
  arrumaCpfVenda(vendas);
  agregaValor(clientes, vendas);
  ordemClientesGastos(clientes);
  mostraClientesGastos(clientes);
  maiorVenda2016(vendas, clientes);
  fidelidadeCliente(clientes);
  mostraClientesVisitas(clientes);
  click(clientes,vendas);
}

//Função que imprime os clientes na tela em ordem de gasto
function mostraClientesGastos(clientes){
    const tableElement = document.getElementById("lista-clientes-valor");
    clientes.forEach(cliente => {
      const trElement = document.createElement("tr");
      const valor = cliente.valorGasto.toFixed(2);
      const tdElement = document.createElement("td");
      tdElement.innerText = `${cliente.id}`;
      trElement.appendChild(tdElement);
      const tdElement1 = document.createElement("td");
      tdElement1.innerText = `${cliente.nome}`;
      trElement.appendChild(tdElement1);
      const tdElement2 = document.createElement("td");
      tdElement2.innerText = `${cliente.cpf}`;
      trElement.appendChild(tdElement2);
      const tdElement3 = document.createElement("td");
      tdElement3.innerText = `R$ ${valor}`;
      trElement.appendChild(tdElement3);
      tableElement.appendChild(trElement);
    })
}

//Função que imprime os 5 primeiros clientes na tela em ordem de vendas
function mostraClientesVisitas(clientes){
  const tableElement = document.getElementById("lista-clientes-compras");
  let novosclientes = [];
  for(let i = 0; i < 5 ; i++){
    novosclientes[i] = clientes[i];
  }
  novosclientes.forEach(cliente => {
      const trElement = document.createElement("tr");
      const tdElement = document.createElement("td");
      tdElement.innerText = `${cliente.id}`;
      trElement.appendChild(tdElement);
      const tdElement1 = document.createElement("td");
      tdElement1.innerText = `${cliente.nome}`;
      trElement.appendChild(tdElement1);
      const tdElement2 = document.createElement("td");
      tdElement2.innerText = `${cliente.cpf}`;
      trElement.appendChild(tdElement2);
      const tdElement3 = document.createElement("td");
      tdElement3.innerText = `${cliente.contador}`;
      trElement.appendChild(tdElement3);
      tableElement.appendChild(trElement);
  })
}

//Tirar o primeiro zero dos cpfs que tem 4 no inicio, a partir da segunda venda e colocar
//traço para segui padrão
function arrumaCpfVenda(vendas){
  let temp = vendas[0].cliente;
    vendas[0].cliente = temp.substring(0,11) + ("-") + temp.substring(12,14);
  for(let i = 1; i < vendas.length;i++){
    temp = vendas[i].cliente;
    vendas[i].cliente = temp.substring(1,12) + ("-") + temp.substring(13,15);
    }
}
  
//Função para colocar os valores gastos no elemento cliente e visitas no contador
function agregaValor(clientes, vendas){
  for(let i = 0; i < clientes.length ; i++){
    for(let j = 0; j < vendas.length; j++){
      if(clientes[i].cpf == vendas[j].cliente){
        clientes[i].valorGasto = clientes[i].valorGasto + vendas[j].valorTotal;
        clientes[i].contador ++;
      }
    }
  }
}

//Função para ordenar os clientes pelo valor gasto
function ordemClientesGastos(clientes){
  clientes.sort(function (clienteA, clienteB) {
    if (clienteA.valorGasto < clienteB.valorGasto) {
      return 1;
    }
    if (clienteA.valorGasto > clienteB.valorGasto) {
      return -1;
    }
    // Se Cliente A for igual a Cliente B
    return 0;
  });
}

//Função que encontra no arquvio as vendas de 2016
function encontraVendas2016(vendas){
  let vendas2016 = [];
  
  vendas.forEach(venda => {
    let dataNova = venda.data.split("-");
    if(dataNova[2] == "2016"){
      vendas2016.push(venda);
    }
  })

  return vendas2016;

}

//Função que ordena vendas de 2016 em ordem decrescente
function ordenaVendas2016(vendas2016){
  
  vendas2016.sort(function (valorA, valorB) {
    if (valorA.valorTotal < valorB.valorTotal) {
      return 1;
    }
    if (valorA.valorTotal > valorB.valorTotal) {
      return -1;
    }
    // Se Valor A for igual a Valor B
    return 0;
  })

  return vendas2016;

}

//Função para descobrir a venda mais alta em 2016 e chamar o que vai imprimir na tela
function maiorVenda2016(vendas,clientes){
  
  let vendas2016 = []
  vendas2016 = encontraVendas2016(vendas);
  vendas2016 = ordenaVendas2016(vendas2016);
  

  for(let i = 0; i<clientes.length;i++){
    if(clientes[i].cpf == vendas2016[0].cliente){
      const pElement = document.getElementById("venda-alta");
      const text = "A maior venda de 2016 foi realizada para a cliente: " + clientes[i].nome +
                   " na data de " + vendas2016[0].data + " e no valor de R$ " + 
                   vendas2016[0].valorTotal;
      pElement.innerText = text;
    }
  }
}

//Função para organizar a relação de clientes por número de compras
function fidelidadeCliente(clientes){
  clientes.sort(function (visitasA, visitasB) {
    if (visitasA.contador < visitasB.contador) {
      return 1;
    }
    if (visitasA.contador > visitasB.contador) {
      return -1;
    }
    // Se Valor A for igual a Valor B
    return 0;
    
  })
}

//Quando clicar em recomendar, ela chama a função recomenda
function click (clientes, vendas){
    document.getElementById("recomenda").onclick = function() {recomenda(clientes,vendas)};
}

//Função que procura o cliente digitado
function procuraCliente(clientes, res){

  for(let i = 0; i<clientes.length;i++){
    if(clientes[i].nome == res){
      return clientes[i];
    }
  }

  return alert("Este cliente não consta em seus arquivos!");
}

//Função que busca todas as vendas do cliente
function procuraVendas(vendas, novoCliente){
  
  let vendasCliente = [];
  for(let i = 0; i < vendas.length; i++){
    if(novoCliente.cpf == vendas[i].cliente){
      vendasCliente.push(vendas[i]);
    }
  }

  return vendasCliente;

}

//Função que retorna a variedade de vinhos do cliente
function procuraPreferidos(vendasCliente){
  
  let prefVinhos = []; 
  for(let i = 0; i < vendasCliente.length; i++){
    for(let j = 0; j < vendasCliente[i].itens.length; j++){
       prefVinhos.push(vendasCliente[i].itens[j].variedade);
    }
  }

  return prefVinhos;
}

//Função que indica o número de vezes de cada item do array
function criaObjetoOcorrencias(objeto){

  let ocorrencias = [];
  
  for (let i = 0; i < objeto.length; i++) {
    ocorrencias[objeto[i]] = (ocorrencias[objeto[i]] || 0) + 1;
  }

  return ocorrencias;
}

//Função que retorna a ocorrencia de maior valor
function maiorOcorrencia (ocorrencias){

  let maior = -Infinity;
  let ocorrenciaMaior;
  for(let prop in ocorrencias) {
    if(ocorrencias.hasOwnProperty(prop)) { 
         if(ocorrencias[prop] > maior) {
             maior = ocorrencias[prop];
             ocorrenciaMaior = prop;
         }
    }
  }

  return ocorrenciaMaior;
}

//Função que encontra as vendas da variedade preferida
function procuraVinhosPreferido(vendas, variedadePreferida){

  let vendasVinho = [];
  for(let i = 0; i < vendas.length; i++){
    for(let j = 0; j < vendas[i].itens.length; j++){
      if(vendas[i].itens[j].variedade == variedadePreferida){
     vendasVinho.push(vendas[i].itens[j].produto)
      }
    }
  }
  
  return vendasVinho;

}

//Função que imprime no objeto html a recomendação de vinho
function escreveRecomendacao(res, variedadePreferida, vinhoIndicado){
  const pElement = document.getElementById("nome-cliente");
  
  const text = "Cliente selecionado: " + res;
  pElement.innerText = text;

  const pElement2 = document.getElementById("recomendacao");

  const text2 = "Por gostar mais de vinhos: " + variedadePreferida
            +"\nIndicamos para este cliente o vinho: " + vinhoIndicado + " (" + variedadePreferida + ")";
  pElement2.innerText = text2;
}

//Função que recomenda um vinho para o cliente
function recomenda(clientes,vendas){
  
  let res = document.getElementById("input").value;
  
  if(res == ""){
    return alert("Você não digitou o nome do cliente!")
  }
  
  let novoCliente = procuraCliente(clientes, res);

  let vendasCliente = procuraVendas(vendas, novoCliente);
  
  let prefVinhos = procuraPreferidos(vendasCliente);
    
  let variedadeDeVinhos = criaObjetoOcorrencias(prefVinhos);

  let variedadePreferida = maiorOcorrencia(variedadeDeVinhos);

  let vendasVinhoPreferido = procuraVinhosPreferido(vendas, variedadePreferida);

  let vendaVinhosPreferidoOrg = criaObjetoOcorrencias(vendasVinhoPreferido);

  let vinhoIndicado = maiorOcorrencia(vendaVinhosPreferidoOrg);

  escreveRecomendacao(res, variedadePreferida, vinhoIndicado);
  
}

principal();