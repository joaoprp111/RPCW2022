var express = require('express');
var router = express.Router();
var axios = require('axios');
var {parse} = require('querystring');

/* GET home page (list of musics). */
router.get('/', function(req, res, next) {
  console.log('GET das músicas')
  axios.get("http://localhost:3000/musicas")
    .then(response => {
      var musics = response.data
      res.render('musics', {musics: musics});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

/* GET insert music page. */
router.get('/inserir', function(req, res, next) {
  console.log('Inserir música')
  res.render('form', {});
});

/* GET music page. */
router.get('/:id', function(req, res, next) {
  id = req.params.id
  console.log('GET da música com id ' + id)
  axios.get("http://localhost:3000/musicas?id=" + id)
    .then(response => {
      var musica = response.data[0]
      res.render('music', {m: musica});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

/* GET prov page. */
router.get('/prov/:prov', function(req, res, next) {
  prov = req.params.prov
  console.log('GET da província' + prov)
  axios.get("http://localhost:3000/musicas?prov=" + prov)
    .then(response => {
      var musics = response.data
      var provName = musics[0].prov
      res.render('prov', {musics: musics, prov: provName});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

/* POST music. */
router.post('/', function(req, res, next) {
  contentJson = req.body
  console.log('POST de uma música: ' + JSON.stringify(contentJson))
  axios.post('http://localhost:3000/musicas', contentJson)
  .then(resp => {
    res.redirect('/musicas');
  })
  .catch(erro => {
      res.render('error', {error: erro});
  })
});

module.exports = router;
