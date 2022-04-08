var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

const apiKey = fs.readFileSync('./apikey.txt',{encoding:'utf-8', flag:'r'})

router.get('/classes/:id', function(req, res) {
  id = req.params.id
  axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + id + '?apikey=' + apiKey)
    .then(response => {
      var classe = response.data
      console.log('GET da página da classe ' + id)
      if (classe.nivel === 3){
        console.log('Classe de nível 3')
        axios.get('http://clav-api.di.uminho.pt/v2/classes/c' + id + '/procRel?apikey=' + apiKey)
          .then(response => {
            processosRel = response.data.filter(function (obj) {
              return obj.idRel == 'eCruzadoCom' || 
                obj.idRel == 'eComplementarDe' || obj.idRel == 'eSuplementoDe'
                || obj.idRel == 'eSuplementoPara';
            });
            res.render('classe', {title: 'Classe', c: classe, relacionados: processosRel});
          })
          .catch(function(error){
            res.render('error', {error: error});
          });
      } else {
        res.render('classe', {title: 'Classe', c: classe, relacionados: []});
      }
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

/* GET home page. */
router.get(/\/(classes)?$/, function(req, res) {
  axios.get('http://clav-api.di.uminho.pt/v2/classes?estrutura=arvore&nivel=1&apikey=' + apiKey)
    .then(response => {
      var classes = response.data
      var quantidade = classes.length
      console.log('GET das classes nível 1')
      res.render('index', {title: 'Home', cs: classes, q: quantidade});
    })
    .catch(function(error){
      res.render('error', {error: error});
    });
});

module.exports = router;
