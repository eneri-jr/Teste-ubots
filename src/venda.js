export default class Venda{ 
    constructor(codigo, data, cliente, itens, valorTotal) {
      this.codigo = codigo;
      this.data = data;
      this.cliente = cliente;
      this.itens = itens;
      this.valorTotal = valorTotal;
    }
}