class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.id = parseInt(localStorage.getItem("id")) + 1;
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null)
        return false;
    }
    return true;
  }
}

class BD {
  constructor() {
    let id = localStorage.getItem("id"); // Recuperando a chave id no local storage
    if (id == null) {
      localStorage.setItem("id", 0); // Se não houver chave id, seta pra 0
    }
  }

  getProximoId() {
    return parseInt(localStorage.getItem("id")) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem("despesa" + id, JSON.stringify(d));
    localStorage.setItem("id", parseInt(id));
    document.getElementById("anoSelect").selectedIndex = 0;
    document.getElementById("anoSelect").className = "form-select";
    document.getElementById("mesSelect").selectedIndex = 0;
    document.getElementById("mesSelect").className = "form-select";
    document.getElementById("diaInput").value = "";
    document.getElementById("diaInput").className = "form-control";
    document.getElementById("tipoSelect").selectedIndex = 0;
    document.getElementById("tipoSelect").className = "form-select";
    document.getElementById("descricaoInput").value = "";
    document.getElementById("descricaoInput").className = "form-control";
    document.getElementById("valorInput").value = "";
    document.getElementById("valorInput").className = "form-control";
  }

  recuperarTodosRegistros() {
    let despesas = [];
    let id = localStorage.getItem("id");
    for (let i = 1; i <= id; i++) {
      let despesa = localStorage.getItem("despesa" + i);
      if (despesa) despesas.push(JSON.parse(despesa));
    }
    return despesas;
  }
}

let bd = new BD();

function verificarValido(campo) {
  let classes = campo.className;
  if (campo.value == undefined || campo.value == "" || campo.value == null) {
    // Inválido
    if (classes.includes("is-valid")) {
      classes = classes.replace("is-valid", "is-invalid");
    } else if (!classes.includes("is-invalid")) {
      classes += " is-invalid";
    }
  } else {
    // Válido
    if (classes.includes("is-invalid")) {
      classes = classes.replace("is-invalid", "is-valid");
    } else if (!classes.includes("is-valid")) {
      classes += " is-valid";
    }
  }
  campo.className = classes;
}

function cadastrarDespesa() {
  let ano = document.getElementById("anoSelect").value;
  let mes = document.getElementById("mesSelect").value;
  let dia = document.getElementById("diaInput").value;
  let tipo = document.getElementById("tipoSelect").value;
  let descricao = document.getElementById("descricaoInput").value;
  let valor = document.getElementById("valorInput").value;
  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  if (despesa.validarDados()) {
    bd.gravar(despesa);
    $("#resultadoGravacao").modal("show");
    $("#resultadoGravacao>div>div>div>h5").removeClass("text-danger");
    $("#resultadoGravacao>div>div>div>h5").text("Sucesso na gravação");
    $("#resultadoGravacao>div>div>div:nth-child(2)").text(
      "A despesa foi gravada com sucesso"
    );
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").html("Voltar");
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").removeClass(
      "btn-danger"
    );
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").addClass(
      "btn-success"
    );
    $("#resultadoGravacao>div>div>div>h5").addClass("text-success");
    carregaListaDespesas();
    console.log("gravou");
  } else {
    $("#resultadoGravacao").modal("show");
    $("#resultadoGravacao>div>div>div>h5").removeClass("text-success");
    $("#resultadoGravacao>div>div>div>h5").text("Erro na gravação");
    $("#resultadoGravacao>div>div>div:nth-child(2)").text(
      "Existe algum campo não preenchido"
    );
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").text(
      "Voltar e corrigir"
    );
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").removeClass(
      "btn-success"
    );
    $("#resultadoGravacao>div>div>div:nth-child(3)>button").addClass(
      "btn-danger"
    );
    $("#resultadoGravacao>div>div>div>h5").addClass("text-danger");
  }
}

function carregaListaDespesas() {
  let despesas = bd.recuperarTodosRegistros();
  exibirTabela(despesas);
}

function pesquisarDespesas() {
  let despesas = bd.recuperarTodosRegistros();
  let ano = document.getElementById("anoSelect").value;
  let mes = document.getElementById("mesSelect").value;
  let dia = document.getElementById("diaInput").value;
  let tipo = document.getElementById("tipoSelect").value;
  let descricao = document.getElementById("descricaoInput").value;
  let valor = document.getElementById("valorInput").value;
  despesas = despesas.filter((despesa) => {
    if (ano && despesa.ano != ano) return false;
    if (mes && despesa.mes != mes) return false;
    if (dia && despesa.dia != dia) return false;
    if (tipo && despesa.tipo != tipo) return false;
    if (descricao && !despesa.descricao.includes(descricao)) return false;
    if (valor && !despesa.valor.includes(valor)) return false;
    return true;
  });
  exibirTabela(despesas);
}

function exibirTabela(despesas) {
  let tabela = document.getElementById("tabelaConsulta");
  tabela.innerHTML = `<thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
        </table>`;
  for (let i in despesas) {
    let linha = tabela.insertRow();
    linha.insertCell(0).innerHTML = `${("0" + despesas[i].dia).slice(-2)}/${(
      "0" + despesas[i].mes
    ).slice(-2)}/${("000" + despesas[i].ano).slice(-4)}`;
    let tipo;
    switch (despesas[i].tipo) {
      case "1": {
        tipo = "Alimentação";
        break;
      }
      case "2": {
        tipo = "Educação";
        break;
      }
      case "3": {
        tipo = "Lazer";
        break;
      }
      case "4": {
        tipo = "Saúde";
        break;
      }
      case "5": {
        tipo = "Transporte";
        break;
      }
      default: {
        tipo = "";
        break;
      }
    }
    linha.insertCell(1).innerHTML = tipo;
    linha.insertCell(2).innerHTML = despesas[i].descricao;
    let valor = parseInt(despesas[i].valor)
      .toFixed(2)
      .toString()
      .replace(".", ",");
    linha.insertCell(3).innerHTML = `R$${valor}`;
    linha.insertCell(
      4
    ).innerHTML = `<button class="btn btn-primary"><i class="fas fa-edit"></i></button>
    <button class="btn btn-danger" onclick="deletarDespesa(${despesas[i].id})"><i class="fas fa-trash"></i></button>`;
  }
}

function deletarDespesa(i) {
  localStorage.removeItem("despesa" + i);
  let despesas = bd.recuperarTodosRegistros();
  console.log("Removendo despesa " + i + "", despesas);
  exibirTabela(despesas);
}
