var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static.js')
var {parse} = require('querystring')


// Funções auxiliares
//Transforma o formato das datas
function transformaData(data){
    var novaData = new Date(data)
    ano = novaData.getFullYear()
    mes = novaData.getMonth()+1
    dt = novaData.getDate()
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    return (ano + '-' + mes + '-' + dt)
}

// Retrives task info from request body -------------------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end',() =>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// Template para a página com a lista de alunos ------------------
/*function geraPagAlunos( alunos, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de alunos</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>Lista de Alunos</h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Nome</th>
                    <th>Número</th>
                    <th>Git</th>
                </tr>
  `

  alunos.forEach(a => {
    pagHTML += `
        <tr>
            <td>
                <a href="http://localhost:7777/alunos/${a.Id}">${a.Nome}</a>
            </td>
            <td>${a.Id}</td>
            <td>${a.Git}</td>
        </tr>`
  });

  pagHTML += `
        </table>
        <div class="w3-container w3-teal">
            <address>Gerado por galuno::RPCW2022 em ${d} --------------</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}

// Template para a página de aluno -------------------------------------
function geraPagAluno( aluno, d ){
    return `
    <html>
    <head>
        <title>Aluno: ${aluno.Id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Aluno ${aluno.Id}</h1>
            </header>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Nome: </b> ${aluno.Nome}</li>
                    <li><b>Número: </b> ${aluno.Id}</li>
                    <li><b>Git (link): </b> <a href="${aluno.Git}">${aluno.Git}</a></li>
                </ul>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

// Template para o formulário de aluno ------------------
function geraFormAluno( d ){
    return `
    <html>
        <head>
            <title>Registo de um aluno</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>Registo de Aluno</h2>
            </div>

            <form class="w3-container" action="/alunos" method="POST">
                <label class="w3-text-teal"><b>Nome</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="Nome">
          
                <label class="w3-text-teal"><b>Número / Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="Id">

                <label class="w3-text-teal"><b>Link para o repositório no Git</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="Git">
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::RPCW2022 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

// POST Confirmation HTML Page Template ------------------------------------------------
function geraPostConfirm(data,d){
    return `
    <html>
    <head>
        <title>Registo de um aluno</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header>
                <h1>Aluno ${data.Id} inserido</h1>
            </header>
        </div>

        <div class"w3-container">
            <p><a href="/alunos/${data.Id}">Aceda aqui à sua página.</a></p>
        </div>

        <footer class="w3-container w3-teal">
            <address>Gerado por galuno::RPCW2022 em ${d}</address>
        </footer>
    </body>
</html>
    `
}*/

