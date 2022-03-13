const http = require('http')
const url = require('url')
const axios = require('axios');

function getStudent(id){
    return axios.get('http://localhost:3000/alunos?id=' + id)
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateStudentPage(res,id){

    getStudent(id)
    .then(aluno => {
        aluno = aluno[0]
        var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>` + id + `</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://kit.fontawesome.com/c0690ba0c7.js" crossorigin="anonymous"></script>
        </head>
        <body style="background-color: rgb(30, 117, 74);">
            <div class="w3-top">
                <div class="w3-bar w3-large w3-text-white" style="background-color: rgb(14, 68, 41);">
                    <a href="http://localhost:4000/" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-house"></i>
                    </a>
                    <a href="http://localhost:4000/alunos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-users"></i>
                    </a>
                    <a href="http://localhost:4000/cursos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-book"></i>
                    </a>
                    <a href="http://localhost:4000/instrumentos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-guitar"></i>
                    </a>
                </div>
            </div>
            <div class="w3-container" style="margin-top: 30px;">
                <h1 class="w3-center" style="color: white;">` + aluno.nome + `</h1>
                <ul class="w3-text-white">
                    <li>Data de nascimento: ` + aluno.dataNasc + `</li>
                    <li>Curso: ` + aluno.curso + `</li>
                    <li>Ano: ` + aluno.anoCurso + `</li>
                    <li>Instrumento: ` + aluno.instrumento + `</li>
                </ul>
            </div>
        </body>
    </html>
    `
    res.write(page)
    res.end()
    });
}

function getCurso(id){
    return axios.get('http://localhost:3000/cursos?id=' + id)
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateCursoPage(res,id){

    getCurso(id)
    .then(curso => {
        curso = curso[0]
        newKey = 'text'
        oldKey = '#text'
        curso['instrumento'][newKey] = curso['instrumento'][oldKey]
        delete curso['instrumento'][oldKey]
        var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>` + id + `</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://kit.fontawesome.com/c0690ba0c7.js" crossorigin="anonymous"></script>
        </head>
        <body style="background-color: rgb(30, 117, 74);">
            <div class="w3-top">
                <div class="w3-bar w3-large w3-text-white" style="background-color: rgb(14, 68, 41);">
                    <a href="http://localhost:4000/" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-house"></i>
                    </a>
                    <a href="http://localhost:4000/alunos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-users"></i>
                    </a>
                    <a href="http://localhost:4000/cursos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-book"></i>
                    </a>
                    <a href="http://localhost:4000/instrumentos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-guitar"></i>
                    </a>
                </div>
            </div>
            <div class="w3-container" style="margin-top: 30px;">
                <h1 class="w3-center" style="color: white;">` + curso.designacao + `</h1>
                <ul class="w3-text-white">
                    <li>Duração: ` + curso.duracao + `</li>
                    <li>Instrumento: ` + curso['instrumento'][newKey] + `</li>
                </ul>
            </div>
        </body>
    </html>
    `
    res.write(page)
    res.end()
    });
}

function getAlunos(){
    return axios.get('http://localhost:3000/alunos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateStudentsPage(res){
    var selectedKeys = ['Id', 'Nome', 'Curso', 'Instrumento']
    var studentsPage = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Alunos</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://kit.fontawesome.com/c0690ba0c7.js" crossorigin="anonymous"></script>
        </head>
        <body style="background-color: rgb(30, 117, 74);">
            <div class="w3-top">
                <div class="w3-bar w3-large w3-text-white" style="background-color: rgb(14, 68, 41);">
                    <a href="http://localhost:4000/" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-house"></i>
                    </a>
                    <a href="http://localhost:4000/alunos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-users"></i>
                    </a>
                    <a href="http://localhost:4000/cursos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-book"></i>
                    </a>
                    <a href="http://localhost:4000/instrumentos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-guitar"></i>
                    </a>
                </div>
            </div>
            <div class="w3-container" style="margin-top: 30px;">
                <h1 class="w3-center" style="color: white;">Tabela de alunos</h1>
                <table class="w3-table-all w3-centered w3-hoverable w3-margin-top">
    `
    // Table head
    studentsPage += `
    <thead>
        <tr class="w3-light-grey">
    `
    for (let i = 0; i < selectedKeys.length; i++){
        let head = selectedKeys[i]
        studentsPage += '<th>' + head + '</th>'
    }
    studentsPage += '</tr></thead>'

    getAlunos()
    .then(alunos => {
        // Table rows for each student
        alunos.forEach( a => {
            studentsPage += '<tr>'
            studentsPage += '<td><a href="http://localhost:4000/alunos/' + a.id + '">' + a.id +  '</a></td><td>' + a.nome + '</td><td>' + a.curso + '</td><td>' + a.instrumento + '</td>'
            studentsPage += '</tr>'
        });
        // Final html
        studentsPage += '</table></body></html>'
        res.write(studentsPage)
        res.end()
    });
}

function getCursos(){
    return axios.get('http://localhost:3000/cursos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateCursosPage(res){
    var selectedKeys = ['Id', 'Designacao', 'Duracao', 'Instrumento']
    var cursosPage = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Cursos</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://kit.fontawesome.com/c0690ba0c7.js" crossorigin="anonymous"></script>
        </head>
        <body style="background-color: rgb(30, 117, 74);">
            <div class="w3-top">
                <div class="w3-bar w3-large w3-text-white" style="background-color: rgb(14, 68, 41);">
                    <a href="http://localhost:4000/" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-house"></i>
                    </a>
                    <a href="http://localhost:4000/alunos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-users"></i>
                    </a>
                    <a href="http://localhost:4000/cursos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-book"></i>
                    </a>
                    <a href="http://localhost:4000/instrumentos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-guitar"></i>
                    </a>
                </div>
            </div>
            <div class="w3-container" style="margin-top: 30px;">
                <h1 class="w3-center" style="color: white;">Tabela de cursos</h1>
                <table class="w3-table-all w3-centered w3-hoverable w3-margin-top">
    `
    // Table head
    cursosPage += `
    <thead>
        <tr class="w3-light-grey">
    `
    for (let i = 0; i < selectedKeys.length; i++){
        let head = selectedKeys[i]
        cursosPage += '<th>' + head + '</th>'
    }
    cursosPage += '</tr></thead>'

    getCursos()
    .then(cursos => {
        // Table rows for each course
        cursos.forEach( c => {
            oldKey = '#text'
            newKey = 'text'
            c['instrumento'][newKey] = c['instrumento'][oldKey]
            delete c['instrumento'][oldKey]
            cursosPage += '<tr>'
            cursosPage += '<td><a href="http://localhost:4000/cursos/' + c.id + '">' + c.id +  '</a></td><td>' + c.designacao + '</td><td>' + c.duracao + '</td><td>' + c['instrumento'][newKey] + '</td>'
            cursosPage += '</tr>'
        });
        // Final html
        cursosPage += '</table></div></body></html>'
        res.write(cursosPage)
        res.end()
    });
}

function getInstrumentos(){
    return axios.get('http://localhost:3000/instrumentos')
    .then(function (resp){
        return resp.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

function generateInstrumentosPage(res){
    var selectedKeys = ['Id', 'Text']
    var instrsPage = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Instrumentos</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://kit.fontawesome.com/c0690ba0c7.js" crossorigin="anonymous"></script>
        </head>
        <body style="background-color: rgb(30, 117, 74);">
            <div class="w3-top">
                <div class="w3-bar w3-large w3-text-white" style="background-color: rgb(14, 68, 41);">
                    <a href="http://localhost:4000/" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-house"></i>
                    </a>
                    <a href="http://localhost:4000/alunos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-users"></i>
                    </a>
                    <a href="http://localhost:4000/cursos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-book"></i>
                    </a>
                    <a href="http://localhost:4000/instrumentos" class="w3-bar-item w3-button">
                        <i class="fa-solid fa-guitar"></i>
                    </a>
                </div>
            </div>
            <div class="w3-container" style="margin-top: 30px;">
                <h1 class="w3-center" style="color: white;">Tabela de instrumentos</h1>
                <table class="w3-table-all w3-centered w3-hoverable w3-margin-top">
    `
    // Table head
    instrsPage += `
    <thead>
        <tr class="w3-light-grey">
    `
    for (let i = 0; i < selectedKeys.length; i++){
        let head = selectedKeys[i]
        instrsPage += '<th>' + head + '</th>'
    }
    instrsPage += '</tr></thead>'

    getInstrumentos()
    .then(instrumentos => {
        oldKey = '#text'
        newKey = 'text'
        // Table rows for each instrument
        instrumentos.forEach( i => {
            i[newKey] = i[oldKey]
            delete i[oldKey]
            instrsPage += '<tr>'
            instrsPage += '<td>' + i.id + '</td><td>' + i.text + '</td>'
            instrsPage += '</tr>'
        });
        // Final html
        instrsPage += '</table></div></body></html>'
        res.write(instrsPage)
        res.end()
    });
}

function generateMainPage(){
    var defaultRoute = "http://localhost:4000/";
    var subPages = ['alunos', 'cursos', 'instrumentos'];
    // Início da página
    var page = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de música</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body class="w3-container" style="background-color: rgb(30, 117, 74); color: white;">
            <h1 class="w3-center">Escola de música</h1>
            <div class="w3-row w3-margin-top" style="font-size: 18px;">`

    // Criação dos links
    for(let i = 0; i < 3; i++){
        page += `<div class="w3-col s4 w3-center">`
        var link = defaultRoute + subPages[i];
        var name = subPages[i]
        name = name.charAt(0).toUpperCase() + name.slice(1);
        page += `<p><a href="` + link + `">` + name + `</a></p>`
        page += '</div>'
    }

    // Fim da página
    page += `</div>
        </body>
    </html>
    `
    return page
}

myserver = http.createServer(function(req, res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var urlParsed = url.parse(req.url, true)
    var myurl = urlParsed.pathname
    var content = myurl.split("/")[1]
    var id = myurl.split("/")[2]
    if (myurl == "/"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(generateMainPage())
        res.end()
    }
    else if(id && content == "alunos"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateStudentPage(res, id)
    }
    else if(myurl == "/alunos"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateStudentsPage(res)
    }
    else if(id && content == "cursos"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateCursoPage(res, id)
    }
    else if(myurl == "/cursos"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateCursosPage(res)
    }
    else if(myurl == "/instrumentos"){
        console.log("Rota acedida com sucesso: " + myurl)
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateInstrumentosPage(res)
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end('<p>Rota não suportada: ' + req.url + '</p>')
    }
})

myserver.listen(4000)
console.log("Servidor à escuta na porta 4000...")