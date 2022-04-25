function escreverPara(p){
    let novoPara = '<tr id="' + p._id + '">'
    novoPara += '<td>' + p.data + '</td>'
    novoPara += '<td id="para' + p._id + '">' + p.para + '</td>'
    //Editar
    novoPara += '<td>'
    novoPara += '<button id="' + p._id + '" class="editar w3-btn w3-blue w3-round-large w3-padding-small">Editar</button>'
    novoPara += '</td>'
    //Eliminar
    novoPara += '<td>'
    novoPara += '<button id="' + p._id + '" class="eliminar w3-btn w3-red w3-round-large w3-padding-small">Eliminar</button>'
    novoPara += '</td>'
    novoPara += '</tr>'

    return novoPara
}

$(function(){
    var paraEmEdicao = {}

    $.get('http://localhost:7709/paras', function(data){
        //alert('GET')
        data.forEach(p => {
            $("#paragrafos").append(escreverPara(p));
        });
    })

    $("#paragrafos").on("click",".editar", function(event){
        let target = event.target
        let id = target.getAttribute('id')
        //alert(id)
        //alert("Pedido de edição")
        var url = 'http://localhost:7709/paras/editar?id=' + id
        //alert(url)
        $.get(url, function(data){
            $("#myParaForm #input").val(data.para)
            $("#myParaForm #inserir").val("Editar")
            paraEmEdicao = data
        })
    });

    $("#paragrafos").on("click",".eliminar", function(event){
        let target = event.target
        let id = target.getAttribute('id')

        $.ajax({
            url: "http://localhost:7709/paras?id=" + id,
            method: "DELETE",
            success: function(){
                $("#" + id).remove()
            },
            async: false
        })
        //alert("Registo removido!")
    });

    $("#inserir").click(function(){
        var tipoOperacao = $("#inserir").val()
        //alert(tipoOperacao)
        if(tipoOperacao == 'Editar'){
            paraEmEdicao.para = $("#input").val()
            //alert(JSON.stringify(paraEmEdicao))
            $.ajax({
                url: "http://localhost:7709/paras/",
                method: "PUT",
                data: JSON.stringify(paraEmEdicao),
                contentType: "application/json; charset=utf-8",
                success: function(){
                    //alert('sucesso')
                    $("#para" + paraEmEdicao._id).text(paraEmEdicao.para)
                },
                async: false
            });
            //alert("Registo editado!")
        } else {
            $.post("http://localhost:7709/paras", $("#myParaForm").serialize())

            var d = new Date()
            d = d.toISOString().substring(0,16)
            let novoPara = '<tr>'
            novoPara += '<td>' + d + '</td>'
            novoPara += '<td>' + $("#input").val() + '</td>'
            //Editar
            novoPara += '<td>'
            novoPara += '<button class="editar w3-btn w3-blue w3-round-large w3-padding-small">Editar</button>'
            novoPara += '</td>'
            //Eliminar
            novoPara += '<td>'
            novoPara += '<button class="eliminar w3-btn w3-red w3-round-large w3-padding-small">Eliminar</button>'
            novoPara += '</td>'
            novoPara += '</tr>'
            $("#input").val("");
            $("#inserir").val("Novo parágrafo");
        }
    });
});