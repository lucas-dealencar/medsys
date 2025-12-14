# 🏥 MedSys - Sistema de Gestão de Clínicas Médicas

Sistema completo para gestão de clínicas médicas, desenvolvido com **MongoDB**, **Flask** e **Python**, permitindo o gerenciamento integrado de consultas, pacientes, médicos, prontuários e pagamentos.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Sobre o Projeto

O **MedSys** é uma solução completa para gestão clínica que facilita o controle administrativo e médico de consultórios e clínicas, oferecendo:

- ✅ Cadastro e gestão completa de pacientes
- 👨‍⚕️ Gerenciamento de médicos e especialidades
- 📅 Agendamento e controle de consultas
- 📝 Registro de prontuários médicos eletrônicos
- 💰 Controle financeiro e gestão de pagamentos
- 🔐 Sistema de usuários com diferentes níveis de acesso
- 📊 Dashboard com estatísticas em tempo real
- 📈 Gráficos e relatórios administrativos

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.8+**
- **Flask** - Framework web
- **PyMongo** - Driver MongoDB para Python
- **Bcrypt** - Criptografia de senhas

### Banco de Dados
- **MongoDB 4.0+** - Banco de dados NoSQL

### Frontend
- **Bootstrap 5** (Bootswatch Pulse Theme)
- **Font Awesome 6** - Ícones
- **Chart.js** - Gráficos interativos
- **HTML5/CSS3**

---

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza MongoDB com 7 coleções principais:

### 1. **usuarios**
Gerencia usuários do sistema com diferentes níveis de acesso
```javascript
{
  nome: String,
  email: String (único),
  senha: String (hash bcrypt),
  funcao: Enum ["administrador", "medico", "recepcionista"],
  ativo: Boolean,
  dataCadastro: Date
}
```

### 2. **pacientes**
Cadastro completo dos pacientes
```javascript
{
  nome: String,
  cpf: String (único, 11 dígitos),
  telefone: String,
  email: String,
  endereco: {
    logradouro, numero, complemento,
    bairro, cidade, estado, cep
  },
  dataNascimento: Date,
  observacoes: String,
  ativo: Boolean,
  dataCadastro: Date
}
```

### 3. **medicos**
Informações dos profissionais médicos
```javascript
{
  nome: String,
  crm: String (único),
  especialidade: String,
  usuarioId: ObjectId (ref: usuarios),
  telefone: String,
  email: String,
  horarioAtendimento: Array,
  ativo: Boolean,
  dataCadastro: Date
}
```

### 4. **consultas**
Gerenciamento de agendamentos
```javascript
{
  pacienteId: ObjectId (ref: pacientes),
  medicoId: ObjectId (ref: medicos),
  dataHora: Date,
  motivo: String,
  status: Enum ["agendada", "confirmada", "realizada", "cancelada", "faltou"],
  valorConsulta: Double,
  justificativaCancelamento: String,
  dataCriacao: Date,
  dataAtualizacao: Date
}
```

### 5. **pagamentos**
Controle financeiro das consultas
```javascript
{
  consultaId: ObjectId (ref: consultas),
  valor: Double,
  dataPagamento: Date,
  formaPagamento: Enum ["dinheiro", "cartao_credito", "cartao_debito", "pix", "boleto"],
  status: Enum ["pendente", "pago", "cancelado"],
  numeroRecibo: String,
  dataCriacao: Date
}
```

### 6. **prontuarios**
Registro médico dos atendimentos
```javascript
{
  pacienteId: ObjectId (ref: pacientes),
  consultaId: ObjectId (ref: consultas),
  medicoId: ObjectId (ref: medicos),
  data: Date,
  anamnese: String,
  diagnostico: String,
  prescricao: String,
  examesSolicitados: Array<String>,
  observacoes: String,
  dataCriacao: Date
}
```

### 7. **especialidades**
Cadastro das especialidades médicas
```javascript
{
  nome: String (único),
  descricao: String,
  ativo: Boolean
}
```

---

## 📦 Instalação e Configuração

