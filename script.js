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

<script>
    // Banco de dados interno simulando o arquivo JSON que armazena as informações básicas
    const bancoCulturas = {
        feijao: {
            nome: "Cultura do Feijão",
            imagem: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?q=80&w=1000&auto=format&fit=crop",
            dicas: [
                "<strong>Época de Plantio:</strong> O feijão prefere climas amenos. Evite plantar em épocas de muito frio ou geadas bruscas.",
                "<strong>Preparação do Chão:</strong> O solo deve estar fofo e com ótima drenagem. Ele não pode acumular água parada para não apodrecer as raízes.",
                "<strong>Espaçamento:</strong> Procure deixar um palmo e meio (40 a 50cm) entre as linhas de plantio.",
                "<strong>Momento da Colheita:</strong> Quando as vagens estiverem bem secas e mudarem de cor (amareladas/marrons), é hora de colher."
            ]
        },
        milho: {
            nome: "Cultura do Milho",
            imagem: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=1000&auto=format&fit=crop",
            dicas: [
                "<strong>Luz do Sol:</strong> O milho adora sol direto! Escolha sempre o local mais ensolarado e aberto da sua propriedade.",
                "<strong>Adubação Natural:</strong> O uso de esterco de galinha ou gado bem curtido logo no plantio garante espigas cheias e bonitas.",
                "<strong>Profundidade:</strong> Não enterre demais a semente na cova; uma profundidade entre 3 e 5 centímetros é o ideal.",
                "<strong>Irrigação:</strong> Mantenha a terra sempre úmida, prestando atenção redobrada no momento em que a planta soltar o pendão."
            ]
        },
        soja: {
            nome: "Cultura da Soja",
            imagem: "https://images.unsplash.com/photo-1594756114251-396556e8738b?q=80&w=1000&auto=format&fit=crop",
            dicas: [
                "<strong>Clima Ideal:</strong> A soja se desenvolve melhor em regiões quentes e com chuvas constantes durante o crescimento.",
                "<strong>Cuidado com o Mato:</strong> Mantenha a lavoura sempre limpa, principalmente nos primeiros 45 dias, para o mato não roubar os nutrientes.",
                "<strong>Sementes:</strong> Dê preferência a sementes tratadas com inoculantes adequados, garantindo plantas fortes desde o início.",
                "<strong>Pragas:</strong> Faça vistorias semanais nas folhas para monitorar o aparecimento de lagartas ou percevejos."
            ]
        }
    };

    // Função para carregar dinamicamente as informações do banco de dados local
    function carregarCultura(culturaKey) {
        const resultadoDiv = document.getElementById('resultado');
        const dados = bancoCulturas[culturaKey];

        if (dados) {
            let htmlConteudo = `
                <h3>${dados.nome}</h3>
                <div class="cultura-imagem">
                    <img src="${dados.imagem}" alt="${dados.nome}">
                </div>
                <p><strong>Recomendações técnicas e orientações práticas de manejo:</strong></p>
                <ul>
            `;

            dados.dicas.forEach(dica => {
                htmlConteudo += `<li>${dica}</li>`;
            });

            htmlConteudo += `
                </ul>
                <p style="margin-top: 15px; font-size: 0.9em; color: #555;">
                    *Nota: Estas orientações são adaptadas para pequenas propriedades familiares.
                </p>
            `;

            resultadoDiv.innerHTML = htmlConteudo;
        } else {
            resultadoDiv.innerHTML = `<div class="mensagem-erro">Erro ao carregar dados da cultura selecionada.</div>`;
        }
    }

    // Função auxiliar para atrasar a execução (usada no backoff exponencial de rede)
    function aguardar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Função para chamar a API da IA com lógica de repetição em caso de falha de conexão (Exponential Backoff)
    async function requisitarGeminiComRetentativas(url, payload, retentativas = 5, atraso = 1000) {
        for (let i = 0; i < retentativas; i++) {
            try {
                const resposta = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (resposta.ok) {
                    return await resposta.json();
                }

                // Se houver erro de servidor, tentamos novamente
                if (resposta.status >= 500 || resposta.status === 429) {
                    throw new Error(`Servidor instável (Código: ${resposta.status})`);
                } else {
                    const erroInfo = await resposta.json();
                    throw new Error(erroInfo.error?.message || `Erro na chamada (Status ${resposta.status})`);
                }
            } catch (erro) {
                if (i === retentativas - 1) {
                    throw erro; // Se esgotou as chances, propaga o erro
                }
                await aguardar(atraso);
                atraso *= 2; // Dobra o tempo de espera para a próxima tentativa
            }
        }
    }

    // Função de tratamento do formulário da IA
    async function consultarIa() {
        const chaveIaInput = document.getElementById('chaveIa');
        const apagarChaveCheck = document.getElementById('apagarChaveAposConsulta');
        const culturaIaInput = document.getElementById('culturaIa');
        const perguntaIaInput = document.getElementById('perguntaIa');
        const respostaIaDiv = document.getElementById('respostaIa');
        const btnConsultar = document.getElementById('btnConsultarIa');

        const chave = chaveIaInput.value.trim();
        const cultura = culturaIaInput.value.trim();
        const pergunta = perguntaIaInput.value.trim();

        // Limpa respostas anteriores
        respostaIaDiv.style.display = 'none';
        respostaIaDiv.innerHTML = '';

        // Validação de segurança básica local (para evitar consumo indevido)
        if (!chave) {
            exibirErroIa("Por favor, informe uma chave temporária de IA (API Key) para realizar a consulta.");
            return;
        }

        if (!cultura) {
            exibirErroIa("Digite qual é a cultura agrícola que você deseja analisar.");
            return;
        }

        if (!pergunta) {
            exibirErroIa("Escreva a sua pergunta antes de clicar em consultar.");
            return;
        }

        // Altera o estado do botão para indicar processamento
        btnConsultar.disabled = true;
        btnConsultar.innerHTML = `<span class="carregando"></span>Buscando respostas no campo...`;

        // Instruções do sistema para a Inteligência Artificial garantir que ela aja apenas como agrônoma focada
        const promptSistema = `Você é o "Agrônomo Virtual", um assistente especialista focado em agricultura, manejo de terras e cultivo.
Sua missão é dar dicas simples, práticas, diretas e cientificamente corretas para pequenos produtores rurais.
Use linguagem acessível e acolhedora do interior do Brasil.
ATENÇÃO: Responda APENAS perguntas relacionadas à agricultura, solos, controle de pragas, cultivo e plantas. 
Se o usuário perguntar sobre qualquer tema fora de agricultura (como matemática, receitas de bolo, programação ou notícias gerais), recuse educadamente explicando que você foi treinado para ajudar apenas nas tarefas do campo.`;

        // Construção do prompt do usuário estruturado
        const promptUsuario = `Cultura analisada: ${cultura}\nPergunta do agricultor: ${pergunta}`;

        // URL da API usando o modelo correto da especificação técnica
        const urlApi = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${chave}`;

        const payload = {
            contents: [{
                parts: [{ text: promptUsuario }]
            }],
            systemInstruction: {
                parts: [{ text: promptSistema }]
            }
        };

        try {
            const dadosResposta = await requisitarGeminiComRetentativas(urlApi, payload);
            
            // Extrai a resposta gerada de dentro da árvore de retorno do Gemini
            const textoResposta = dadosResposta.candidates?.[0]?.content?.parts?.[0]?.text;

            if (textoResposta) {
                respostaIaDiv.style.display = 'block';
                respostaIaDiv.innerHTML = `<strong>Dicas do Assistente Agrícola:</strong>\n\n${formatarTextoIa(textoResposta)}`;
                
                // Apaga a chave se o usuário marcou o check de privacidade
                if (apagarChaveCheck.checked) {
                    chaveIaInput.value = '';
                }
            } else {
                throw new Error("A resposta veio em um formato desconhecido.");
            }

        } catch (erro) {
            exibirErroIa(`Erro ao consultar o assistente de IA: ${erro.message}. Verifique sua chave de acesso ou tente novamente em instantes.`);
        } finally {
            // Restaura o botão ao estado normal
            btnConsultar.disabled = false;
            btnConsultar.innerHTML = "Consultar Inteligência Artificial";
        }
    }

    // Auxiliar para formatar textos simples (quebras de linha, negritos básicos vindos em Markdown)
    function formatarTextoIa(texto) {
        // Substitui asteriscos duplos (que representam negrito no markdown) por tags HTML strong
        let textoFormatado = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Limpa asteriscos simples usados para marcadores de lista
        textoFormatado = textoFormatado.replace(/^\s*\*\s*(.*)/gm, '• $1');
        return textoFormatado;
    }

    // Função de exibição de erros amigável integrada no painel da IA
    function exibirErroIa(mensagem) {
        const respostaIaDiv = document.getElementById('respostaIa');
        respostaIaDiv.style.display = 'block';
        respostaIaDiv.innerHTML = `<div class="mensagem-erro">${mensagem}</div>`;
    }
</script>
