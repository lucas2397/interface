'use strict'
// abrir e fechar modal
const openModal = () => document.getElementById('modal').classList.add('active')
const closeModal = () => {
  document.getElementById('modal').classList.remove('active')
  clearFields()
}
//variavel global

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_tarefasacademicas')) ?? []

const setLocalStorage = db_tarefasacademicas =>
  localStorage.setItem(
    'db_tarefasacademicas',
    JSON.stringify(db_tarefasacademicas)
  )

// madando para o bancolocal CRUD - CREATE
const createTarefa = tarefa => {
  const db_tarefasacademicas = getLocalStorage()
  db_tarefasacademicas.push(tarefa)
  setLocalStorage(db_tarefasacademicas)
}

// CRUD - DELET
const deleteTarefa = index => {
  const db_tarefasacademicas = readTarefa()
  db_tarefasacademicas.splice(index, 1)
  setLocalStorage(db_tarefasacademicas)
}
//CRUD - READ
const readTarefa = () => getLocalStorage()

//CRUD - UPDATE
const updateTarefa = (index, tarefa) => {
  const db_tarefasacademicas = readTarefa()
  db_tarefasacademicas[index] = tarefa
  setLocalStorage(db_tarefasacademicas)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}
//interaçao com layout

//apagar o modal
const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
}
// pegar os dados do formulario e validar
const saveTarefa = () => {
  if (isValidFields()) {
    const tarefa = {
      id: document.getElementById('id').value,
      matricula: document.getElementById('matricula').value,
      nome: document.getElementById('nome').value,
      sobrenome: document.getElementById('sobrenome').value,
      turma: document.getElementById('turma').value
    }
    const index = document.getElementById('id').dataset.index
    if (index == 'new') {
      createTarefa(tarefa)
      updateTable()
      clearFields()
      closeModal()
    } else {
      updateTarefa(index, tarefa)
      updateTable()
      closeModal()
    }
  }
}
// ler e criar uma linha com cada um dos clientes
const createRow = (tarefa, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
  <td>${tarefa.id}</td>
  <td>${tarefa.matricula}</td>
  <td>${tarefa.nome}</td>
  <td>${tarefa.sobrenome}</td>
  <td>${tarefa.turma}</td>
  <td>
      <button type = "button" class="button green-edit" id="edit-${index}" ><span class="material-icons">
      edit</span>Editar</button>
      <button type = "button" class="button red" id="delete-${index}" ><span class="material-icons">
      delete </span>Excluir</button>

  </td>
  `
  // vai printar na tela os dados
  document.querySelector('#tableTarefa>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableTarefa>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

// vai ler o que tem no localStorage e vai interargir com cada linha
const updateTable = () => {
  const db_tarefasacademicas = readTarefa()
  clearTable()
  db_tarefasacademicas.forEach(createRow)
}
const fillField = tarefa => {
  document.getElementById('id').value = tarefa.id
  document.getElementById('matricula').value = tarefa.matricula
  document.getElementById('nome').value = tarefa.nome
  document.getElementById('sobrenome').value = tarefa.sobrenome
  document.getElementById('turma').value = tarefa.turma
  document.getElementById('id').dataset.index = tarefa.index
}

const editTarefa = index => {
  const tarefa = readTarefa()[index]
  tarefa.index = index
  fillField(tarefa)
  openModal()
}

//editar dados
const editDelet = event => {
  if (event.target.type === 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editTarefa(index)
    } else {
      const tarefa = readTarefa()[index]
      const response = confirm(
        `Deseja realmente excluir o aluno ${tarefa.nome}`
      )
      if (response) {
        deleteTarefa(index)
        updateTable()
      }
    }
  }
}
updateTable()

// eventos dos botoes
document.getElementById('criaTarefa').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveTarefa)
document.getElementById('cancelar').addEventListener('click', closeModal)
document
  .querySelector('#tableTarefa>tbody')
  .addEventListener('click', editDelet)
