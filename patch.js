const fs = require('fs');
const files = ['index.html', 'trabalho do trimestre 9°ano.html'];

const dictionaryHTML = \
    <section id="dictionary" class="section-card">
      <h2 class="section-title">📖 Dicionário e Tradutor</h2>
      <p style="margin-bottom: 16px;">
        Digite uma palavra ou frase em português para descobrir a tradução em inglês e ouvir a pronúncia.
      </p>
      
      <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
        <input type="text" id="wordInput" placeholder="Ex: corajoso" style="flex: 1; min-width: 200px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 1rem;">
        <button onclick="searchDictionary()" style="background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem;">Traduzir</button>
      </div>

      <div id="dictResult" class="frames-box" style="display: none; flex-direction: column; gap: 8px; margin-bottom: 0;">
        <h4 id="resTerm" style="margin-bottom: 0;"></h4>
        <p id="resMeaning" style="font-size: 1.05rem;"></p>
        <div style="margin-top: 8px;">
          <button id="resAudioBtn" class="btn-audio" style="display: none;">🔊 Ouvir Pronúncia</button>
        </div>
      </div>
    </section>
\;

const dictionaryJS = \
    // Dicionário local robusto cobrindo variações (com e sem acento)
    const customDictionary = {
      "corajoso": { ingles: "brave", exemplo: "Exemplo: Ele foi muito corajoso ao apresentar o trabalho." },
      "corajosa": { ingles: "brave", exemplo: "Exemplo: Ela foi muito corajosa ao apresentar o trabalho." },
      "criativo": { ingles: "creative", exemplo: "Exemplo: O cartaz da dupla ficou muito criativo." },
      "criativa": { ingles: "creative", exemplo: "Exemplo: O cartaz da dupla ficou muito criativo." },
      "determinado": { ingles: "determined", exemplo: "Exemplo: Ela estava determinada a aprender." },
      "determinada": { ingles: "determined", exemplo: "Exemplo: Ela estava determinada a aprender." },
      "inspirador": { ingles: "inspiring", exemplo: "Exemplo: A história dessa cientista é inspiradora." },
      "inspiradora": { ingles: "inspiring", exemplo: "Exemplo: A história dessa cientista é inspiradora." },
      "historia": { ingles: "history", exemplo: "Exemplo: Estamos estudando fatos importantes da história." },
      "história": { ingles: "history", exemplo: "Exemplo: Estamos estudando fatos importantes da história." },
      "lider": { ingles: "leader", exemplo: "Exemplo: O líder do grupo ajudou na pesquisa." },
      "líder": { ingles: "leader", exemplo: "Exemplo: O líder do grupo ajudou na pesquisa." },
      "inteligente": { ingles: "smart", exemplo: "Exemplo: Essa foi uma ideia muito inteligente." },
      "ajudante": { ingles: "helper", exemplo: "Exemplo: Todos foram muito prestativos." },
      "gentil": { ingles: "kind", exemplo: "Exemplo: Ela sempre usa palavras gentis." }
    };

    // Nova Função usando a API direta do Google Tradutor
    async function searchDictionary() {
      const input = document.getElementById('wordInput').value.trim().toLowerCase();
      const resultBox = document.getElementById('dictResult');
      const termEl = document.getElementById('resTerm');
      const meaningEl = document.getElementById('resMeaning');
      const audioBtn = document.getElementById('resAudioBtn');

      if (!input) {
        alert('Por favor, digite uma palavra em português para pesquisar.');
        return;
      }

      resultBox.style.display = 'flex';
      
      // Checa primeiro no dicionário local
      if (customDictionary[input]) {
        const item = customDictionary[input];
        termEl.innerText = "Resultado para: " + input.charAt(0).toUpperCase() + input.slice(1);
        meaningEl.innerHTML = \\\<strong>Tradução em Inglês:</strong> <span style="color: var(--primary); font-weight: 700;">\</span><br><small style="color: #64748b;">\</small>\\\;
        audioBtn.style.display = 'inline-flex';
        audioBtn.onclick = function() {
          playSpeech(item.ingles); 
        };
        return;
      }

      // Mostra uma mensagem de "carregando"
      termEl.innerText = "Buscando: " + input.charAt(0).toUpperCase() + input.slice(1) + "...";
      meaningEl.innerHTML = "Aguarde, traduzindo...";
      audioBtn.style.display = 'none';

      try {
        // Chamada para a API do Google Translate (Tradução direta e literal)
        const resposta = await fetch(\\\https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q=\\\\);
        const dados = await resposta.json();

        // O Google retorna os dados em formato de listas, pegamos o texto traduzido
        if (dados && dados[0] && dados[0][0] && dados[0][0][0]) {
          // Se for uma frase, junta todos os pedaços certinho
          const termoIngles = dados[0].map(item => item[0]).join('');
          
          termEl.innerText = "Resultado para: " + input.charAt(0).toUpperCase() + input.slice(1);
          meaningEl.innerHTML = \\\<strong>Tradução em Inglês:</strong> <span style="color: var(--primary); font-weight: 700;">\</span>\\\;
          
          // Libera o botão de áudio
          audioBtn.style.display = 'inline-flex';
          audioBtn.onclick = function() {
            playSpeech(termoIngles); 
          };
        } else {
          termEl.innerText = "Ops!";
          meaningEl.innerHTML = \\\<strong>Não conseguimos traduzir.</strong>\\\;
        }
      } catch (erro) {
        termEl.innerText = "Erro!";
        meaningEl.innerHTML = \\\<strong>Erro de conexão com o tradutor.</strong>\\\;
      }
    }
\;

for (let file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('id="dictionary"')) {
        content = content.replace('    </section>\\r\\n\\r\\n    <section id="projeto" class="section-card">', '    </section>\\n' + dictionaryHTML + '\\n    <section id="projeto" class="section-card">');
        content = content.replace('    </section>\\n\\n    <section id="projeto" class="section-card">', '    </section>\\n' + dictionaryHTML + '\\n    <section id="projeto" class="section-card">');
    }
    
    if (!content.includes('#dictionary')) {
        content = content.replace('<a href="#projeto"', '<a href="#dictionary" class="nav-item">📖 Dicionário</a>\\n      <a href="#projeto"');
    }

    if (!content.includes('searchDictionary()')) {
        content = content.replace('    let selectedVoice = null;', dictionaryJS + '\\n\\n    let selectedVoice = null;');
    }
    
    fs.writeFileSync(file, content);
}
console.log("Feito!");
