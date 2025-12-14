import pymongo
from datetime import datetime
from bson.objectid import ObjectId
import pprint

# CONFIGURAÇÃO DA CONEXÃO
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["medsys"]

def menu():
    while True:
        print("\n=== MEDSYS - SISTEMA DE GESTÃO ===")
        print("1. Listar Médicos por Especialidade")
        print("2. Cadastrar Novo Paciente")
        print("3. Buscar Paciente por CPF")
        print("4. Agendar Consulta")
        print("0. Sair")
        opcao = input("Escolha uma opção: ")

        if opcao == '1':
            listar_medicos()
        elif opcao == '2':
            cadastrar_paciente()
        elif opcao == '3':
            buscar_paciente()
        elif opcao == '4':
            agendar_consulta()
        elif opcao == '0':
            print("Saindo do sistema...")
            break
        else:
            print("Opção inválida!")

def listar_medicos():
    especialidade = input("Digite a especialidade (ex: Cardiologia, Pediatria) ou ENTER para todos: ")
    query = {"ativo": True}
    if especialidade:
        query["especialidade"] = especialidade
    
    # Busca baseada na coleção medicos do seu arquivo admin.medicos.json
    medicos = db.medicos.find(query)
    
    print(f"\n--- Médicos Encontrados ---")
    for medico in medicos:
        print(f"Nome: {medico['nome']} | CRM: {medico['crm']} | Especialidade: {medico['especialidade']}")

def cadastrar_paciente():
    print("\n--- Novo Paciente ---")
    nome = input("Nome completo: ")
    cpf = input("CPF (apenas números): ")
    telefone = input("Telefone: ")
    data_nasc_str = input("Data de Nascimento (AAAA-MM-DD): ")
    
    # Estrutura baseada no seu script_estrutura_medsys.js
    novo_paciente = {
        "nome": nome,
        "cpf": cpf,
        "telefone": telefone,
        "dataNascimento": datetime.strptime(data_nasc_str, "%Y-%m-%d"),
        "ativo": True,
        "dataCadastro": datetime.now()
    }

    try:
        db.pacientes.insert_one(novo_paciente)
        print("✅ Paciente cadastrado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao cadastrar: {e}")

def buscar_paciente():
    cpf = input("Digite o CPF do paciente: ")
    paciente = db.pacientes.find_one({"cpf": cpf})
    if paciente:
        print(f"\nEncontrado: {paciente['nome']} | Tel: {paciente['telefone']}")
        return paciente
    else:
        print("Paciente não encontrado.")
        return None

def agendar_consulta():
    print("\n--- Agendar Consulta ---")
    # 1. Identificar o paciente
    paciente = buscar_paciente()
    if not paciente:
        return

    # 2. Escolher o médico
    crm = input("Digite o CRM do médico: ")
    medico = db.medicos.find_one({"crm": crm})
    if not medico:
        print("Médico não encontrado.")
        return

    # 3. Dados da consulta
    data_str = input("Data e Hora (AAAA-MM-DD HH:MM): ")
    motivo = input("Motivo da consulta: ")
    valor = float(input("Valor da consulta: "))

    nova_consulta = {
        "pacienteId": paciente["_id"],
        "medicoId": medico["_id"],
        "dataHora": datetime.strptime(data_str, "%Y-%m-%d %H:%M"),
        "motivo": motivo,
        "status": "agendada",
        "valorConsulta": valor,
        "dataCriacao": datetime.now(),
        "dataAtualizacao": datetime.now()
    }

    try:
        db.consultas.insert_one(nova_consulta)
        print("✅ Consulta agendada com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao agendar: {e}")

if __name__ == "__main__":
    menu()