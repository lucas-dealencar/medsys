// ===================================
// MEDSYS - ESTRUTURA DO BANCO DE DADOS MONGODB
// ===================================

// Conectar ao banco de dados
use medsys;

// ===================================
// 1. COLEÇÃO: usuarios
// ===================================
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "email", "senha", "funcao", "ativo"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome completo do usuário"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "E-mail único do usuário"
        },
        senha: {
          bsonType: "string",
          description: "Senha criptografada (hash)"
        },
        funcao: {
          enum: ["administrador", "medico", "recepcionista"],
          description: "Função do usuário no sistema"
        },
        ativo: {
          bsonType: "bool",
          description: "Status do usuário"
        },
        dataCadastro: {
          bsonType: "date",
          description: "Data de cadastro"
        }
      }
    }
  }
});

db.usuarios.createIndex({ email: 1 }, { unique: true });

// ===================================
// 2. COLEÇÃO: pacientes
// ===================================
db.createCollection("pacientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "cpf", "telefone", "dataNascimento"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome completo do paciente"
        },
        cpf: {
          bsonType: "string",
          pattern: "^[0-9]{11}$",
          description: "CPF sem pontuação"
        },
        telefone: {
          bsonType: "string",
          description: "Telefone de contato"
        },
        endereco: {
          bsonType: "object",
          properties: {
            logradouro: { bsonType: "string" },
            numero: { bsonType: "string" },
            complemento: { bsonType: "string" },
            bairro: { bsonType: "string" },
            cidade: { bsonType: "string" },
            estado: { bsonType: "string" },
            cep: { bsonType: "string" }
          }
        },
        dataNascimento: {
          bsonType: "date",
          description: "Data de nascimento"
        },
        email: {
          bsonType: "string",
          description: "E-mail do paciente"
        },
        observacoes: {
          bsonType: "string",
          description: "Observações gerais"
        },
        ativo: {
          bsonType: "bool",
          description: "Status do cadastro"
        },
        dataCadastro: {
          bsonType: "date"
        }
      }
    }
  }
});

db.pacientes.createIndex({ cpf: 1 }, { unique: true });
db.pacientes.createIndex({ nome: 1 });

// ===================================
// 3. COLEÇÃO: medicos
// ===================================
db.createCollection("medicos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome", "crm", "especialidade", "usuarioId"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome completo do médico"
        },
        crm: {
          bsonType: "string",
          description: "Número do CRM"
        },
        especialidade: {
          bsonType: "string",
          description: "Especialidade médica"
        },
        usuarioId: {
          bsonType: "objectId",
          description: "Referência ao usuário"
        },
        telefone: {
          bsonType: "string",
          description: "Telefone de contato"
        },
        email: {
          bsonType: "string",
          description: "E-mail profissional"
        },
        horarioAtendimento: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              diaSemana: { bsonType: "int", minimum: 0, maximum: 6 },
              horaInicio: { bsonType: "string" },
              horaFim: { bsonType: "string" }
            }
          }
        },
        ativo: {
          bsonType: "bool"
        },
        dataCadastro: {
          bsonType: "date"
        }
      }
    }
  }
});

db.medicos.createIndex({ crm: 1 }, { unique: true });
db.medicos.createIndex({ especialidade: 1 });

// ===================================
// 4. COLEÇÃO: consultas
// ===================================
db.createCollection("consultas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pacienteId", "medicoId", "dataHora", "status"],
      properties: {
        pacienteId: {
          bsonType: "objectId",
          description: "Referência ao paciente"
        },
        medicoId: {
          bsonType: "objectId",
          description: "Referência ao médico"
        },
        dataHora: {
          bsonType: "date",
          description: "Data e hora da consulta"
        },
        motivo: {
          bsonType: "string",
          description: "Motivo da consulta"
        },
        status: {
          enum: ["agendada", "confirmada", "realizada", "cancelada", "faltou"],
          description: "Status da consulta"
        },
        justificativaCancelamento: {
          bsonType: "string",
          description: "Motivo do cancelamento"
        },
        observacoes: {
          bsonType: "string"
        },
        valorConsulta: {
          bsonType: "double",
          description: "Valor da consulta"
        },
        dataCriacao: {
          bsonType: "date"
        },
        dataAtualizacao: {
          bsonType: "date"
        }
      }
    }
  }
});

