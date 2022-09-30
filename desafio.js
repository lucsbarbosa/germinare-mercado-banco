const contas = [];
const numerosGerados = new Set();
const numeroTransf = numeroAleatorio(20, 1);

console.log("Antes das transferências");
for (let i = 0; i < 5; i++) contas.push(gerarConta());
console.table(contas, Object.keys(contas[0]).slice(0, 7));

console.log(`Número de transferências sorteado: ${numeroTransf}`);
for (let i = 0; i < numeroTransf; i++) gerarTransf();
console.log("Depois das transferências");
console.table(contas, Object.keys(contas[0]).slice(0, 7));

contas.forEach((conta) => {
  console.log(`Histórico da conta ${conta.numero}`);
  console.table(conta.historico);
});

function numeroAleatorio(max, min = 0, inteiro = true) {
  const numero = Math.random() * (max - min + 1) + min;
  return inteiro ? Math.floor(numero) : parseFloat(numero.toFixed(2));
}

function gerarConta() {
  let numero;
  const tamanhoAtual = numerosGerados.size;
  while (numerosGerados.size != tamanhoAtual + 1) {
    numero = numeroAleatorio(100, 1);
    numerosGerados.add(numero);
  }

  return {
    numero: numero,
    saldo: numeroAleatorio(100000, 0, false),
    limiteTransf: numeroAleatorio(50000, 1000, false),
    banco: ["Original", "Bradesco", "BB"][numeroAleatorio(2)],
    transfRecebidas: 0,
    transfEfetuadas: 0,
    transfNegadas: 0,
    historico: [],
  };
}

function gerarTransf() {
  const origem = contas[numeroAleatorio(contas.length - 1)];
  let destino = origem;
  while (destino == origem)
    destino = contas[numeroAleatorio(contas.length - 1)];

  const valor = numeroAleatorio(50000, 1000, false);

  const dataTransf = dataAleatoria(2022);
  const horas = dataTransf.getHours();

  let limiteTransf = origem.limiteTransf;
  const meio = ["TED", "DOC", "PIX"][numeroAleatorio(2)];

  const transf = {
    meio: meio,
    tipo: origem.banco == destino.banco ? "Intrabancária" : "Interbancária",
    valor: valor,
    origem: origem.numero,
    destino: destino.numero,
    dataTransf: dataTransf.toLocaleString(),
  };

  if (horas >= 20 || horas <= 6) limiteTransf = 1000;

  if (meio == "DOC") {
    const adicionar = horas <= 21 ? 1 : 2;
    dataTransf.setDate(dataTransf.getDate() + adicionar);
  } else if (meio == "TED") {
    const adicionar = horas >= 6 && horas <= 17 ? 0 : 1;
    dataTransf.setDate(dataTransf.getDate() + adicionar);
  }

  transf.dataProcessamento = dataTransf.toLocaleString();

  if (valor <= origem.saldo && valor <= limiteTransf) {
    transf.descricao = "Transação efetuada com sucesso";

    origem.transfEfetuadas += 1;
    destino.transfRecebidas += 1;

    destino.historico.push(transf);

    origem.saldo -= valor;
    destino.saldo += valor;
  } else {
    transf.descricao =
      valor > origem.saldo
        ? "Transação negada! Saldo insuficiente"
        : "Transação negada! Limite de transferência excedido";
    origem.transfNegadas += 1;
  }

  origem.historico.push(transf);
}

function dataAleatoria(ano) {
  return new Date(
    ano,
    numeroAleatorio(11),
    numeroAleatorio(31, 1),
    numeroAleatorio(23),
    numeroAleatorio(59)
  );
}