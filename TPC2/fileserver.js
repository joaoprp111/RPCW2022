var http = require('http')
var url = require('url')
var fs = require('fs')

myserver = http.createServer(function(req, res) {
    console.log('Chegou um pedido: ' + req.url)
    var myurl = url.parse(req.url, true).pathname
    var content = myurl.split("/")[1]
    var id = myurl.split("/")[2]
    var substr = ""
    if (id){
        substr = id.substring(0,1)
    }
    if (id && ((content == "filmes" && substr == "f") || (content == "atores" && substr == "a"))){
        fs.readFile('./generatedHtml/' + id + '.html', function(err, data){
            if(err){
                res.writeHead(404)
                console.log('Erro no pedido da página de um filme ou ator!')
            }else{
                console.log('Página ' + id + ' fornecida com sucesso!')
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else if (myurl == "/filmes"){
        fs.readFile('./generatedHtml/filmes.html', function(err, data){
            if(err){
                console.log('Erro no pedido da página de filmes!')
                res.writeHead(404)
            }else{
                console.log('Página de filmes fornecida com sucesso!')
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else if (myurl == "/atores"){
        fs.readFile('./generatedHtml/atores.html', function(err, data){
            if(err){
                console.log('Erro no pedido da página de atores!')
                res.writeHead(404)
            }else{
                console.log('Página de atores fornecida com sucesso!')
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else{
        console.log('Erro: Rota ' + myurl +' não permitida...')
        res.writeHead(404)
        res.end()
    }
})

myserver.listen(7777)
console.log("Servidor à escuta na porta 7777...")