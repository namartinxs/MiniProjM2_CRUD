let atendimentos = [];
const modal = document.querySelector('.modal-container');
const userTable = document.getElementById('userTable');
//é importante manter o id com o valor do local storage sem usar um número chapado para que ao recarregar a pagina o numero nao reinicie 
let contadorId = localStorage.getItem('contadorId') ? parseInt(localStorage.getItem('contadorId')) : 1;


// abre o modal
function openModal(procedimento, descricao, isEdit = false) {
    modal.style.display = 'flex';

    if (isEdit) {
        document.getElementById('modalTitle').textContent = 'Editar Agendamento';
    } else {
        document.getElementById('modalTitle').textContent = 'Novo Agendamento';
    }

    document.getElementById('procedimento').value = procedimento;
    document.getElementById('descricao').value = descricao;
}


function limpaCamposModal() {
    document.getElementById('userId').value = '';
    document.getElementById('nome-tutor').value = '';
    document.getElementById('nome-paciente').value = '';
    document.getElementById('horario').value = '';
    document.getElementById('procedimento').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('telefone').value = '';
}

//fecha o modal
function closeModal() {
    modal.style.display = 'none';
    limpaCamposModal();
}

const limpaTable = ()=>{
    userTable.innerHTML = '';
}

//read
function loadAtendimentos() {
    const userTable = document.getElementById('userTable');
    if (userTable) {
        limpaTable()
        const bdAtendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
        atendimentos = bdAtendimentos;

        atendimentos.forEach(atendimento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${atendimento.tutor}</td>
                <td>${atendimento.paciente}</td>
                <td>${atendimento.horario}</td>
                <td>${atendimento.procedimento}</td>
                <td>${atendimento.descricao}</td>
                <td>${atendimento.telefone}</td>
                <td>
                    <button onclick="editAtendimento(${atendimento.id})">Editar</button>
                    <button onclick="deleteAtendimento(${atendimento.id})">Excluir</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    } else {
        console.log("tabela nao encontrada");
    }
}


// save
function salvar() {
    const id = document.getElementById('userId').value;
    const tutor = document.getElementById('nome-tutor').value;
    const paciente = document.getElementById('nome-paciente').value;
    const horario = document.getElementById('horario').value;
    const procedimento = document.getElementById('procedimento').value;
    const descricao = document.getElementById('descricao').value;
    const telefone = document.getElementById('telefone').value;

    if (id) {
        updateAtendimento(parseInt(id), tutor, paciente, horario, procedimento, descricao, telefone);
    } else {
        createAtendimento(tutor, paciente, horario, procedimento, descricao, telefone);
    }

    closeModal();
    loadAtendimentos();
}


function createAtendimento(tutor, paciente, horario, procedimento, descricao, telefone) {
    const novoAtendimento = {
        id: contadorId++, 
        tutor,
        paciente,
        horario,
        procedimento,
        descricao,
        telefone
    };

    
    const atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    atendimentos.push(novoAtendimento);

    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    localStorage.setItem('contadorId', contadorId); 
    loadAtendimentos(); 
}

function deleteAtendimento(id) {

    atendimentos = atendimentos.filter(atd => atd.id !== id);
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos)); 
    loadAtendimentos(); 
}


function updateAtendimento(id, tutor, paciente, horario, procedimento, descricao, telefone) {
    
    const atendimento = atendimentos.find(atd => atd.id === id);
    if (atendimento) {
        atendimento.tutor = tutor;
        atendimento.paciente = paciente;
        atendimento.horario = horario;
        atendimento.procedimento = procedimento;
        atendimento.descricao = descricao;
        atendimento.telefone = telefone;

        
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    }
}

// edit
function editAtendimento(id) {
    const atendimento = atendimentos.find(atd => atd.id === id);
    
    if (atendimento) {

        document.getElementById('userId').value = atendimento.id
        document.getElementById('nome-tutor').value = atendimento.tutor;
        document.getElementById('nome-paciente').value = atendimento.paciente;
        document.getElementById('horario').value = atendimento.horario;
        document.getElementById('procedimento').value = atendimento.procedimento;
        document.getElementById('descricao').value = atendimento.descricao;
        document.getElementById('telefone').value = atendimento.telefone;
        openModal(atendimento.procedimento, atendimento.descricao, true);
    }

   
}



document.addEventListener("DOMContentLoaded", function() {
    loadAtendimentos(); 

});
