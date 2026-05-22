// Variáveis globais usadas pela parte da IA.
// Elas guardam a cultura selecionada e os dados carregados do JSON.
// Assim, quando o usuário consultar a IA, o sistema saberá sobre qual cultura responder.
let culturaAtual = null;
let dadosCulturaAtual = null;

async function carregarCultura(cultura) {
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = "<p>Carregando informações...</p>";

  try {
    const resposta = await fetch(`dados/${cultura}.json`);

    if (!resposta.ok) {
      throw new Error("Arquivo JSON não encontrado.");
    }

    const dados = await resposta.json();

    // Parte importante para a IA:
    // Guardamos a cultura selecionada e o conteúdo do JSON.
    // Esses dados serão enviados junto com a pergunta do usuário
    // para o arquivo PHP agrinho_openai.php.
    culturaAtual = cultura;
    dadosCulturaAtual = dados;

    mostrarInformacoes(dados);

  } catch (erro) {
    resultado.innerHTML = `
      <p class="erro">
        Erro ao carregar as informações da cultura.
      </p>
      <p>
        Verifique se o arquivo JSON existe dentro da pasta dados.
      </p>
    `;

    console.error(erro);
  }
}

function mostrarInformacoes(dados) {
  const resultado = document.getElementById("resultado");

  resultado.innerHTML = `
    <h2>${dados.cultura}</h2>

    <p><strong>Descrição:</strong> ${dados.descricao}</p>

    <h3>Clima ideal</h3>
    <p>${dados.climaIdeal}</p>

    <h3>Tipo de solo recomendado</h3>
    <p>${dados.soloRecomendado}</p>

    <h3>Época de plantio</h3>
    <p>${dados.epocaPlantio}</p>

    <h3>Dicas de manejo</h3>
    <ul>
      ${dados.dicasManejo.map(dica => `<li>${dica}</li>`).join("")}
    </ul>

    <h3>Principais cuidados</h3>
    <ul>
      ${dados.cuidados.map(cuidado => `<li>${cuidado}</li>`).join("")}
    </ul>

    <h3>Sugestões gerais</h3>
    <ul>
      ${dados.sugestoes.map(sugestao => `<li>${sugestao}</li>`).join("")}
    </ul>
  `;
}

// Função responsável por consultar a IA.
// Ela envia para o PHP:
// 1. a chave temporária digitada pelo usuário;
// 2. a cultura selecionada;
// 3. os dados do arquivo JSON;
// 4. a pergunta digitada.
async function consultarIa() {
  const chaveIa = document.getElementById("chaveIa").value.trim();
  const culturaIa = document.getElementById("culturaIa").value.trim();
  const perguntaIa = document.getElementById("perguntaIa").value.trim();
  const respostaIa = document.getElementById("respostaIa");

  respostaIa.classList.remove("erro");

  if (!chaveIa) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Digite uma chave temporária de IA.";
    return;
  }

  if (!culturaIa) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Digite o nome da cultura agrícola que deseja consultar.";
    return;
  }

  if (!perguntaIa) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Digite uma pergunta relacionada à agricultura.";
    return;
  }

  respostaIa.textContent = "Consultando a IA...";

  try {
    const resposta = await fetch("https://ceducap.com.br/ia/agrinho_openai.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chaveIa: chaveIa,
        cultura: culturaIa,
        pergunta: perguntaIa
      })
    });

    const tipoConteudo = resposta.headers.get("content-type");

    if (!tipoConteudo || !tipoConteudo.includes("application/json")) {
      throw new Error("O servidor PHP não retornou JSON válido.");
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || "Erro ao consultar a IA.");
    }

    respostaIa.textContent = resultado.resposta;

    document.getElementById("chaveIa").value = "";

  } catch (erro) {
    respostaIa.classList.add("erro");
    respostaIa.textContent = "Erro: " + erro.message;
    console.error(erro);
  }
}
