const URL_JSON = "dados_bags.json";

let dados = [];

fetch(URL_JSON)
  .then(response => {
      if (!response.ok) {
          throw new Error("Erro de rede ao carregar o arquivo JSON");
      }
      return response.json();
  })
  .then(data => {
      dados = data;
      console.log("Banco de dados sincronizado com sucesso! Total:", dados.length);
  })
  .catch(err => {
      console.error("Falha ao inicializar o banco de dados JSON:", err);
  });

function pesquisar() {
    const pesoInput = document.getElementById('peso').value.trim();
    const resultado = document.getElementById('resultado');
    
    if (!pesoInput) {
        resultado.innerHTML = '<div class="card error">Por favor, insira um peso para buscar.</div>';
        return;
    }
    
    const pesoProcuradoNum = parseFloat(pesoInput);

    const encontrados = dados.filter(item => {
        if (item['Peso'] === undefined || item['Peso'] === null || item['Peso'] === '') return false;
        const pesoPlanilhaNum = parseFloat(item['Peso']);
        return pesoPlanilhaNum === pesoProcuradoNum;
    });
    
    if (encontrados.length === 0) {
        resultado.innerHTML = '<div class="card error"><b>Volume não encontrado para o peso informado.</b></div>';
        return;
    }
    
    resultado.innerHTML = encontrados.map(item => {
        const fornecedor = item['Fornecedor '] || item['Fornecedor'] || '-';
        const oferta = item['Oferta'] || '-';
        const identificacao = item['Identificação'] || '-';
        const status = String(item['Status'] || '').trim();
        const organizacao = item['ORGANIZAÇÃO'] || item['Organização'] || '-';
        
        // Captura dos Teores solicitados
        const teorCu = item['Teor Cu'] !== undefined ? item['Teor Cu'] : '-';
        const teorZn = item['Teor Zn'] !== undefined ? item['Teor Zn'] : '-';

        // Formatação dos teores para exibirem casas decimais amigáveis se forem números
        const teorCuFormated = typeof teorCu === 'number' ? teorCu.toFixed(2) + '%' : teorCu;
        const teorZnFormated = typeof teorZn === 'number' ? teorZn.toFixed(2) + '%' : teorZn;

        // Classe CSS condicional para destacar ESTOQUE em verde
        const isEstoque = status.toUpperCase() === 'ESTOQUE';
        const cardClasse = isEstoque ? 'card status-estoque' : 'card';

        return `
            <div class="${cardClasse}">
                <div class="card-row"><b>Fornecedor:</b> <span>${fornecedor}</span></div>
                <div class="card-row"><b>Oferta:</b> <span>${oferta}</span></div>
                <div class="card-row"><b>Identificação:</b> <span>${identificacao}</span></div>
                <div class="card-row"><b>Teor Cu:</b> <span class="teor-highlight">${teorCuFormated}</span></div>
                <div class="card-row"><b>Teor Zn:</b> <span class="teor-highlight">${teorZnFormated}</span></div>
                <div class="card-row"><b>Status:</b> <span style="${isEstoque ? 'color: #2f855a; font-weight: bold;' : ''}">${status}</span></div>
                <div class="card-row"><b>Organização:</b> <span>${organizacao}</span></div>
            </div>
        `;
    }).join('');
}