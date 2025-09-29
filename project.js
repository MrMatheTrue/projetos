$(document).ready(function () {
  
  var xmltoload;
  var numQuestao = 0;
  var arrQuestoes = [];
  var arrRespostasAluno = [];
  var arrRespostasCertasErradas = [];
  var arrRespostasCertasTipo3 = [];
  var tentativa = 0;
  var maxTentativas = 10000000;
  var idObjeto = 47;
  var notaMinima = 6;
  var indiceMultiplicadorNota = 1;
  var dataInicio;
  var totalMinutos = -1;
  var minutosRestante = -1;
  var segundosRestante = -1;
  var qLocked = "false";
  var tipoObjeto = "";
  var erroAvaliacaoIPED = false;
  var strValor = "";
  var topic_questions = "";
  var fullParameterURL;
  var ysnDesafioAmigo = false;
  var notaAtual;
  var global_config = { domainWebService: "https://wing.com.br/" };
  var matrizIPED = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  var autoFinalizacao = false;
  let allQuestionsValues = [];

  
  var submitGuard = false;              
  var submitSource = "none";            
  var timerExercicioId = null;          
  var readyClearedOnce = false;         
  // Força o navegador a não manter estado dos inputs no reload
  try { if (window.history && history.replaceState) history.replaceState({}, document.title, window.location.href); } catch(e) {}

  //START
  inicializaProjeto();

  //FUNÇÕES PRINCIPAIS
  function inicializaProjeto() {
    
    if (window.location.protocol + "//" + window.location.host != global_config.domainWebService) {
      global_config.domainWebService = window.location.protocol + "//" + window.location.host + "/";
    }

    $('select[name="colorpicker-shortlist"]').simplecolorpicker({ picker: true, theme: 'glyphicons' }).on('change', function () {
      checkColors($('select[name="colorpicker-shortlist"]').val());
    });

    fullParameterURL = getFullParameterURL();
    if (fullParameterURL.length == 0) fullParameterURL = "idNegocio=1&idObjeto=47&idLogin=4&token=t35t3";

    ysnDesafioAmigo = fullParameterURL.indexOf("&desafio=") > 0;

    if (ysnDesafioAmigo) {
      $('.main').append('<div id="logoDesafio" />');
      if (fullParameterURL.indexOf("&desafio=criar") > 0) {
        criaQuestaoDesafio();
        return;
      }
    }

    if (getURLParameter('idNegocio') == "1285") {
      $('select[name="colorpicker-shortlist"]').val('#ff887c');
      checkColors('#ff887c');
    }

    // GET
    xmltoload = global_config.domainWebService + "online/cs/LMS/MeusExercicios.aspx?" + fullParameterURL + "&ve=2";
    carregaDados(xmltoload);
  }

  function getFullParameterURL() {
    return window.location.search.substring(1);
  }

  function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) return sParameterName[1];
    }
    return 0;
  }

  
  function checkColors(color) {
    $('#logoDesafio').css('background-image', 'url(../leitor/imgs/desafioAmigo.png)');
    function setBase(h,f,txt,brd,btnA,btnP,bgLogo2){
      $('.header').css('background-color', h);
      $('.footer').css('background-color', f);
      $('.wrapper').css('color', txt);
      $('.checkradios-checkbox, .checkradios-radio').css({'color': txt,'border':'2px solid '+brd});
      $('input[type="text"]').css({'color': txt,'border':'1px solid '+brd});
      $('.anterior').removeClass('white black').addClass(btnA);
      $('.proximo').removeClass('white black').addClass(btnP||btnA);
      if(bgLogo2) $('#logoDesafio').css('background-image', 'url("../leitor/imgs/desafioAmigo2.png")');
    }
    if (color == "#ffffff") setBase('#300040','#300040','#454545','#333333','black','black',true);
    else if (color == "#5484ed") setBase('#2d4d94','#2d4d94','#FFF','#FFF','white');
    else if (color == "#a4bdfc") setBase('#576fad','#576fad','#454545','#454545','black');
    else if (color == "#46d6db") setBase('#268487','#268487','#454545','#454545','black');
    else if (color == "#7ae7bf") setBase('#338869','#338869','#454545','#454545','black');
    else if (color == "#51b749") setBase('#2c7127','#2c7127','#FFF','#FFF','white');
    else if (color == "#fbd75b") setBase('#9d8121','#9d8121','#454545','#454545','black','black',true);
    else if (color == "#ffb878") setBase('#9d693a','#9d693a','#454545','#454545','black','black',true);
    else if (color == "#ff887c") setBase('#9e4138','#9e4138','#454545','#454545','black');
    else if (color == "#dbadff") setBase('#5d2f81','#5d2f81','#454545','#454545','black');
    else if (color == "#e1e1e1") setBase('#828282','#828282','#454545','#454545','black','black',true);
    $(document.body).css('background-color', $('select[name="colorpicker-shortlist"]').val());
  }

  //aciona correção na revisão
  const observer = new MutationObserver((mutationsList, observerInst) => {
    const comentarioDiv = document.querySelector('.comentario');
    if (comentarioDiv) {
      observerInst.disconnect();
      if (comentarioDiv.innerHTML.trim() === '') {
        arrQuestoes = allQuestionsValues;
        getRespostasAluno();
        verCorrecaoF();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  //GET data
  function carregaDados(urlDados) {
    $.ajax({
      type: "GET",
      url: urlDados,
      dataType: "xml",
      cache: false,
      beforeSend: function () {
        myNotify("Por favor, aguarde...", 'info', false, 0);
      },
      error: function () {
        hideNotify();
        myNotify("Ops! Ocorreu um erro ao recuperar as perguntas deste exercício. Por favor, tente mais tarde.", 'error', false, 0);
      },
      success: function (xml) {
        hideNotify();
        strValor = $(xml).find('strValor').text();
        tipoObjeto = $(xml).find('tipoObjeto').text();
        topic_questions = $(xml).find('topic_questions').text();
        var totalError = parseInt($(xml).find('errors').children('total').text() || "0", 10);

        if (totalError) {
          var error = $(xml).find('errors').children('error').text();
          if (error.indexOf("ENSINAAI_OK") >= 0) {
            location.reload();
            return;
          }
          if (error.indexOf("antes de responder") > 0) {
            erroAvaliacaoIPED = true;
          } else {
            myNotify(error, 'error', true, 5000);
            setTimeout(sair, 2200);
          }
          return;
        }

        //reset estruturas
        numQuestao = 0;
        arrQuestoes = [];
        arrRespostasAluno = [];
        arrRespostasCertasErradas = [];
        arrRespostasCertasTipo3 = [];
        qLocked = "false";

        var titulo = $(xml).find('descricao').text();
        var totalQuestao = $(xml).find('questoes').find('questao').size();
        tentativa = parseInt($(xml).find('tentativa').text() || "0", 10);
        if ($(xml).find('maxTentativas').text()) maxTentativas = parseInt($(xml).find('maxTentativas').text() || "10000000", 10);
        notaMinima = parseInt($(xml).find('notaMinima').text() || "6", 10);
        if ($(xml).find('indiceMultiplicadorNota').text()) indiceMultiplicadorNota = parseInt($(xml).find('indiceMultiplicadorNota').text() || "1", 10);
        if (!indiceMultiplicadorNota) indiceMultiplicadorNota = 1;

        var strDataInicio = $(xml).find('dtmInicio').text();
        if (strDataInicio) dtmInicio = new Date(Date.parse(strDataInicio));

        var strTotalMinutos = $(xml).find('totalMinutos').text();
        if (strTotalMinutos) totalMinutos = parseFloat(strTotalMinutos);
        var strMinutosRestante = $(xml).find('minutosRestante').text();
        if (strMinutosRestante) minutosRestante = parseInt(strMinutosRestante, 10);
        var strSegundosRestante = $(xml).find('segundosRestante').text();
        if (strSegundosRestante) segundosRestante = parseInt(strSegundosRestante, 10);

        //monta quastão
        $(xml).find('questoes').find('questao').each(function () {
          numQuestao += 1;
          var questoes = {};
          var questao = {};
          var alternativa = [];
          var resposta = [];

          var pergunta = $(this).attr("strTxt");
          var idQuestao = $(this).attr("idQuestao");
          var tipoQuestao = $(this).attr("tipoQuestao");
          var formulaQuestao = $(this).attr("strFormula");
          var pesoQuestao = $(this).attr("intPeso");
          var locked = $(this).attr("locked");

          qLocked = locked;
          questao.id = idQuestao;
          questao.tipo = tipoQuestao;
          questao.pergunta = pergunta;
          questao.peso = pesoQuestao;
          questao.locked = locked;

          $(this).find("alternativa").each(function () {
            var txtAlternativa = $(this).attr("strTxt");
            var txtResposta = $(this).attr("strResposta");
            var idAlternativa = $(this).attr("idAlternativa");
            var strRespostaUser = $(this).attr("strRespostaUser");
            var comentarioCerta = $(this).attr("strComentarioCerto");
            var comentarioErrada = $(this).attr("strComentarioErrado");

            alternativa.push({
              id: idAlternativa,
              txtAlternativa: txtAlternativa,
              txtResposta: txtResposta,
              strRespostaUser: strRespostaUser,
              comentarioRespCerta: comentarioCerta,
              comentarioRespErrada: comentarioErrada
            });

            arrRespostasCertasErradas.push({
              id: idAlternativa,
              txtAlternativa: txtAlternativa,
              txtResposta: txtResposta,
              comentarioCerta: comentarioCerta,
              comentarioErrada: comentarioErrada
            });
          });

          $(this).find("resposta").each(function () {
            var txtResposta = $(this).attr("strResposta");
            var idResposta = $(this).attr("id");
            resposta.push({ id: idResposta, txtResposta: txtResposta });
          });

          questoes.questao = questao;
          questoes.alternativa = alternativa;
          questoes.formula = formulaQuestao;
          questoes.resposta = resposta;
          arrQuestoes.push(questoes);
        });

        //desenha questão
        geraQuestoes(arrQuestoes);
        allQuestionsValues = JSON.parse(JSON.stringify(arrQuestoes));

        $(".question").draggable({ helper: "clone" });
        $(".answer").droppable({
          drop: function (event, ui) {
            var id = $(this).attr('id').substring(1);
            var index = $(ui.draggable).attr('index');
            $('#t' + id).val(index);
            var answerDiv = $(this).parent();
            answerDiv.find('input').each(function () {
              var idInput = $(this).attr('id').substring(1);
              if (idInput != id) {
                if ($(this).val() == index) $(this).val("");
              }
            });
          }
        });

        $('.titulo-aula span').html(titulo);
        $('.header,.wrapper,.footer').show();

        //ajusta altura em telas pequenas
        var widthHtml = $(window).width();
        if (widthHtml <= 500) {
          let heightHtml = $(window).height();
          heightHtml = heightHtml - $('.footer').height() + 5;
          $('.wrapper').height(heightHtml + 'px');
        }

        //tentativas
        if (maxTentativas < 10000000) {
          let numRestTentativas = maxTentativas - tentativa + 1;
          if (numRestTentativas > 2)
            $('#divMaxTentativas').html('Você tem essa e mais ' + (numRestTentativas - 1) + ' tentativas pra responder esse exercício e tirar nota igual ou acima de ' + (notaMinima * indiceMultiplicadorNota));
          else if (numRestTentativas == 2)
            $('#divMaxTentativas').html('Você tem essa e mais 1 tentativa pra responder esse exercício e tirar nota igual ou acima de ' + (notaMinima * indiceMultiplicadorNota));
          else
            $('#divMaxTentativas').html('<b>Atenção! Você só tem mais essa tentativa pra responder esse exercício e tirar nota igual ou acima de ' + (notaMinima * indiceMultiplicadorNota) + '</b>');
          $('#divMaxTentativas').show();
        }

        if (ysnDesafioAmigo) {
          $('.titulo-aula p b').text('');
          $('#logoDesafio').css('top', ($('.header').height() + 20) + 'px');
        } else {
          checkTempoQuestao(); // inicia o tempo
        }
      },
      complete: function () {
        completeXML();
      }
    });
  }

  function hideNotify() {
    var $notify = $('.notifyjs-corner');
    var $note = $notify.children().first();
    $note.trigger('notify-hide');
  }

  //tempo/cronometro
  function checkTempoQuestao() {
    if (totalMinutos > 0) {
      var dtmExpira = new Date();
      dtmExpira = add_min_sec(dtmExpira, minutosRestante, segundosRestante);
      $("#divTempoExercicio").show();
      $('#depois').hide();
      timerTempoExercicio(dtmExpira);
    }
  }
  function add_min_sec(dt, minutes, sec) { return new Date(dt.getTime() + minutes * 60000 + sec * 1000); }

  function timerTempoExercicio(dtmExpira) {
    var countDownDate = dtmExpira.getTime();
    var now = new Date().getTime();
    var distance = countDownDate - now;

    //limpa timer anterior
    if (timerExercicioId) { try { clearInterval(timerExercicioId); } catch (e) {} }
    timerExercicioId = setInterval(function () {
      distance -= 1000;
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      var msgTempo = "Tempo para concluir esse exercício: ";
      var tempofinal = hours * 60 * 60 + minutes * 60 + seconds;

      if (tempofinal > 0 && tempofinal < 30) { piscarTempoExercicio(); msgTempo = "Seu tempo está acabando: "; }

      if (tempofinal > 0) {
        if (hours > 0)
          $("#divTempoExercicio").html(msgTempo + hours + ':' + (minutes <= 9 ? "0" + minutes : minutes) + ":" + (seconds <= 9 ? "0" + seconds : seconds));
        else
          $("#divTempoExercicio").html(msgTempo + (minutes <= 9 ? "0" + minutes : minutes) + ":" + (seconds <= 9 ? "0" + seconds : seconds));
      }

      if (distance <= 0) {
        try { clearInterval(timerExercicioId); } catch (e) { }
        $("#divTempoExercicio").html("00:00");

        //evita colisão com clique manual
        if (submitGuard || submitSource === "button") return; 
        submitSource = "timer";
        autoFinalizacao = true;       
        doSubmitCorrigir();           
      }
    }, 1000);
  }

  function piscarTempoExercicio() {
    $('#divTempoExercicio').css({ "font-size": "20px", "color": "#ff0000" });
    $("#divTempoExercicio").animate({ opacity: 0 }, 200, "linear", function () {
      $(this).animate({ opacity: 1 }, 200);
    });
  }

  //pós-carregamento UI
  function completeXML() {
    var width = $(window).width();
    var maxWidth = parseInt(width * 0.9);

    $(".anterior").off("click").on("click", function (e) {
      e.preventDefault();
      moveToPage(parseInt($(this).data('page')) - 1);
    });
    $(".proximo").off("click").on("click", function (e) {
      e.preventDefault();
      moveToPage(parseInt($(this).data('page')) + 1);
    });

    $('.checkradios').checkradios();

    //limita input número nas tipo 3
    for (var i = 0; i < arrQuestoes.length; i++) {
      var idQuestao = arrQuestoes[i].questao.id;
      var tipo = arrQuestoes[i].questao.tipo;
      if (tipo == 3)
        $('input[name=q' + idQuestao + ']').on('keydown', function (e) { -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault() });
    }

    $('.page_container').css({ 'max-width': maxWidth + 'px', 'width': maxWidth + 'px' });

    //inicial de botões/áreas
    $('.divNota,#novamente,#voltar,#deixar,#correcao').hide();

    if (ysnDesafioAmigo) {
      if (fullParameterURL.indexOf('&desafio=criar') > 0) {
        $('#salvar').show(); $('#corrigir').hide();
      } else {
        $('#salvar').hide(); $('#corrigir').show();
      }
      $('#voltar').show(); $('#depois').hide();
    } else {
      if (qLocked == "true") {
        $('#voltar').show(); $('#depois').hide(); $('#corrigir').hide();
      } else {
        if (totalMinutos <= 0) $('#depois').show();
        $('#corrigir').show();
      }
    }
    if (fullParameterURL.indexOf('noSair=1') > 0) { $('#voltar').hide(); $('#depois').hide(); }
    if (tipoObjeto == "IPED") { $('#depois').hide(); }

    if (erroAvaliacaoIPED) {
      $('.titulo-aula p').html("Avaliação Final");
      $('.header,.wrapper,.footer').show();
      $('#voltar').show();
      $('#depois,#corrigir,#novamente,#deixar,#correcao').hide();
      $("#main").append('<div class="page_container"></div>');
      $(".page_container").append('<h3>Ops! Você precisa visualizar todos os tópicos anteriores antes de responder a Avaliação Final.</h3>');
      hideNotify();
      setTimeout(sair, 6000);
      return;
    }

    if (qLocked !== "true") {
      clearUserInputs();
    }

    //proteção no hard refresh 
    if (!readyClearedOnce) {
      readyClearedOnce = true;
      if (qLocked !== "true") {
        setTimeout(clearUserInputs, 0);
      }
    }
  }

  function clearUserInputs() {
    try {
      // zera checkboxes
      $('input[type=radio], input[type=checkbox]').each(function () {
        $(this).prop('checked', false).prop('autocomplete', 'off');
      });
      // zera inputs text das questões de associação
      $('input[type=text]').each(function () {
        this.value = '';
        $(this).attr('autocomplete', 'off');
      });
    } catch (e) { }
  }

  //gera html questão
  function replaceAll(string, token, newtoken) {
    if (!string || string.length == 0) return "";
    while (string.indexOf(token) != -1) string = string.replace(token, newtoken);
    return string;
  }

  function geraQuestoes(arr) {
    var totalQuestao = arr.length;
    for (var i = 0; i < arr.length; i++) {
      var idQuestao = arr[i].questao.id;
      var pergunta = replaceAll(replaceAll(arr[i].questao.pergunta, '<p', '<span'), '</p>', '</span>');
      var locked = arr[i].questao.locked;
      var alternativas = "";
      var alternativas3 = "";
      var alternativas3_1 = "";
      var alternativa3Col1 = [];
      var alternativa3Col2 = [];

      for (var j = 0; j < arr[i].alternativa.length; j++) {
        var idAlternativa = arr[i].alternativa[j].id;
        var txtResposta = (arr[i].resposta.length > 0) ? arr[i].resposta[j].txtResposta : arr[i].alternativa[j].txtResposta;
        var txtAlternativa = arr[i].alternativa[j].txtAlternativa;
        var strRespostaUser = arr[i].alternativa[j].strRespostaUser;

        if (arr[i].questao.tipo == 1) {
          if (locked == "true") {
            if (strRespostaUser == "Ativado") {
              if (txtResposta == $.md5(idAlternativa + "CERTA"))
                alternativas += '<div class="divP"><input type="radio" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled checked><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#00FF00;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
              else
                alternativas += '<div class="divP"><input type="radio" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled checked><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#FF0000;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
            } else {
              if (txtResposta == $.md5(idAlternativa + "CERTA"))
                alternativas += '<div class="divP"><input type="radio" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#00FF00;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
              else
                alternativas += '<div class="divP"><input type="radio" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled><label for="r' + idQuestao + '' + idAlternativa + '">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
            }
          } else {
            //limpeza será reforçada em completeXML
            alternativas += '<div class="divP"><input type="radio" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '"><label for="r' + idQuestao + '' + idAlternativa + '">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
          }
        }
        else if (arr[i].questao.tipo == 2) {
          if (locked == "true") {
            if (strRespostaUser == "Ativado") {
              if (txtResposta == $.md5(idAlternativa + "CERTA"))
                alternativas += '<div class="divP"><input type="checkbox" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled checked><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#00FF00;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
              else
                alternativas += '<div class="divP"><input type="checkbox" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled checked><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#FF0000;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
            } else {
              if (txtResposta == $.md5(idAlternativa + "CERTA"))
                alternativas += '<div class="divP"><input type="checkbox" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled><label for="r' + idQuestao + '' + idAlternativa + '" style="color:#FF0000;">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
              else
                alternativas += '<div class="divP"><input type="checkbox" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '" disabled><label for="r' + idQuestao + '' + idAlternativa + '">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
            }
          } else {
            alternativas += '<div class="divP"><input type="checkbox" name="r' + idQuestao + '" id="r' + idQuestao + '' + idAlternativa + '" value="' + idAlternativa + '" class="checkradios" index="' + (i + 1) + '"><label for="r' + idQuestao + '' + idAlternativa + '">' + replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>') + '</label></div>';
          }
        }
        else if (arr[i].questao.tipo == 3) {
          var ysnCorreto = ($.md5(arr[i].alternativa[j].id + arr[i].alternativa[j].strRespostaUser.toUpperCase()) == arr[i].alternativa[j].txtResposta);
          alternativa3Col1.push({ idAlternativa: idAlternativa, index: (j + 1), txtAlternativa: replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>'), resposta: strRespostaUser, locked: locked, ysnCorreto: ysnCorreto });
          alternativa3Col2.push({ idAlternativa: idAlternativa, idQuestao: idQuestao, resposta: txtResposta });
        }
      }

      var classBtOcultaAnt = "";
      var classBtOcultaProx = "";
      if (ysnDesafioAmigo || totalQuestao == 1) {
        classBtOcultaAnt = "hideBT";
        classBtOcultaProx = "hideBT";
      } else {
        if (i == 0) classBtOcultaAnt = "hideBT";
        else if ((i + 1) == totalQuestao) classBtOcultaProx = "hideBT";
      }

      //comentário
      var comentarioHTML = '';
      if (locked == "true") {
        if (arr[i].questao.tipo == "2") {
          var comentarios = [];
          for (var k = 0; k < arr[i].alternativa.length; k++) {
            var alt = arr[i].alternativa[k];
            if (alt.strRespostaUser === "Ativado") {
              var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
              var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
              comentarios.push(comentario);
            }
          }
          if (comentarios.length > 0) {
            if (comentarios.length === 2 && comentarios[0] === comentarios[1]) comentarioHTML = '<div class="comentario">' + comentarios[0] + '</div>';
            else comentarioHTML = '<div class="comentario">' + comentarios.join(' / ') + '</div>';
          }
        } else {
          for (var k = 0; k < arr[i].alternativa.length; k++) {
            var alt = arr[i].alternativa[k];
            if (alt.strRespostaUser === "Ativado") {
              var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
              var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
              if (comentario && comentario.includes("#acervo#")) {
                var partes = comentario.split("#acervo#");
                var htmlAntes = partes[0];
                var acervoId = partes[1].trim();
                var idLogin = new URLSearchParams(window.location.search).get("idLogin");
                var token = new URLSearchParams(window.location.search).get("token");
                var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId + "&idLogin=" + idLogin + "&token=" + token;
                comentarioHTML = '<div class="comentario">' + htmlAntes
                  + '<div id="acervo-placeholder-' + acervoId + '" style="margin-top:1vw;">'
                  + '<img src="./imgs/playBtn.png" class="acervo-play-btn" data-url="' + acervoUrl + '" style="cursor:pointer;" alt="Play vídeo do acervo"/>'
                  + '</div></div>';
              } else if (comentario && comentario.startsWith("acervo#")) {
                var acervoId2 = comentario.split("#")[1].trim();
                var idLogin2 = new URLSearchParams(window.location.search).get("idLogin");
                var token2 = new URLSearchParams(window.location.search).get("token");
                var acervoUrl2 = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId2 + "&idLogin=" + idLogin2 + "&token=" + token2;
                comentarioHTML = '<div class="comentario" id="acervo-placeholder-' + acervoId2 + '">'
                  + '<img src="./imgs/playBtn.png" class="acervo-play-btn" data-url="' + acervoUrl2 + '" style="cursor:pointer;" alt="Play vídeo do acervo"/>'
                  + '</div>';
              } else {
                comentarioHTML = '<div class="comentario">' + (comentario || '') + '</div>';
              }
              break;
            }
          }
        }
      }

      if (arr[i].questao.tipo == 1 || arr[i].questao.tipo == 2) {
        var header = (totalQuestao == 1) ? '<h3>' + pergunta + '</h3>' : '<h3>' + (i + 1) + '/' + totalQuestao + ' - ' + pergunta + '</h3>';
        $('.main').append('<div class="section page' + i + '"><div class="page_container">' + header + '<div class="resposta">' + alternativas + '</div>' + comentarioHTML + '<div class="buttons"><a href="#" data-page="' + i + '" class="button ' + classBtOcultaAnt + ' black anterior">ANTERIOR</a><a href="#" data-page="' + i + '" class="button ' + classBtOcultaProx + ' black proximo">PR&Oacute;XIMA</a></div></div></div>');
      } else {
        var styleQuestion = '';
        for (var a = 0; a < alternativa3Col1.length; a++) {
          styleQuestion = '';
          if (alternativa3Col1[a].locked == "true") {
            styleQuestion = alternativa3Col1[a].ysnCorreto ? ' style="color:#00FF00;" ' : ' style="color:#FF0000;" ';
          }
          alternativas3 += '<div ' + styleQuestion + 'class="question" id="q' + alternativa3Col1[a].idAlternativa + '" index="' + alternativa3Col1[a].index + '"><div class="divP">' + alternativa3Col1[a].index + ' - ' + alternativa3Col1[a].txtAlternativa + '</div></div>';
        }
        for (var b = 0; b < alternativa3Col2.length; b++) {
          var flag = false;
          for (var c = 0; c < alternativa3Col1.length; c++) {
            if (alternativa3Col2[b].resposta == alternativa3Col1[c].resposta) {
              if (alternativa3Col1[c].locked == "true") {
                alternativas3_1 += '<div class="answer" id="a' + alternativa3Col2[b].idAlternativa + '" val="' + alternativa3Col2[b].resposta + '"><div class="divP"><input type="text" disabled id="t' + alternativa3Col2[b].idAlternativa + '" name="q' + alternativa3Col2[b].idQuestao + '" maxlength="1" value="' + alternativa3Col1[c].index + '" />' + alternativa3Col2[b].resposta + '</div></div>';
              } else {
                alternativas3_1 += '<div class="answer" id="a' + alternativa3Col2[b].idAlternativa + '" val="' + alternativa3Col2[b].resposta + '"><div class="divP"><input type="text" id="t' + alternativa3Col2[b].idAlternativa + '" name="q' + alternativa3Col2[b].idQuestao + '" maxlength="1" value="' + alternativa3Col1[c].index + '" />' + alternativa3Col2[b].resposta + '</div></div>';
              }
              flag = true;
              break;
            }
          }
          if (!flag)
            alternativas3_1 += '<div class="answer" id="a' + alternativa3Col2[b].idAlternativa + '" val="' + alternativa3Col2[b].resposta + '"><div class="divP"><input type="text" id="t' + alternativa3Col2[b].idAlternativa + '" name="q' + alternativa3Col2[b].idQuestao + '" maxlength="1" />' + alternativa3Col2[b].resposta + '</div></div>';
        }
        $('.main').append('<div class="section page' + i + '"><div class="page_container"><h3>' + (i + 1) + '/' + totalQuestao + ' - ' + pergunta + '</h3><div class="resposta"><div id="questionDiv-' + idQuestao + '" class="questionDiv">' + alternativas3 + '</div><div id="answerDiv-' + idQuestao + '" class="answerDiv">' + alternativas3_1 + '</div></div><div class="buttons"><a href="#" data-page="' + i + '" class="button ' + classBtOcultaAnt + ' black anterior">ANTERIOR</a><a href="#" data-page="' + i + '" class="button ' + classBtOcultaProx + ' black proximo">PR&Oacute;XIMA</a></div></div></div>');
      }
    }

    //play do acervo
    $(document).off('click.acervo').on('click.acervo', '.acervo-play-btn', function () {
      var $img = $(this);
      var url = $img.data('url');
      var $placeholder = $img.parent();
      $placeholder.html('<p class="comentarioMsg">Carregando vídeo…</p>');
      $.get(url)
        .done(function (data) {
          if (!data.isError && data.uriEmbed) {
            $placeholder.html('<iframe src="' + data.uriEmbed + '" frameborder="0" class="comentarioIframe" allowfullscreen width="100%" height="400px"></iframe>');
          } else {
            $placeholder.html('<p style="color:red;">Erro ao carregar o vídeo.</p>');
          }
        })
        .fail(function () { $placeholder.html('<p style="color:red;">Falha na conexão.</p>'); });
    });
  }

  //navegação
  function moveToPage(intPage) {
    var top = $('.page' + (intPage))[0].offsetTop - $('.wrapper')[0].offsetTop;
    $('.wrapper').animate({ scrollTop: top }, 600);
  }

  //resposta aluno
  function getRespostasAluno() {
    arrRespostasAluno = [];
    var respostaVazia = [];
    var totalRespondido = 0;

    for (var i = 0; i < arrQuestoes.length; i++) {
      var idQuestao = arrQuestoes[i].questao.id;
      var tipoQuestao = arrQuestoes[i].questao.tipo;

      if (tipoQuestao == 1) {
        var respostaAluno = ($('input[name=r' + idQuestao + ']:checked').val());
        if (respostaAluno != undefined) {
          totalRespondido++;
          $('input[name=r' + idQuestao + ']').each(function () {
            if (respostaAluno == $(this).val())
              arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "Ativado", idQuestao: idQuestao, status: "Ativado" });
            else
              arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "Desativado", idQuestao: idQuestao, status: "Desativado" });
          });
        } else {
          $('input[name=r' + idQuestao + ']').each(function () {
            arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "", idQuestao: idQuestao, status: "vazio" });
          });
          respostaVazia.push((i + 1));
        }
      }
      else if (tipoQuestao == 2) {
        var respostaAluno2 = [];
        $('input[name=r' + idQuestao + ']:checked').each(function () { respostaAluno2.push($(this).val()); });
        if (respostaAluno2.length > 0) {
          totalRespondido++;
          $('input[name=r' + idQuestao + ']').each(function () {
            var flag = (respostaAluno2.indexOf($(this).val()) >= 0);
            if (flag)
              arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "Ativado", idQuestao: idQuestao, status: "Ativado" });
            else
              arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "Desativado", idQuestao: idQuestao, status: "Desativado" });
          });
        } else {
          $('input[name=r' + idQuestao + ']').each(function () {
            arrRespostasAluno.push({ id: $(this).val(), tipo: tipoQuestao, resposta: "", idQuestao: idQuestao, status: "vazio" });
          });
          respostaVazia.push((i + 1));
        }
      }
      else if (tipoQuestao == 3) {
        $('input[name=q' + idQuestao + ']').each(function () {
          if ($(this).val() != "") {
            totalRespondido++;
            var respostaSelecionada = $(this).parent().parent().attr('val');
            var index = $(this).val();
            $('#questionDiv-' + idQuestao).find('.question').each(function () {
              if ($(this).attr('index') == index) {
                var perguntaID = $(this).attr('id').substring(1, $(this).attr('id').length);
                arrRespostasAluno.push({ id: perguntaID, resposta: respostaSelecionada, tipo: tipoQuestao, idQuestao: idQuestao, index: index });
              }
            });
          } else {
            $('#questionDiv-' + idQuestao).find('.question').each(function () {
              var perguntaID = $(this).attr('id').substring(1, $(this).attr('id').length);
              arrRespostasAluno.push({ id: perguntaID, resposta: "", tipo: tipoQuestao, idQuestao: idQuestao });
            });
            respostaVazia.push((i + 1));
          }
        });
      }
    }
    return { respostas: arrRespostasAluno, vazio: respostaVazia, totalRespondido: totalRespondido };
  }

  //botoes
  $('#deixar').click(function () { window.parent.removerPlayer(50); });
  $("#voltar").click(function () { window.parent.removerPlayer(); });

  
  var corrigindo = false;

  $("#corrigir").off('click').on("click", function (e) {
    e && e.preventDefault();

    //cronômetro
    submitSource = "button";
    autoFinalizacao = false; 
    doSubmitCorrigir();
  });

  function doSubmitCorrigir() {
    if (corrigindo || submitGuard) return;
    corrigindo = true;
    submitGuard = true;

    var isIped = (tipoObjeto.toUpperCase() == "IPED") ? true : false;
    var respostas = getRespostasAluno();
    var arrRespostasAlunoLoc = respostas.respostas;
    var respVazia = respostas.vazio;

    //se for autoFinalizacao,ignora vazias; se botão, exige todas
    var corrigir = autoFinalizacao ? true : (respVazia.length == 0);

  if (!corrigir) {
  if (respVazia.length == 1) {
    myNotify("Ops! Uma questão não foi respondida. É necessário responder todas as questões para solicitar a correção.", 'warning', true, 5000);
    moveToPage(respVazia[0] - 1);
  } else if (respVazia.length > 1) {
    myNotify("Ops! Algumas questões não foram respondidas. É necessário responder todas as questões para solicitar a correção.", 'warning', true, 5000);
    moveToPage(respVazia[0] - 1);
  }
  //nao pausa o timer
  corrigindo = false;
  submitGuard = false;
  submitSource = "none";
  return;
  }

  // anti post duplo
   if (timerExercicioId) {
  try { clearInterval(timerExercicioId); } catch (e) {}
  timerExercicioId = null;
  }


    //cálculo de nota por questão
    var media = [];
    for (var i = 0; i < arrQuestoes.length; i++) {
      var idQuestao = arrQuestoes[i].questao.id;
      var tipoQuestao = arrQuestoes[i].questao.tipo;
      var peso = arrQuestoes[i].questao.peso;
      var formulaQuestao = arrQuestoes[i].formula;
      var alternativasQuestao = arrQuestoes[i].alternativa;
      var totalAlternativas = arrQuestoes[i].alternativa.length;
      var certa = 0, errada = 0;

      for (var j = 0; j < alternativasQuestao.length; j++) {
        var idAlternativa = alternativasQuestao[j].id;
        for (var a = 0; a < arrRespostasAlunoLoc.length; a++) {
          var idAlternativaAluno = arrRespostasAlunoLoc[a].id;
          if (idAlternativaAluno == idAlternativa) {
            if (tipoQuestao < 3) {
              var status = arrRespostasAlunoLoc[a].status;
              var resposta = alternativasQuestao[j].txtResposta;
              if (status == "Ativado") {
                if (resposta == $.md5(alternativasQuestao[j].id + "CERTA")) certa++;
                else errada++;
              } else if (status == "Desativado") {
                if (resposta == $.md5(alternativasQuestao[j].id + "ERRADA")) certa++;
                else errada++;
              }
            } else {
              var respostaAluno = arrRespostasAlunoLoc[a].resposta;
              var resposta = alternativasQuestao[j].txtResposta;
              if ($.md5(alternativasQuestao[j].id + respostaAluno.toUpperCase()) == resposta) certa++;
              else errada++;
            }
          }
        }
      }
      if (tipoQuestao == "1") {
        if (certa != totalAlternativas) { certa = 0; errada = totalAlternativas; }
      }
      var fq = formulaQuestao.replace("certas", certa).replace("erradas", errada).replace("total", totalAlternativas);
      var t = eval(fq); t = Number(t).toFixed(2);
      if (t <= 0) media.push({ idQuestao: idQuestao, nota: 0, peso: peso });
      else if (t > 10) media.push({ idQuestao: idQuestao, nota: 10, peso: peso });
      else media.push({ idQuestao: idQuestao, nota: Number(t), peso: peso });
    }

    for (var x = 0; x < media.length; x++) {
      var idQ = media[x].idQuestao;
      for (var a = 0; a < arrRespostasAlunoLoc.length; a++) {
        if (idQ == arrRespostasAlunoLoc[a].idQuestao) arrRespostasAlunoLoc[a].nota = media[x].nota;
      }
    }

    var strParam = "";
    notaAtual = 0;
    var params = {};
    for (var a = 0; a < arrRespostasAlunoLoc.length; a++) {
      strParam += arrRespostasAlunoLoc[a].id + "|" + arrRespostasAlunoLoc[a].resposta + "|" + (arrRespostasAlunoLoc[a].nota || 0) + ";";
    }
    strParam = strParam.substring(0, strParam.length - 1);

    var sumPeso = 0;
    for (var y = 0; y < media.length; y++) sumPeso += parseInt(media[y].peso || "0", 10);
    for (var y2 = 0; y2 < media.length; y2++) {
      var notaPeso = media[y2].nota * (sumPeso ? (media[y2].peso / sumPeso) : 0);
      notaAtual += notaPeso;
    }
    notaAtual = Number(notaAtual.toFixed(2));
    if (notaAtual > 10) notaAtual = 10;

    params["Param"] = strParam;
    params["tentativa"] = tentativa;
    params["notafinal"] = notaAtual;
    params["tokenNF"] = $.md5(notaAtual + '.' + tentativa);

    var percentual = 100;
    if (notaAtual >= notaMinima) params["percentual"] = "100";
    else { percentual = parseInt(notaAtual, 10) * 10; params["percentual"] = percentual; }

    var urlAction = global_config.domainWebService + 'online/cs/LMS/SaveAlternativas.aspx?' + fullParameterURL + "&" + $.param(params);

    try { window.parent.addReenviaPasso({ urlAction: urlAction, percentual: percentual }); } catch (e) { }

    //IPED
    if ((tipoObjeto || '').toUpperCase() == "IPED") {
      var arrRespostasAlunoIPED = [];
      arrRespostasAlunoLoc.forEach(function (item) {
        if (item.resposta == "Ativado") arrRespostasAlunoIPED.push({ "question_id": item.idQuestao, "question_response": item.id.slice(-1) });
      });
      let idCurso = getURLParameter("idCurso");
      let idAula = getURLParameter("idAula");
      let idObjetoURL = getURLParameter("idObjeto");
      let idLogin = getURLParameter("idLogin");
      let token = getURLParameter("token");
      let configIPED = strValor.split("#");
      let course_id = configIPED[1];
      let topic_index = configIPED[2];

      $.ajax({
        type: "POST",
        url: `https://wing.com.br/online/cs/LMS/CorrigirIPED.aspx?token=${token}&idLogin=${idLogin}&course_id=${course_id}&topic_index=${topic_index}`,
        data: { respostasAluno: JSON.stringify(arrRespostasAlunoIPED) },
        cache: false,
        beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 15000); },
        error: function () {
          hideNotify();
          myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
          corrigindo = false; submitGuard = false; submitSource = "none";
        },
        success: function (json) {
          hideNotify();
          let status = json.Code;
          if (status !== 200 && status !== 300) {
            myNotify(json.Error, 'error', true, 7500);
            corrigindo = false; submitGuard = false; submitSource = "none";
          } else if (status === 300) {
            // ajuda
            $('.main').fadeOut(200, function () {
              corrigindo = false; submitGuard = false; submitSource = "none";
              const notaZero = 0;
              $('#divTempoExercicio').hide();
              $('.divNota').fadeIn(200);
              $('#depois,#corrigir').hide();
              $('#voltar').show();
              $('#correcao').hide();
              $('#novamente').hide();
              mostraNota(notaZero, true);
              if (fullParameterURL.indexOf('noSair=1') > 0) { $('#voltar,#depois').hide(); }
            });
          } else {
            // monta payload
            let fakeResult = json;
            let resultadoIPED = {
              "IdCurso": idCurso,
              "IdAula": idAula,
              "idObjetoEnsinoFK": idObjetoURL,
              "idLoginFK": idLogin,
              "NotaFinal": parseFloat((fakeResult.Data.percentage / 10) * indiceMultiplicadorNota),
              "Percentual": fakeResult.Data.percentage,
              "Tentativas": tentativa
            };
            let arrQuestaoIPED = [];
            let arrDesempenhoIPED = [];
            fakeResult.Data.question_responses.forEach(function (item, index) {
              let respostaCorreta = matrizIPED[item];
              let arrQuestao = arrQuestoes[index];
              let strQuestao = arrQuestao.questao.pergunta;
              let idQuestao = arrQuestao.questao.id;
              let arrAlternativas = arrQuestao.alternativa;
              let arrAlternativasIPED = [];
              arrAlternativas.forEach(function (itemAlternativa) {
                let idAlternativa = itemAlternativa.id;
                let strAlternativa = itemAlternativa.txtAlternativa;
                let numAlteranativa = idAlternativa.slice(-1);
                let strResposta = (numAlteranativa == respostaCorreta) ? "CERTA" : "ERRADA";
                arrAlternativasIPED.push({ "IdAlternativaIPED": idAlternativa, "StrAlternativa": strAlternativa, "StrResposta": strResposta });
              });
              arrQuestaoIPED.push({ "IdQuestaoIPED": idQuestao, "StrQuestao": strQuestao, "Alternativas": arrAlternativasIPED });
            });
            let questao = -1;
            let ultimaQuestao = 0;
            respostas.respostas.forEach(function (item) {
              if (ultimaQuestao != item.idQuestao) { ultimaQuestao = item.idQuestao; questao = questao + 1; }
              let respostaCorreta = matrizIPED[fakeResult.Data.question_responses[questao]];
              let numAlteranativa = item.id.slice(-1);
              arrDesempenhoIPED.push({ "IdAlternativaIPED": item.id, "Nota": ((numAlteranativa == respostaCorreta) && (item.resposta == "Ativado")) ? 10 : 0, "StrResposta": item.resposta });
            });
            let arrQuestoesAcertos = [];
            arrDesempenhoIPED.forEach(function (item) { if (item.Nota === 10) arrQuestoesAcertos.push(item.IdAlternativaIPED.slice(0, -1)); });
            arrQuestoesAcertos.forEach(function (root) {
              arrDesempenhoIPED.forEach(function (it) { if (it.IdAlternativaIPED.indexOf(root) >= 0) it.Nota = 10; });
            });
            resultadoIPED.Questoes = arrQuestaoIPED;
            resultadoIPED.Respostas = arrDesempenhoIPED;

            $.ajax({
              type: "POST",
              contentType: "application/json; charset=utf-8",
              url: global_config.domainWebService + "online/cs/LMS/exerciciosIPED.aspx?" + fullParameterURL,
              data: JSON.stringify(resultadoIPED),
              cache: false,
              beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 10000); },
              error: function () {
                hideNotify();
                myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
                corrigindo = false; submitGuard = false; submitSource = "none";
              },
              success: function (xml2) {
                hideNotify();
                var xml_error = $(xml2).find('total').text();
                if (parseInt(xml_error || "0", 10) > 0) {
                  var xml_error_msg = $(xml2).find('error').text();
                  myNotify(xml_error_msg, 'error', true, 5000);
                  setTimeout(sair, 2200);
                } else {
                  const nfinal = resultadoIPED.NotaFinal;
                  $('.main').fadeOut(200, function () {
                    corrigindo = false; submitGuard = false; submitSource = "none";
                    $('#divTempoExercicio').hide();
                    $('.divNota').fadeIn(200);
                    $('#depois,#corrigir').hide();
                    $('#voltar').show();
                    $('#correcao').show();
                    if (nfinal < notaMinima) $('#novamente').show(); else $('#novamente').hide();
                    mostraNota(nfinal, true);
                    if (fullParameterURL.indexOf('noSair=1') > 0) { $('#voltar,#depois').hide(); }
                  });
                }
              }
            });
          }
        }
      });
    } else {
      //fluxo não-IPED
      $.ajax({
        type: "POST",
        url: global_config.domainWebService + "online/cs/LMS/SaveAlternativas.aspx?" + fullParameterURL,
        data: params,
        cache: false,
        beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 10000); },
        error: function () {
          myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
          corrigindo = false; submitGuard = false; submitSource = "none";
        },
        success: function (xml) {
          hideNotify();
          var totalError = parseInt($(xml).find('errors').children('total').text() || "0", 10);
          if (totalError) {
            var error = $(xml).find('errors').children('error').text();
            myNotify(error, 'error', true, 5000);
            corrigindo = false; submitGuard = false; submitSource = "none";
            return;
          }
          var arrObjsAlterados = [];
          $(xml).find("objetosAlterados").each(function () {
            arrObjsAlterados.push({
              idObjeto: $(this).find("idObjeto").text(),
              percentual: $(this).find("percentual").text(),
              notafinal: $(this).find("notafinal").text(),
            });
          });
          try { window.parent.ajustaVariavelMenu(arrObjsAlterados); } catch (e) { }

          $('.main').fadeOut(200, function () {
            corrigindo = false; submitGuard = false; submitSource = "none";
            if (ysnDesafioAmigo) {
              $('#corrigir').hide();
              $('#voltar').show();
              $('#desafioUtil,#desafiobtNao,#desafiobtSim').show();
              verCorrecaoF();
            } else {
              $('#divTempoExercicio').hide();
              $('.divNota').fadeIn(200);
              $('#depois,#corrigir').hide();
              $('#voltar').show();
              $('#correcao').show();
              if (notaAtual < notaMinima) $('#novamente').show(); else $('#novamente').hide();
              mostraNota(notaAtual);
            }
            if (fullParameterURL.indexOf('noSair=1') > 0) { $('#voltar,#depois').hide(); }
          });
        }
      });
    }
  }

  //
  $("#depois").off('click').on("click", function (e) {
    e && e.preventDefault();
    var respostas = getRespostasAluno();
    var arrRespostasAlunoLoc = respostas.respostas;
    if (respostas.totalRespondido == 0 || ysnDesafioAmigo) { sair(); return; }
    var strParam = "";
    var params = {};
    for (var a = 0; a < arrRespostasAlunoLoc.length; a++) {
      strParam += arrRespostasAlunoLoc[a].id + "|" + arrRespostasAlunoLoc[a].resposta + "|-1;";
    }
    strParam = strParam.substring(0, strParam.length - 1);
    params["Param"] = strParam;
    params["tentativa"] = tentativa;
    params["percentual"] = "0";

    $.ajax({
      type: "POST",
      url: global_config.domainWebService + "online/cs/LMS/SaveAlternativas.aspx?" + fullParameterURL,
      data: params,
      dataType: "xml",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: false,
      beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 1000); },
      error: function () { myNotify("Ops! Ocorreu um erro ao salvar as respostas deste exercício. Por favor, tente mais tarde.", 'error', true, 5000); },
      success: function (xml) {
        var totalError = parseInt($(xml).find('errors').children('total').text() || "0", 10);
        if (totalError) {
          var error = $(xml).find('errors').children('error').text();
          myNotify(error, 'error', true, 5000);
        } else {
          var arrObjsAlterados = [];
          $(xml).find("objetosAlterados").each(function () {
            arrObjsAlterados.push({
              idObjeto: $(this).find("idObjeto").text(),
              percentual: $(this).find("percentual").text(),
              notafinal: $(this).find("notafinal").text()
            });
          });
          try { window.parent.removerPlayerObjs(arrObjsAlterados); } catch (e) { }
        }
      }
    });
  });

  $("#novamente").click(function () {
    tentativa++;
    $('.main').empty();
    arrQuestoes = [];
    var xmltoload2 = global_config.domainWebService + "online/cs/LMS/MeusExercicios.aspx?" + fullParameterURL + "&ve=2";
    carregaDados(xmltoload2);
    $('.divNota').fadeOut('300', function () {
      $('.divNota').empty();
      $('.main').fadeIn('300');
    });
  });

  //correção
  function mostraNota(nota, iped = false) {
    var notaT = nota * indiceMultiplicadorNota;
    $('.divNota').empty();
    if (nota >= notaMinima) {
      let msgRespostas = '<p>Veja suas respostas certas e erradas clicando no botão "Ver Correção" abaixo.</p>';
      if (nota == 10) msgRespostas = '<p>Veja suas respostas clicando no botão "Ver Correção" abaixo.</p>';
      if (getURLParameter('idNegocio') == "6496") { msgRespostas = ''; $("#correcao").remove(); }
      $('#novamente,#deixar').hide();
      $('.divNota').append('<h3 style="color:#00FF00">Parabéns! Você tirou ' + notaT + ' neste exercício.</h3>' + msgRespostas);
      $('#divMaxTentativas').hide();
    } else {
      if (iped) {
        $('.divNota').append('<h3 style="color:#FF0000">Ops! Você não obteve a média mínima na Avaliação Final.</h3><p>Alguns tópicos precisam ser revistos no curso.</p>');
        if (maxTentativas < 10000000) {
          let numRestTentativas = maxTentativas - tentativa;
          if (numRestTentativas > 1) $('#divMaxTentativas').html('Não foi dessa vez! Você tem mais ' + numRestTentativas + ' tentativas pra responder esse exercício.');
          else if (numRestTentativas == 1) $('#divMaxTentativas').html('Não foi desta vez! Você só tem <b>mais 1 tentativa</b> pra responder esse exercício.');
          else { $('#novamente').hide(); $('#divMaxTentativas').html('Não foi desta vez! Seu exercício foi finalizado com esta sua última nota'); }
          $('#divMaxTentativas').show();
        }
      } else {
        if (getURLParameter('idNegocio') == "6496") {
          $('.divNota').append('<h3 style="color:#FF0000">Ops! Sua nota foi ' + notaT + ' neste exercício.</h3>');
          $("#correcao").remove();
        } else {
          $('.divNota').append('<h3 style="color:#FF0000">Ops! Sua nota foi ' + notaT + ' neste exercício.</h3><p>Veja suas respostas clicando no botão "Ver Correção" abaixo.</p>');
        }
        if (maxTentativas < 10000000) {
          let numRestTentativas2 = maxTentativas - tentativa;
          if (numRestTentativas2 > 1) $('#divMaxTentativas').html('Não foi dessa vez! Você tem mais ' + numRestTentativas2 + ' tentativas pra responder esse exercício e tirar nota igual ou acima de ' + (notaMinima * indiceMultiplicadorNota));
          else if (numRestTentativas2 == 1) $('#divMaxTentativas').html('Não foi desta vez! Você só tem <b>mais 1 tentativa</b> pra responder esse exercício e tirar nota igual ou acima de ' + (notaMinima * indiceMultiplicadorNota));
          else { $('#novamente').hide(); $('#divMaxTentativas').html('Não foi desta vez! Seu exercício foi finalizado com esta sua última nota'); }
          $('#divMaxTentativas').show();
        }
      }
    }
    var divNotaW = $('.divNota').width();
    var divNotaH = $('.divNota').height();
    var windowW = $(window).width();
    var windowH = $(window).height();
    $('.divNota').css('left', (windowW / 2) - (divNotaW / 2));
    $('.divNota').css('top', (windowH / 2) - (divNotaH / 2));
  }

  $("#correcao").off('click').on("click", function () { verCorrecaoF(); });

  function verCorrecaoF() {
  for (var i = 0; i < arrQuestoes.length; i++) {
    var idQuestao = arrQuestoes[i].questao.id;
    var tipoQuestao = arrQuestoes[i].questao.tipo;

    // alguma alternativa dessa questão foi marcada?
    var anyMarked = arrRespostasAluno.some(function (r) {
      return r.idQuestao == idQuestao && r.status === "Ativado";
    });

    //finaliza por cronômetro?
    var isTimerSubmit =
      (typeof submitSource !== "undefined" && submitSource === "timer") ||
      autoFinalizacao === true;

    var alternativasQuestao = arrQuestoes[i].alternativa;
    var pergunta = replaceAll(
      replaceAll(arrQuestoes[i].questao.pergunta, "<p", "<span"),
      "</p>",
      "</span>"
    );

    //comentários
    var comentarioHTML = "";
    var comentarios = [];
    for (var k = 0; k < alternativasQuestao.length; k++) {
      var alt = alternativasQuestao[k];
      var marcouEsta = arrRespostasAluno.some(function (r) {
        return r.id === alt.id && r.status === "Ativado";
      });
      if (marcouEsta) {
        var isCertaAlt = alt.txtResposta === $.md5(alt.id + "CERTA");
        var comentario = isCertaAlt ? alt.comentarioRespCerta : alt.comentarioRespErrada;
        if (comentario) comentarios.push(comentario);
      }
    }
    if (comentarios.length > 0) {
      comentarioHTML =
        '<div class="comentario">' +
        (comentarios.length === 2 && comentarios[0] === comentarios[1]
          ? comentarios[0]
          : comentarios.join(" / ")) +
        "</div>";
    }

    //Pinta acertos/erros
    for (var j = 0; j < alternativasQuestao.length; j++) {
      var idAlternativa = alternativasQuestao[j].id;

      for (var a = 0; a < arrRespostasAluno.length; a++) {
        var idAlternativaAluno = arrRespostasAluno[a].id;
        if (idAlternativaAluno != idAlternativa) continue;

        if (tipoQuestao < 3) {
          var status   = arrRespostasAluno[a].status; 
          var resposta = alternativasQuestao[j].txtResposta; 
          var isCerta  = (resposta === $.md5(alternativasQuestao[j].id + "CERTA"));

          //labels
          var $lbl1 = $('#r' + idAlternativa).parent().parent().find("label");
          var $lbl2 = $('#r' + idQuestao + idAlternativa).parent().parent().find("label");

          if (!anyMarked && isTimerSubmit) {
            if (isCerta) {
              $lbl1.css("color", "#FF0000");
              $lbl2.css("color", "#FF0000");
            }
          } else {
            
            if (notaAtual >= notaMinima || (tentativa + 1) > maxTentativas) {
              
              if (anyMarked && isCerta) {
                $lbl1.css("color", "#00FF00");
                $lbl2.css("color", "#00FF00");
              }
              
              if (status === "Ativado" && !isCerta) {
                $lbl1.css("color", "#FF0000");
                $lbl2.css("color", "#FF0000");
              }
            } else {
              
              if (status === "Ativado") {
                if (isCerta) {
                  $lbl1.css("color", "#00FF00");
                  $lbl2.css("color", "#00FF00");
                } else {
                  $lbl1.css("color", "#FF0000");
                  $lbl2.css("color", "#FF0000");
                }
              }
            }
          }
        } else {
          
          var respostaAluno = arrRespostasAluno[a].resposta;
          var respostaT3 = alternativasQuestao[j].txtResposta;
          if ($.md5(alternativasQuestao[j].id + respostaAluno.toUpperCase()) === respostaT3) {
            $('#q' + idAlternativa).css("color", "#00FF00");
          } else {
            $('#q' + idAlternativa).css("color", "#FF0000");
          }
        }
      }
    }

    $('.page' + i + ' .page_container').append(comentarioHTML);
  }

  $("input").each(function () {
    $(this).prop("disabled", true);
  });

  $('.divNota').fadeOut(200, function () {
    $('.divNota .page_container').text("");
    $('.main').fadeIn(200);
    $("#correcao").hide();
  });

  //handler do play do acervo
  $(document).on('click', '.acervo-play-btn', function(){
    var $img = $(this);
    var url  = $img.data('url');
    var $ph  = $img.parent();
    $ph.html('<p class="comentarioMsg">Carregando vídeo…</p>');
    $.get(url)
      .done(function(data){
        if (!data.isError && data.uriEmbed) {
          $ph.html(
            '<iframe src="' + data.uriEmbed + '" frameborder="0" class="comentarioIframe" allowfullscreen width="100%" height="400px"></iframe>'
          );
        } else {
          $ph.html('<p style="color:red;">Erro ao carregar o vídeo.</p>');
        }
      })
      .fail(function(){
        $ph.html('<p style="color:red;">Falha na conexão.</p>');
      });
     });
    }


  //desafio amigo
  function criaQuestaoDesafio() {
    criaQuestao();
    $('.titulo-aula span').text("Criando um Desafio Amigo");
    $('.header,.wrapper,.footer').show();
    $('.titulo-aula p b').text('Desafio Amigo: ');
    $('#logoDesafio').css('top', ($('.header').height() + 20) + 'px');
    completeXML();
  }

  $("#salvar").click(function () {
    var strPergunta = $('#pergunta').val();
    var strAlternativa0 = $('#alt0').val();
    var strAlternativa1 = $('#alt1').val();
    var strAlternativa2 = $('#alt2').val();
    if (!strPergunta) { myNotify("Por favor, escreva uma pergunta", 'error', true, 3000); $('#pergunta').focus(); return; }
    if (!strAlternativa0) { myNotify("Por favor, escreva sua reposta correta", 'error', true, 3000); $('#alt0').focus(); return; }
    if (!strAlternativa1) { myNotify("Por favor, escreva uma resposta errada", 'error', true, 3000); $('#alt1').focus(); return; }
    if (!strAlternativa2) { myNotify("Por favor, escreva outra resposta errada", 'error', true, 3000); $('#alt2').focus(); return; }

    $('#salvar').unbind('click');
    var urlAction = global_config.domainWebService + 'online/cs/LMS/SaveDesafio.aspx?' + fullParameterURL;
    $.ajax({
      type: "POST",
      url: urlAction,
      data: { pergunta: strPergunta, alternativa0: strAlternativa0, alternativa1: strAlternativa1, alternativa2: strAlternativa2 },
      dataType: "xml",
      beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 1000); },
      error: function () { myNotify("Ops! Não foi possível salvar o seu desafio. Por favor, tente mais tarde.", 'error', true, 3000); },
      success: function (xml) {
        var totalError = parseInt($(xml).find('errors').children('total').text() || "0", 10);
        if (totalError) {
          var error = $(xml).find('errors').children('error').text();
          myNotify(error, 'error', true, 5000);
        } else {
          myNotify("Desafio criado com sucesso", 'info', true, 2000);
          setTimeout(sair, 2100);
        }
      }
    });
  });

  $("#desafiobtNao").click(function () {
    $('#desafiobtNao').unbind('click');
    var urlAction = global_config.domainWebService + 'online/cs/LMS/InativaDesafio.aspx?' + fullParameterURL;
    $.ajax({
      type: "POST",
      url: urlAction,
      dataType: "xml",
      beforeSend: function () { myNotify("Por favor, aguarde...", 'info', true, 1000); },
      error: function () { console.log('Erro ao inativar desafio'); },
      success: function (xml) {
        var totalError = parseInt($(xml).find('errors').children('total').text() || "0", 10);
        if (totalError) {
          var error = $(xml).find('errors').children('error').text();
          console.log('Erro ao inativar desafio: ' + error);
        }
        sair();
      }
    });
  });
  $("#desafiobtSim").click(function () { sair(); });

  function sair() { try { window.parent.removerPlayer(); } catch (e) { console.log('Sair...'); } }

  $(window).resize(function () { ajustaWrapper(); });
  function ajustaWrapper() {
    var headerH = $('.header').height();
    $('.wrapper').height('calc(100% - ' + headerH + 'px - 55px)');
  }

  function criaQuestao() {
    var alternativas = '<div class="divP"><div class="comentsA">Escreva aqui a resposta correta:</div><input type="radio" id="r0" class="checkradios" disabled checked><input type="text" id="alt0" maxlength="50" class="inputAlternativa"></div>';
    alternativas += '<div class="divP"><div class="comentsA">Escreva abaixo as respostas erradas:</div><input type="radio" id="r1" class="checkradios" disabled><input type="text" id="alt1" class="inputAlternativa"></div>';
    alternativas += '<div class="divP"><input type="radio" id="r2" class="checkradios" disabled><input type="text" id="alt2" class="inputAlternativa"></div>';
    $('.main').append('<div class="section page0"><div class="page_container"><h3><div class="comentsP">Escreva aqui a sua pergunta:</div><input type="text" id="pergunta" maxlength="50" class="inputPergunta"></h3><div class="resposta">' + alternativas + '</div><div class="buttons"><a href="#" data-page="0" class="button hideBT black anterior">ANTERIOR</a><a href="#" data-page="0" class="button hideBT black proximo">PR&Oacute;XIMA</a></div></div></div>');
  }

  //Zoom fonte
  var currFont = parseInt($(".main").css("font-size"));
  $("#zoomin").click(function () { currFont += 1; $(".main").css("font-size", currFont); });
  $(".zoomOff").click(function () { $(".main").css("font-size", "16px"); });
  $("#zoomout").click(function () { currFont -= 1; $(".main").css("font-size", currFont); });

  $(window).on('beforeunload', function () {
    if (qLocked !== "true") { try { clearUserInputs(); } catch (e) { } }
  });
});
