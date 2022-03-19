var http = require('http')
var axios = require('axios')
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

// Retira a informação da tarefa que está no body do request -------------------------------------------
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

// Criação da página HTML
// Template para a página com a lista de alunos ------------------
function geraPagPrincipal(tarefas, d, tarefa){
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
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-bottombar w3-padding-16">`

            // Se a tarefa estiver a ser editada a action será para a rota da tarefa
            if (JSON.stringify(tarefa) !== '{}'){
                pagHTML += `
                <form class="w3-container" action="/tarefas/${tarefa.id}" method="POST">
                `
            // Se estiver a ser criada pela primeira vez a action será em tarefas
            } else {
                pagHTML += `
                <form class="w3-container" action="/tarefas" method="POST">
                `
            }
                
            pagHTML += `<div class="w3-row-padding">`

                    if (JSON.stringify(tarefa) !== '{}'){
                        pagHTML += `<div class="w3-third">
                        <label class="w3-text-teal"><b>Data limite</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="date" placeholder="${tarefa.dataLimite}" onfocus="(this.type='date')" onblur="(this.type='text')" name="dataLimite">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Autor</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="${tarefa.autor}" name="autor">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-teal"><b>Descrição</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="${tarefa.descricao}" name="descricao">
                    </div>`
                    } else {
                        pagHTML += `<div class="w3-third">
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
                    </div>`
                    }
                    
                    pagHTML += `
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
                    <a href="http://localhost:4000/tarefas/${nr.id}/editar" class="w3-btn w3-blue w3-round-large w3-padding-small">Editar</a>
                    <a href="http://localhost:4000/tarefas/${nr.id}/feito" class="w3-btn w3-green w3-round-large w3-padding-small">Feito</a>
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
                            console.log('GET da página principal bem sucedido')
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(tarefas, d, {}))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a página principal...")
                            res.end()
                        })
                }
                // GET /tarefas/:id/editar --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/editar$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.get('http://localhost:3000/tarefas')
                    .then(respTarefas => {
                        axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                        .then(respTarefa => {
                            console.log('GET para editar: Tarefa ' + idTarefa)
                            console.log(respTarefa.data);
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(respTarefas.data, d, (respTarefa.data)[0]))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no edit: ' + error + '</p>')
                            res.end()
                        });
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro no edit: ' + error + '</p>')
                        res.end()
                    });
                }
                // GET /tarefas/:id/feito --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/feito$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                    .then(resp => {
                        tarefa = (resp.data)[0]
                        tarefa.tipo = "realizada"
                        tarefa.dataRealizacao = transformaData(d)
                        axios.put('http://localhost:3000/tarefas/' + idTarefa, tarefa)
                            .then(resp => {
                                console.log('GET para marcar a tarefa com id ' + idTarefa + ' como realizada, sucesso!')
                                res.writeHead(303, {'Location': '/'})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                                res.write('<p>Erro ao marcar a tarefa como realizada: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            });
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro ao marcar a tarefa como realizada: ' + error + '</p>')
                        res.end()
                    });
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
                        res.write('<p>Erro ao eliminar tarefa: ' + erro + '</p>')
                        res.end()
                    });
                }
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
                else if (/\/tarefas\/[0-9+]/.test(req.url)){
                    recuperaInfo(req, resultado => {
                        var idTarefa = req.url.split("/")[2]
                        dataCriacao = transformaData(d)
                        console.log('POST de uma tarefa editada: ' + idTarefa + ' - ' +  JSON.stringify(resultado))
                        axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                        .then(resp => {
                            var tarefa = (resp.data)[0]
                            if (resultado.dataLimite != ""){
                                tarefa.dataLimite = resultado.dataLimite
                            }
                            if (resultado.autor != ""){
                                tarefa.autor = resultado.autor
                            }
                            if (resultado.descricao != ""){
                                tarefa.descricao = resultado.descricao
                            }
                            axios.put('http://localhost:3000/tarefas/' + idTarefa, tarefa)
                            .then(resp => {
                                res.writeHead(303, {'Location': '/'})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST da edição: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            });
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST da edição: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        });
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