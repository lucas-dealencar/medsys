from flask import Flask, render_template, request, redirect, url_for, flash
import pymongo
from datetime import datetime
import re
import json

app = Flask(__name__)
app.secret_key = "medsys_segredo_pro"

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["medsys"]

@app.route('/')
def index():
    # 1. Totais para os Cards
    t_pac = db.pacientes.count_documents({"ativo": True})
    t_med = db.medicos.count_documents({"ativo": True})
    t_con = db.consultas.count_documents({"status": "agendada"}) # Só as futuras

    # 2. Agregação para o Gráfico: Médicos por Especialidade
    pipeline = [
        {"$group": {"_id": "$especialidade", "total": {"$sum": 1}}}
    ]
    dados_grafico = list(db.medicos.aggregate(pipeline))
    
    # Preparar dados para o Chart.js (Listas separadas)
    labels = [item["_id"] for item in dados_grafico]
    values = [item["total"] for item in dados_grafico]

    return render_template('index.html', 
                         t_pac=t_pac, t_med=t_med, t_con=t_con,
                         chart_labels=json.dumps(labels),
                         chart_values=json.dumps(values))

@app.route('/medicos')
def lista_medicos():
    # Ordenar por nome
    medicos = list(db.medicos.find().sort("nome", 1))
    return render_template('medicos.html', medicos=medicos)

@app.route('/pacientes')
def lista_pacientes():
    # Busca pacientes ordenados por nome
    pacientes = list(db.pacientes.find().sort("nome", 1))
    return render_template('pacientes.html', pacientes=pacientes)

@app.route('/consultas')
def lista_consultas():
    # Busca consultas ordenadas
    consultas = list(db.consultas.find().sort("dataHora", -1))
    
    for c in consultas:
        if isinstance(c.get('dataHora'), str):
            try:
                # Converte string -> datetime
                c['dataHora'] = datetime.strptime(c['dataHora'], "%Y-%m-%d %H:%M:%S")
            except ValueError:
                pass
                
    return render_template('consultas.html', consultas=consultas)

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro_paciente():
    if request.method == 'POST':
        cpf_limpo = re.sub(r'\D', '', request.form['cpf'])

        if len(cpf_limpo) != 11:
            flash("O CPF deve conter exatamente 11 números.", "danger")
            return render_template('cadastro.html')

        try:
            data_nasc = datetime.strptime(request.form['nascimento'], "%Y-%m-%d")
        except ValueError:
            flash("Data inválida.", "danger")
            return render_template('cadastro.html')

        novo_paciente = {
            "nome": request.form['nome'],
            "cpf": cpf_limpo,
            "telefone": request.form['telefone'],
            "dataNascimento": data_nasc,
            "endereco": {
                "logradouro": request.form['logradouro'],
                "numero": request.form['numero'],
                "bairro": request.form['bairro'],
                "cidade": request.form['cidade'],
                "estado": request.form['estado'],
                "cep": request.form['cep']
            },
            "observacoes": request.form['observacoes'],
            "ativo": True,
            "dataCadastro": datetime.now()
        }

        email = request.form['email']
        if email and email.strip():
            novo_paciente["email"] = email

        try:
            db.pacientes.insert_one(novo_paciente)
            flash(f"Paciente {novo_paciente['nome']} cadastrado com sucesso!", "success")
            return redirect(url_for('index'))
        except pymongo.errors.DuplicateKeyError:
            flash("Este CPF ou E-mail já existe no sistema.", "warning")
        except Exception as e:
            flash(f"Erro ao salvar: {e}", "danger")

    return render_template('cadastro.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)