db.consultas.createIndex({ pacienteId: 1, dataHora: 1 });
db.consultas.createIndex({ medicoId: 1, dataHora: 1 });
db.consultas.createIndex({ dataHora: 1 });
db.consultas.createIndex({ status: 1 });

// ===================================
// 5. COLEÇÃO: pagamentos
// ===================================
db.createCollection("pagamentos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["consultaId", "valor", "dataPagamento", "formaPagamento", "status"],
      properties: {
        consultaId: {
          bsonType: "objectId",
          description: "Referência à consulta"
        },
        valor: {
          bsonType: "double",
          minimum: 0,
          description: "Valor pago"
        },
        dataPagamento: {
          bsonType: "date",
          description: "Data do pagamento"
        },
        formaPagamento: {
          enum: ["dinheiro", "cartao_credito", "cartao_debito", "pix", "boleto"],
          description: "Forma de pagamento"
        },
        status: {
          enum: ["pendente", "pago", "cancelado"],
          description: "Status do pagamento"
        },
        observacoes: {
          bsonType: "string"
        },
        numeroRecibo: {
          bsonType: "string",
          description: "Número do recibo gerado"
        },
        dataCriacao: {
          bsonType: "date"
        }
      }
    }
  }
});

db.pagamentos.createIndex({ consultaId: 1 });
db.pagamentos.createIndex({ dataPagamento: 1 });
db.pagamentos.createIndex({ status: 1 });

// ===================================
// 6. COLEÇÃO: prontuarios
// ===================================
db.createCollection("prontuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pacienteId", "consultaId", "medicoId", "data"],
      properties: {
        pacienteId: {
          bsonType: "objectId",
          description: "Referência ao paciente"
        },
        consultaId: {
          bsonType: "objectId",
          description: "Referência à consulta"
        },
        medicoId: {
          bsonType: "objectId",
          description: "Referência ao médico"
        },
        data: {
          bsonType: "date",
          description: "Data do atendimento"
        },
        anamnese: {
          bsonType: "string",
          description: "Histórico e queixas do paciente"
        },
        diagnostico: {
          bsonType: "string",
          description: "Diagnóstico médico"
        },
        prescricao: {
          bsonType: "string",
          description: "Prescrição médica"
        },
        observacoes: {
          bsonType: "string",
          description: "Observações adicionais"
        },
        examesSolicitados: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        dataCriacao: {
          bsonType: "date"
        }
      }
    }
  }
});

db.prontuarios.createIndex({ pacienteId: 1, data: -1 });
db.prontuarios.createIndex({ consultaId: 1 });

// ===================================
// 7. COLEÇÃO: especialidades
// ===================================
db.createCollection("especialidades", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nome"],
      properties: {
        nome: {
          bsonType: "string",
          description: "Nome da especialidade"
        },
        descricao: {
          bsonType: "string"
        },
        ativo: {
          bsonType: "bool"
        }
      }
    }
  }
});

db.especialidades.createIndex({ nome: 1 }, { unique: true });

// ===================================
// DADOS DE EXEMPLO
// ===================================

// Inserir especialidades
db.especialidades.insertMany([
  { nome: "Clínica Geral", descricao: "Atendimento médico geral", ativo: true },
  { nome: "Cardiologia", descricao: "Especialidade em doenças do coração", ativo: true },
  { nome: "Pediatria", descricao: "Especialidade em saúde infantil", ativo: true },
  { nome: "Dermatologia", descricao: "Especialidade em doenças da pele", ativo: true },
  { nome: "Ortopedia", descricao: "Especialidade em ossos e articulações", ativo: true }
]);

