[medsys_readme.md](https://github.com/user-attachments/files/24022877/medsys_readme.md)
# MedSys - Sistema de Gestão de Clínicas Médicas

Sistema completo para gestão de clínicas médicas, desenvolvido com MongoDB, permitindo o gerenciamento de consultas, pacientes, médicos, prontuários e pagamentos.

## 📋 Sobre o Projeto

O MedSys é um sistema de gestão clínica que facilita o controle administrativo e médico de consultórios e clínicas, oferecendo funcionalidades como:

- Cadastro e gestão de pacientes
- Gerenciamento de médicos e especialidades
- Agendamento e controle de consultas
- Registro de prontuários médicos
- Controle financeiro e pagamentos
- Sistema de usuários com diferentes níveis de acesso

## 🏗️ Estrutura do Banco de Dados

O sistema utiliza MongoDB com as seguintes coleções:

### 1. **usuarios**
Gerencia os usuários do sistema (administradores, médicos e recepcionistas)
- Nome, email, senha criptografada
- Função: administrador, médico ou recepcionista
- Status ativo/inativo

### 2. **pacientes**
Cadastro completo dos pacientes
- Dados pessoais (nome, CPF, telefone, email)
- Endereço completo
- Data de nascimento
- Observações médicas gerais

### 3. **medicos**
Informações dos profissionais médicos
- Dados pessoais e CRM
- Especialidade médica
- Horários de atendimento
- Vinculação com usuário do sistema

### 4. **especialidades**
Cadastro das especialidades médicas disponíveis
- Nome e descrição da especialidade
- Status ativo/inativo

### 5. **consultas**
Gerenciamento de agendamentos
- Vinculação paciente-médico
- Data/hora da consulta
- Motivo e observações
- Status: agendada, confirmada, realizada, cancelada, faltou
- Valor da consulta

### 6. **pagamentos**
Controle financeiro das consultas
- Vinculação com consulta
- Valor e forma de pagamento (dinheiro, cartão, PIX, boleto)
- Data do pagamento
- Número do recibo
- Status: pendente, pago, cancelado

### 7. **prontuarios**
Registro médico dos atendimentos
- Vinculação paciente-médico-consulta
- Anamnese (histórico e queixas)
- Diagnóstico médico
- Prescrição de medicamentos
- Exames solicitados
- Observações adicionais

## 🚀 Instalação e Configuração

### Pré-requisitos

- MongoDB instalado (versão 4.0 ou superior)
- MongoDB Compass (opcional, para visualização gráfica)

### Passos para instalação

1. **Instale o MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   
   # Windows
   # Baixe o instalador em: https://www.mongodb.com/try/download/community
   ```

2. **Inicie o serviço MongoDB**
   ```bash
   # Linux/macOS
   sudo systemctl start mongod
   
   # Windows
   # O serviço inicia automaticamente após instalação
   ```

3. **Execute o script de estrutura**
   ```bash
   mongosh < script_estrutura_medsys.js
   ```

4. **Importe os dados de exemplo** (opcional)
   ```bash
   mongoimport --db medsys --collection pacientes --file admin.pacientes.json --jsonArray
   mongoimport --db medsys --collection medicos --file admin.medicos.json --jsonArray
   mongoimport --db medsys --collection consultas --file admin.consultas.json --jsonArray
   mongoimport --db medsys --collection pagamentos --file admin.pagamentos.json --jsonArray
   mongoimport --db medsys --collection prontuarios --file admin.prontuarios.json --jsonArray
   mongoimport --db medsys --collection especialidades --file admin.especialidades.json --jsonArray
   mongoimport --db medsys --collection usuarios --file admin.usuarios.json --jsonArray
   ```

## 📊 Dados de Exemplo

O sistema vem com dados de exemplo incluindo:

- **6 médicos** de diferentes especialidades
- **12 pacientes** cadastrados
- **17 consultas** (realizadas, agendadas e confirmadas)
- **8 pagamentos** registrados
- **8 prontuários** médicos
- **10 especialidades** médicas
- **9 usuários** do sistema

## 🔐 Segurança

- Senhas armazenadas com hash bcrypt
- Validação de dados através de JSON Schema do MongoDB
- CPF e email únicos por paciente/usuário
- CRM único por médico
- Índices otimizados para consultas rápidas

## 📈 Funcionalidades Principais

### Gestão de Consultas
- Agendamento com data/hora
- Confirmação de presença
- Registro de faltas
- Cancelamento com justificativa
- Histórico completo por paciente/médico

### Prontuário Eletrônico
- Anamnese detalhada
- Diagnóstico médico
- Prescrições
- Solicitação de exames
- Histórico completo do paciente

### Controle Financeiro
- Registro de pagamentos
- Múltiplas formas de pagamento
- Emissão de recibos
- Status de pagamento (pendente/pago/cancelado)

### Relatórios Disponíveis
- Consultas por período
- Pagamentos por forma de pagamento
- Histórico de atendimentos por médico
- Prontuário completo por paciente

## 🔍 Consultas Úteis

```javascript
// Buscar consultas de um paciente específico
db.consultas.find({ pacienteId: ObjectId("pac001") })

// Listar consultas confirmadas de um médico
db.consultas.find({ 
  medicoId: ObjectId("med001"),
  status: "confirmada" 
})

// Verificar pagamentos pendentes
db.pagamentos.find({ status: "pendente" })

// Histórico médico completo de um paciente
db.prontuarios.find({ 
  pacienteId: ObjectId("pac001") 
}).sort({ data: -1 })
```

## 💾 Backup e Restauração

### Criar backup
```bash
mongodump --db=medsys --out=/caminho/para/backup/
```

### Restaurar backup
```bash
mongorestore --db=medsys /caminho/do/backup/medsys/
```

## 📱 Especialidades Disponíveis

- Clínica Geral
- Cardiologia
- Pediatria
- Dermatologia
- Ortopedia
- Ginecologia
- Oftalmologia
- Psiquiatria
- Neurologia
- Endocrinologia

