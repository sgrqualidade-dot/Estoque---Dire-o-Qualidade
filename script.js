let dados = [];

// Carrega os dados gerados do JSON
fetch('dados.json')
  .then(response => response.json())
  .then(json => { dados = json; })
  .catch(err => console.error("Erro ao carregar dados.json:", err));

function pesquisar() {
    const peso = document.getElementById('peso').value.trim();
    const resultado = document.getElementById('resultado');
    
    if (!peso) {
        resultado.innerHTML = '<div class="card error">Por favor, insira um peso para buscar.</div>';
        return;
    }
    
    // Filtra comparando o peso como string limpa
    const encontrados = dados.filter(item => String(item.Peso || '').trim() === peso);
    
    if (encontrados.length === 0) {
        resultado.innerHTML = '<div class="card error"><b>Volume não encontrado para o peso informado.</b></div>';
        return;
    }
    
    // Monta a exibição dos cards com os novos campos
    resultado.innerHTML = encontrados.map(item => `
        <div class="card">
            <div class="card-row"><b>Fornecedor:</b> <span>${item.Fornecedor || '-'}</span></div>
            <div class="card-row"><b>Oferta:</b> <span>${item.Oferta || '-'}</span></div>
            <div class="card-row"><b>Identificação:</b> <span>${item.Identificação || '-'}</span></div>
            <div class="card-row"><b>Status:</b> <span>${item.Status || '-'}</span></div>
            <div class="card-row"><b>Organização:</b> <span>${item.ORGANIZAÇÃO || '-'}</span></div>
            <div class="card-highlight">
                <div class="metric"><strong>Teor Cu:</strong> ${item.Teor_Cu}</div>
                <div class="metric"><strong>Teor Zn:</strong> ${item.Teor_Zn}</div>
            </div>
        </div>
    `).join('');
}