// Criação da página HTML
// Template para a página com a lista de alunos ------------------
function geraPagPrincipal(tarefas, d){
    let realizadas = new Array();
    let naoRealizadas = new Array();
    // Percorrer as tarefas e verificar de que tipo são
    tarefas.forEach(t => {
        if (t.tipo == "realizada"){
            realizadas.push(t)
        } else if (t.tipo == "porRealizar") {
            naoRealizadas.push(t)
        }
    })
    // Preencher o html
    let pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>ToDo List</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-bottombar w3-padding-16">
                <form class="w3-container" action="/tarefas" method="POST">
                    <div class="w3-row-padding">
                        <div class="w3-third">
                            <label class="w3-text-teal"><b>Data limite</b></label>
                            <input class="w3-input w3-border w3-round w3-light-grey" type="date" name="dataLimite" required>
                        </div>
                        <div class="w3-third">
                            <label class="w3-text-teal"><b>Autor</b></label>
                            <input class="w3-input w3-border w3-round w3-light-grey" type="text" name="autor" required>
                        </div>
                        <div class="w3-third">
                            <label class="w3-text-teal"><b>Descrição</b></label>
                            <input class="w3-input w3-border w3-round w3-light-grey" type="text" name="descricao" required>
                        </div>
                    </div>
                
                    <div class="w3-center w3-margin-top">
                        <input class="w3-btn w3-round-large w3-green" type="submit" value="Registar"/>
                        <input class="w3-btn w3-round-large w3-red" type="reset" value="Limpar valores"/>
                    </div>
                </form>
            </div>
            <div class="w3-row">
                <div class="w3-col s6">
                    <h2 class="w3-text-teal w3-center">Tarefas por realizar</h2>`

// Adicionar as tarefas por realizar
if (naoRealizadas.length == 0) {
    pagHTML += '<p class="w3-center">Não há tarefas para mostrar.</p>'
}

naoRealizadas.forEach(nr => {
    pagHTML += `<div class="w3-container">`
    pagHTML += `<ul class="w3-ul w3-border">`
    pagHTML += `<li>${nr.autor} | ${nr.descricao} | Data limite: ${nr.dataLimite}
                    <a href="#" class="w3-btn w3-blue w3-round-large w3-padding-small">Editar</a>
                    <a href="#" class="w3-btn w3-green w3-round-large w3-padding-small">Feito</a>
                </li>`
    pagHTML += `</ul>`
    pagHTML += `</div>`
})

pagHTML += `
                </div>
                <div class="w3-col s6">
                    <h2 class="w3-text-teal w3-center">Tarefas realizadas</h2>`

// Adicionar as tarefas realizadas
if (realizadas.length == 0) {
    pagHTML += '<p class="w3-center">Não há tarefas para mostrar.</p>'
}

realizadas.forEach(r => {
    pagHTML += `<div class="w3-container">`
    pagHTML += `<ul class="w3-ul w3-border">`
    pagHTML += `<li>${r.autor} | ${r.descricao} | Data de realização: ${r.dataRealizacao}
                    <a href="http://localhost:4000/tarefas/${r.id}/eliminar" class="w3-btn w3-red w3-round-large w3-padding-small">Eliminar</a>
                </li>`
    pagHTML += `</ul>`
    pagHTML += `</div>`
})

pagHTML += `
                </div>
            </div> 
        </body>
    </html>
    `
    return pagHTML
  }

// Criação do servidor

var tarefasServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET / ou /tarefas --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/tarefas")){
                    axios.get("http://localhost:3000/tarefas")
                        .then(response => {
                            var tarefas = response.data
                            // Add code to render page with the student's list
                            console.log('GET da página principal bem sucedido')
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(tarefas, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de alunos...")
                            res.end()
                        })
                }
                // GET /tarefas/:id/eliminar --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/eliminar$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.delete('http://localhost:3000/tarefas/' + idTarefa)
                    .then(resp => {
                        console.log('GET: Tarefa ' + idTarefa + ' eliminada!')
                        console.log(resp.data);
                        res.writeHead(303, {'Location':'/'})
                        res.end()
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro no DELETE: ' + erro + '</p>')
                        res.end()
                    });
                }
                /*else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
                    var idAluno = req.url.split("/")[2]
                    axios.get("http://localhost:3000/alunos?Id=" + idAluno)
                        .then( response => {
                            let a = response.data
                            // Add code to render page with the student record
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagAluno(a[0], d))
                            res.end()
                        })
                }
                // GET /alunos/registo --------------------------------------------------------------------
                else if(req.url == "/alunos/registo"){
                    // Add code to render page with the student form
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormAluno(d))
                    res.end()
                }
                // GET /w3.css ------------------------------------------------------------------------
                else if(req.url == "/w3.css"){
                    fs.readFile("w3.css", function(erro, dados){
                        if(!erro){
                            res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                            res.write(dados)
                            res.end()
                        }
                    })
                }*/
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/tarefas'){
                    recuperaInfo(req, resultado => {
                        dataCriacao = transformaData(d)
                        console.log('POST de uma tarefa: ' + JSON.stringify(resultado))
                        resultado["tipo"] = "porRealizar"
                        resultado["dataCriacao"] = dataCriacao
                        resultado["dataRealizacao"] = ""
                        axios.post('http://localhost:3000/tarefas', resultado)
                        .then(resp => {
                            res.writeHead(303, {'Location': '/'})
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                    res.write('<p>Recebi um POST não suportado.</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

tarefasServer.listen(4000)
console.log('Servidor à escuta na porta 4000...')