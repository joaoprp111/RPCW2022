var Para = require('../models/para');

module.exports.listar = function(){
    return Para
        .find()
        .exec()
}

module.exports.lookUp = function(id){
    return Para
        .findOne({_id: id})
        .exec()
}

module.exports.inserir = function(p){
    var d = new Date()
    p.data = d.toISOString().substring(0,16)
    var novo = new Para(p)
    return novo.save()
}

module.exports.atualizar = function(id,para){
    return Para
        .replaceOne({_id: id}, para)
        .exec()
}

module.exports.remover = function(id){
    return Para
        .deleteOne({_id: id})
        .exec()
}