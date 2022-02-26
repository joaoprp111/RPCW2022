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
        fs.readFile('./html/' + id + '.html', function(err, data){
            if(err){
                res.writeHead(404)
            }else{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else if (myurl == "/filmes"){
        fs.readFile('./html/index.html', function(err, data){
            if(err){
                res.writeHead(404)
            }else{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else if (myurl == "/atores"){
        fs.readFile('./html/atores.html', function(err, data){
            if(err){
                res.writeHead(404)
            }else{
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(data)
            }
            res.end()
        })
    }
    else{
        res.writeHead(404)
        res.end()
    }
})

myserver.listen(7777)
console.log("Servidor à escuta na porta 7777...")