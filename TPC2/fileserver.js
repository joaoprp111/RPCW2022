var http = require('http')
var url = require('url')
var fs = require('fs')

myserver = http.createServer(function(req, res) {
    console.log('Chegou um pedido: ' + req.url)
    var myurl = url.parse(req.url, true).pathname
    var movieId = myurl.split("/")[2]
    if (movieId){
        fs.readFile('./html/' + movieId + '.html', function(err, data){
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
    else{
        res.writeHead(404)
        res.end()
    }
})

myserver.listen(7777)
console.log("Servidor à escuta na porta 7777...")