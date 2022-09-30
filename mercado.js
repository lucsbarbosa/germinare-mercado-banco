function randomization(max, min){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(year){
  return new Date(`${year}-${randomization(9, 1)}-${randomization(31, 1)}`);
}

function perdasTable(quantidade, valor){
  this.quantidade = quantidade;
  this.valor = valor;
}

const currentDate = new Date();
const tipo = randomization(5, 1);
const estoque = [];
let perdasValor = 0;

console.log('Estoque:')
for (let i = 0; i < tipo; i++) {
  const precoUnitario = Number((Math.random() * 101).toFixed(2));
  const qtdRandom = randomization(10, 1);
  for (let x = 0; x < qtdRandom; x++) {
    const fabricacao = randomDate(currentDate.getFullYear());
    let validade = new Date(fabricacao);
    const validadeDias = randomization(365, 1);
    validade.setDate(fabricacao.getDate() + validadeDias);
    
    let qualidade = '';
    if(validade > currentDate){
      qualidade = 'consumível';
    } else {
      qualidade = 'vencido';
    }

    const quantidadeLote = randomization(300, 0);

    if (qualidade == 'consumível'){
      perdasValor += 0
    } else if (qualidade == 'vencido'){
      perdasValor += precoUnitario * quantidadeLote
    }

    estoque.push({
      tipo: i + 1,
      hoje: currentDate.toLocaleDateString(),
      fabricacao: fabricacao.toLocaleDateString(),
      validade: validade.toLocaleDateString(),
      validadeDias: validadeDias,
      qualidade: qualidade,
      precoUnitario: precoUnitario,
      quantidadeLote: quantidadeLote,
    });
  }
}

console.table(estoque);

let perdas = new perdasTable(estoque.length, perdasValor.toFixed(2))
console.log('\nPerdas:')
console.table(perdas)