### Pré-requisitos

```bash
# Instalar Python 3.8+
python --version

# Instalar MongoDB 4.0+
mongod --version

# Instalar pip (gerenciador de pacotes Python)
pip --version
```

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/seu-usuario/medsys.git
cd medsys
```

### Passo 2: Crie um Ambiente Virtual

```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### Passo 3: Instale as Dependências

```bash
pip install flask pymongo bcrypt
```

### Passo 4: Configure o MongoDB

```bash
# Inicie o serviço MongoDB
# Linux/macOS
sudo systemctl start mongod

# Windows (executa automaticamente após instalação)
```

### Passo 5: Crie a Estrutura do Banco

```bash
# Execute o script de criação da estrutura
mongosh < script_estrutura_medsys.js
```

### Passo 6: Importe os Dados de Exemplo (Opcional)

```bash
mongoimport --db medsys --collection usuarios --file admin.usuarios.json --jsonArray
mongoimport --db medsys --collection especialidades --file admin.especialidades.json --jsonArray
mongoimport --db medsys --collection medicos --file admin.medicos.json --jsonArray
mongoimport --db medsys --collection pacientes --file admin.pacientes.json --jsonArray
mongoimport --db medsys --collection consultas --file admin.consultas.json --jsonArray
mongoimport --db medsys --collection pagamentos --file admin.pagamentos.json --jsonArray
mongoimport --db medsys --collection prontuarios --file admin.prontuarios.json --jsonArray
```

### Passo 7: Execute a Aplicação

#### Interface Web (Flask)
```bash
python app_web.py
```
Acesse: `http://localhost:5000`

#### Interface CLI (Terminal)
```bash
python app_medsys.py
```

---

## 📊 Funcionalidades Principais

### 🏠 Dashboard
- Visão geral com cards de estatísticas
- Gráfico de distribuição de médicos por especialidade
- Atalhos rápidos para ações frequentes

### 👨‍⚕️ Gestão de Médicos
- Listagem completa do corpo clínico
- Informações de contato e especialidade
- Status ativo/inativo
- Horários de atendimento

### 👥 Gestão de Pacientes
- Cadastro completo com dados pessoais
- Endereço e informações de contato
- Observações médicas
- Histórico de atendimentos
- Busca por CPF

### 📅 Gestão de Consultas
- Agendamento com data/hora
- Confirmação de presença
- Registro de faltas e cancelamentos
- Controle de status
- Histórico completo

### 💰 Controle Financeiro
- Registro de pagamentos
- Múltiplas formas de pagamento
- Emissão de recibos
- Relatórios financeiros

### 📝 Prontuário Eletrônico
- Anamnese detalhada
- Diagnóstico médico
- Prescrições
- Solicitação de exames
- Histórico completo do paciente

---

## 🎨 Interface Web

### Páginas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard principal |
| `/medicos` | Listagem de médicos |
| `/pacientes` | Listagem de pacientes |
| `/consultas` | Histórico de consultas |
| `/cadastro` | Formulário de novo paciente |

---

## 🔐 Segurança

- ✅ Senhas armazenadas com **hash bcrypt**
- ✅ Validação de dados com **JSON Schema** do MongoDB
- ✅ CPF e email únicos por paciente/usuário
- ✅ CRM único por médico
- ✅ Índices otimizados para consultas rápidas
- ✅ Proteção contra duplicação de dados

---

## 📈 Dados de Exemplo

O sistema vem com dados de exemplo incluindo:

- 👨‍⚕️ **6 médicos** de diferentes especialidades
- 👥 **12 pacientes** cadastrados
- 📅 **17 consultas** (realizadas, agendadas e confirmadas)
- 💰 **8 pagamentos** registrados
- 📝 **8 prontuários** médicos
- 🏥 **10 especialidades** disponíveis
- 👤 **9 usuários** do sistema

---

## 📊 Consultas Úteis (MongoDB Shell)

