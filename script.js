const URL_JSON = "dados.json";

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
      console.log("Banco de dados local atualizado! Total:", dados.length);
  })
  .catch(err => {
      console.error("Falha ao ler o arquivo dados.json:", err);
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
        
        const teorCu = item['Teor Cu'] !== undefined ? item['Teor Cu'] : '-';
        const teorZn = item['Teor Zn'] !== undefined ? item['Teor Zn'] : '-';

        const teorCuFormated = typeof teorCu === 'number' ? teorCu.toFixed(2) + '%' : teorCu;
        const teorZnFormated = typeof teorZn === 'number' ? teorZn.toFixed(2) + '%' : teorZn;

        // Regras condicionais de cores baseadas no Status
        const statusUpper = status.toUpperCase();
        let cardClasse = 'card';
        let statusStyle = '';

        if (statusUpper === 'ESTOQUE') {
            cardClasse = 'card status-estoque';
            statusStyle = 'color: #2f855a; font-weight: bold;';
        } else if (statusUpper === 'UTILIZADO' || statusUpper === 'EXPEDIDO') {
            cardClasse = 'card status-atencao';
            statusStyle = 'color: #c53030; font-weight: bold;';
        }

        return `
            <div class="${cardClasse}">
                <div class="card-row"><b>Fornecedor:</b> <span>${fornecedor}</span></div>
                <div class="card-row"><b>Oferta:</b> <span>${oferta}</span></div>
                <div class="card-row"><b>Identificação:</b> <span>${identificacao}</span></div>
                <div class="card-row"><b>Status:</b> <span style="${statusStyle}">${status}</span></div>
                <div class="card-row"><b>Organização:</b> <span>${organizacao}</span></div>
                
                <!-- Teores centralizados lado a lado no final do card -->
                <div class="teores-container">
                    <div class="teores-row">
                        <div class="teor-col">
                            <span class="teor-label">Teor Cu</span>
                            <span class="teor-valor">${teorCuFormated}</span>
                        </div>
                        <div class="teor-col">
                            <span class="teor-label">Teor Zn</span>
                            <span class="teor-valor">${teorZnFormated}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}