// Inserir usuários (senha: "admin123" em hash MD5 simplificado)
db.usuarios.insertMany([
  {
    nome: "Admin Sistema",
    email: "admin@medsys.com",
    senha: "$2a$10$abcdefghijklmnopqrstuv", // Hash exemplo
    funcao: "administrador",
    ativo: true,
    dataCadastro: new Date()
  },
  {
    nome: "Dr. João Silva",
    email: "joao.silva@medsys.com",
    senha: "$2a$10$abcdefghijklmnopqrstuv",
    funcao: "medico",
    ativo: true,
    dataCadastro: new Date()
  },
  {
    nome: "Dra. Maria Santos",
    email: "maria.santos@medsys.com",
    senha: "$2a$10$abcdefghijklmnopqrstuv",
    funcao: "medico",
    ativo: true,
    dataCadastro: new Date()
  },
  {
    nome: "Ana Recepcionista",
    email: "ana@medsys.com",
    senha: "$2a$10$abcdefghijklmnopqrstuv",
    funcao: "recepcionista",
    ativo: true,
    dataCadastro: new Date()
  }
]);

// Obter IDs dos usuários médicos
const drJoaoUser = db.usuarios.findOne({ email: "joao.silva@medsys.com" });
const drMariaUser = db.usuarios.findOne({ email: "maria.santos@medsys.com" });

// Inserir médicos
db.medicos.insertMany([
  {
    nome: "Dr. João Silva",
    crm: "12345-SP",
    especialidade: "Cardiologia",
    usuarioId: drJoaoUser._id,
    telefone: "(11) 98765-4321",
    email: "joao.silva@medsys.com",
    horarioAtendimento: [
      { diaSemana: 1, horaInicio: "08:00", horaFim: "12:00" },
      { diaSemana: 3, horaInicio: "14:00", horaFim: "18:00" },
      { diaSemana: 5, horaInicio: "08:00", horaFim: "12:00" }
    ],
    ativo: true,
    dataCadastro: new Date()
  },
  {
    nome: "Dra. Maria Santos",
    crm: "67890-SP",
    especialidade: "Pediatria",
    usuarioId: drMariaUser._id,
    telefone: "(11) 91234-5678",
    email: "maria.santos@medsys.com",
    horarioAtendimento: [
      { diaSemana: 2, horaInicio: "09:00", horaFim: "13:00" },
      { diaSemana: 4, horaInicio: "14:00", horaFim: "18:00" }
    ],
    ativo: true,
    dataCadastro: new Date()
  }
]);

// Inserir pacientes
db.pacientes.insertMany([
  {
    nome: "Carlos Oliveira",
    cpf: "12345678901",
    telefone: "(11) 99876-5432",
    endereco: {
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    dataNascimento: new Date("1980-05-15"),
    email: "carlos@email.com",
    ativo: true,
    dataCadastro: new Date()
  },
  {
    nome: "Fernanda Lima",
    cpf: "98765432109",
    telefone: "(11) 98765-1234",
    endereco: {
      logradouro: "Av. Paulista",
      numero: "1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100"
    },
    dataNascimento: new Date("1992-08-20"),
    email: "fernanda@email.com",
    ativo: true,
    dataCadastro: new Date()
  }
]);

// Obter IDs para relacionamentos
const medico1 = db.medicos.findOne({ crm: "12345-SP" });
const medico2 = db.medicos.findOne({ crm: "67890-SP" });
const paciente1 = db.pacientes.findOne({ cpf: "12345678901" });
const paciente2 = db.pacientes.findOne({ cpf: "98765432109" });

// Inserir consultas
const consultas = db.consultas.insertMany([
  {
    pacienteId: paciente1._id,
    medicoId: medico1._id,
    dataHora: new Date("2025-12-10T10:00:00"),
    motivo: "Consulta de rotina cardiológica",
    status: "agendada",
    valorConsulta: 250.00,
    dataCriacao: new Date(),
    dataAtualizacao: new Date()
  },
  {
    pacienteId: paciente2._id,
    medicoId: medico2._id,
    dataHora: new Date("2025-12-08T14:30:00"),
    motivo: "Consulta pediátrica",
    status: "confirmada",
    valorConsulta: 200.00,
    dataCriacao: new Date(),
    dataAtualizacao: new Date()
  }
]);

print("✓ Banco de dados MedSys criado com sucesso!");
print("✓ Coleções criadas: usuarios, pacientes, medicos, consultas, pagamentos, prontuarios, especialidades");
print("✓ Dados de exemplo inseridos");
print("\nPara fazer backup, execute:");
print("mongodump --db=medsys --out=/caminho/backup/");