```javascript
// Buscar todas as consultas de um paciente
db.consultas.find({ pacienteId: ObjectId("pac001") })

// Listar consultas confirmadas de um médico
db.consultas.find({ 
  medicoId: ObjectId("med001"),
  status: "confirmada" 
}).sort({ dataHora: 1 })

// Verificar pagamentos pendentes
db.pagamentos.find({ status: "pendente" })

// Histórico médico completo de um paciente
db.prontuarios.find({ 
  pacienteId: ObjectId("pac001") 
}).sort({ data: -1 })

// Médicos por especialidade
db.medicos.aggregate([
  { $group: { _id: "$especialidade", total: { $sum: 1 } } }
])

// Consultas do dia
db.consultas.find({
  dataHora: {
    $gte: ISODate("2025-12-14T00:00:00Z"),
    $lt: ISODate("2025-12-15T00:00:00Z")
  }
})
```

---

## 🔧 Índices do Banco de Dados

O sistema cria automaticamente os seguintes índices:

```javascript
// usuarios
db.usuarios.createIndex({ email: 1 }, { unique: true })

// pacientes
db.pacientes.createIndex({ cpf: 1 }, { unique: true })
db.pacientes.createIndex({ nome: 1 })

// medicos
db.medicos.createIndex({ crm: 1 }, { unique: true })
db.medicos.createIndex({ especialidade: 1 })

// consultas
db.consultas.createIndex({ pacienteId: 1, dataHora: 1 })
db.consultas.createIndex({ medicoId: 1, dataHora: 1 })
db.consultas.createIndex({ dataHora: 1 })
db.consultas.createIndex({ status: 1 })

// pagamentos
db.pagamentos.createIndex({ consultaId: 1 })
db.pagamentos.createIndex({ dataPagamento: 1 })
db.pagamentos.createIndex({ status: 1 })

// prontuarios
db.prontuarios.createIndex({ pacienteId: 1, data: -1 })
db.prontuarios.createIndex({ consultaId: 1 })

// especialidades
db.especialidades.createIndex({ nome: 1 }, { unique: true })
```

---

## 💾 Backup e Restauração

### Criar Backup Completo
```bash
mongodump --db=medsys --out=/caminho/para/backup/
```

### Restaurar Backup
```bash
mongorestore --db=medsys /caminho/do/backup/medsys/
```

### Backup de Coleção Específica
```bash
mongodump --db=medsys --collection=pacientes --out=/backup/
```

---

## 📁 Estrutura de Arquivos

```
medsys/
│
├── app_web.py                    # Aplicação web Flask
├── app_medsys.py                 # Interface CLI
├── script_estrutura_medsys.js    # Script de criação do BD
│
├── templates/                    # Templates HTML
│   ├── base.html
│   ├── index.html
│   ├── medicos.html
│   ├── pacientes.html
│   ├── consultas.html
│   └── cadastro.html
│
├── admin.*.json                  # Arquivos de dados de exemplo
│   ├── admin.usuarios.json
│   ├── admin.medicos.json
│   ├── admin.pacientes.json
│   ├── admin.consultas.json
│   ├── admin.pagamentos.json
│   ├── admin.prontuarios.json
│   └── admin.especialidades.json
│
└── medsys_readme.md             # Documentação original
```

---

## 🏥 Especialidades Disponíveis

- 🩺 Clínica Geral
- ❤️ Cardiologia
- 👶 Pediatria
- 🧴 Dermatologia
- 🦴 Ortopedia
- 🤰 Ginecologia
- 👁️ Oftalmologia
- 🧠 Psiquiatria
- 🧬 Neurologia
- ⚖️ Endocrinologia

---

## 🐛 Resolução de Problemas

### Erro de Conexão com MongoDB
```bash
# Verificar se o MongoDB está rodando
sudo systemctl status mongod

# Iniciar MongoDB
sudo systemctl start mongod
```

### Erro de Importação de Dados
```bash
# Verificar se o banco existe
mongosh
> show dbs
> use medsys
> show collections
```

### Porta 5000 já em uso
```python
# Em app_web.py, altere a porta:
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Usar outra porta
```

---



