var express = require('express');
var router = express.Router();
var url = require('url');
var Para = require('../controllers/para');

/* GET to edit paragraph. */
router.get('/paras/editar', function(req, res) {
  console.log('GET dos parágrafos')
  var urlObj = url.parse(req.url, true);
  var queryString = urlObj.query
  var id = queryString.id
  console.log('Chegou um id para editar um parágrafo ' + id)
  Para.lookUp(id)
    .then(para => {
      res.status(202).jsonp(para)
    })
    .catch(erro => {
      res.status(502).jsonp({erro: erro})
    })  
}); 

/* GET home page. */
router.get('/paras', function(req, res) {
  console.log('GET dos parágrafos')
  Para.listar()
    .then(dados => {
      res.status(200).jsonp(dados)
    })
    .catch(erro => {
      res.status(500).jsonp({erro: erro})
    })  
});

/* POST paragraph. */
router.post('/paras', function(req, res) {
  console.log("Dados: " + JSON.stringify(req.body))
  Para.inserir(req.body)
    .then(dados => {
      res.status(201).jsonp(dados)
    })
    .catch(erro => {
      res.status(501).jsonp({erro: erro})
    })  
});

/* PUT paragraph. */
router.put('/paras', function(req, res) {
  console.log("Dados atualizados: " + JSON.stringify(req.body))
  Para.atualizar(req.body._id, req.body)
    .then(dados => {
      console.log(dados)
      res.status(203).jsonp(dados)
    })
    .catch(erro => {
      res.status(503).jsonp({erro: erro})
    })  
});

/* DELETE paragraph. */
router.delete('/paras', function(req, res) {
  var urlObj = url.parse(req.url, true);
  var queryString = urlObj.query
  var id = queryString.id
  console.log("Remoção do elemento com id: " + id)
  Para.remover(id)
    .then(dados => {
      res.status(204).jsonp(dados)
    })
    .catch(erro => {
      res.status(504).jsonp({erro: erro})
    })
});

module.exports = router;
