const URL_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmDsmrzPZh2-6ePXYriyVqrNZ5c-w9qVATeK7i6CXZH7v9Q49Ned21EkGUfzxjyeKDj85v8o3Rhx_Q/pub?gid=0&single=true&output=csv";

let dados = [];

function processarCSV(texto) {
    if (!texto) return [];
    const linhas = texto.split(/\r?\n/);
    if (linhas.length === 0) return [];

    function separarColunas(linha) {
        const resultado = [];
        let dentroDeAspas = false;
        let colunaAtual = "";
        for (let i = 0; i < line.length; i++) {
            let caractere = linha[i];
            if (caractere === '"') {
                dentroDeAspas = !dentroDeAspas;
            } else if (caractere === ',' && !dentroDeAspas) {
                resultado.push(colunaAtual.trim());
                colunaAtual = "";
            } else {
                colunaAtual += caractere;
            }
        }
        resultado.push(colunaAtual.trim());
        return resultado;
    }

    const cabecalho = separarColunas(linhas[0]).map(c => c.trim());

    return linhas.slice(1).filter(l => l.trim() !== "").map(linha => {
        const valores = separarColunas(linha);
        let item = {};
        cabecalho.forEach((coluna, index) => {
            item[coluna] = valores[index] !== undefined ? valores[index] : "";
        });
        return item;
    });
}

fetch(URL_PLANILHA)
  .then(response => response.text())
  .then(textoCSV => {
      dados = processarCSV(textoCSV);
  })
  .catch(err => console.error("Erro ao carregar dados do Google Sheets:", err));

function pesquisar() {
    const peso = document.getElementById('peso').value.trim();
    const resultado = document.getElementById('resultado');
    
    if (!peso) {
        resultado.innerHTML = '<div class="card error">Por favor, insira um peso para buscar.</div>';
        return;
    }
    
    const encontrados = dados.filter(item => {
        const valorPeso = String(item['Peso'] || item['PESO'] || '').trim();
        return valorPeso === peso;
    });
    
    if (encontrados.length === 0) {
        resultado.innerHTML = '<div class="card error"><b>Volume não encontrado para o peso informado.</b></div>';
        return;
    }
    
    resultado.innerHTML = encontrados.map(item => {
        const fornecedor = item['Fornecedor'] || item['Fornecedor '] || '-';
        const organizacao = item['ORGANIZAÇÃO'] || item['Organização'] || '-';
        
        let teorCu = item['Teor Cu'] || '0.00%';
        let teorZn = item['Teor Zn'] || '0.00%';
        if (!isNaN(teorCu) && teorCu !== '') teorCu = parseFloat(teorCu).toFixed(2) + '%';
        if (!isNaN(teorZn) && teorZn !== '') teorZn = parseFloat(teorZn).toFixed(2) + '%';

        return `
            <div class="card">
                <div class="card-row"><b>Fornecedor:</b> <span>\${fornecedor}</span></div>
                <div class="card-row"><b>Oferta:</b> <span>\${item['Oferta'] || '-'}</span></div>
                <div class="card-row"><b>Identificação:</b> <span>\${item['Identificação'] || '-'}</span></div>
                <div class="card-row"><b>Status:</b> <span>\${item['Status'] || '-'}</span></div>
                <div class="card-row"><b>Organização:</b> <span>\${organizacao}</span></div>
                <div class="card-highlight">
                    <div class="metric"><strong>Teor Cu:</strong> \${teorCu}</div>
                    <div class="metric"><strong>Teor Zn:</strong> \${teorZn}</div>
                </div>
            </div>
        `;
    }).join('');
}