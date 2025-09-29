	$(document).ready(function(){
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
	var global_config = {
		'domainWebService': 'https://wing.com.br/'
	}
	var matrizIPED = {
		"a":1,
	    "b":2,
	    "c":3,
	    "d":4,
	    "e":5
	}
	let allQuestionsValues = [];
	//
	inicializaProjeto();
	//
	function inicializaProjeto() {
		//
		if (window.location.protocol+'//'+window.location.host != global_config.domainWebService)
			global_config.domainWebService = window.location.protocol+'//'+window.location.host + '/';

		$('select[name="colorpicker-shortlist"]').simplecolorpicker({picker: true, theme: 'glyphicons'}).on('change', function() {
			checkColors($('select[name="colorpicker-shortlist"]').val());
		});
		fullParameterURL = getFullParameterURL();
		if (fullParameterURL.length == 0)
			fullParameterURL = "idNegocio=1&idObjeto=47&idLogin=4&token=t35t3";
		ysnDesafioAmigo = fullParameterURL.indexOf('&desafio=') > 0;

		if (ysnDesafioAmigo){
			$('.main').append('<div id="logoDesafio" />');
			if (fullParameterURL.indexOf('&desafio=criar') > 0){
				criaQuestaoDesafio();
				return;
			}
		}
		if (getURLParameter('idNegocio')=="1285"){
			$('select[name="colorpicker-shortlist"]').val('#ff887c');
			checkColors('#ff887c');
		}
		//addCSSClient(getURLParameter('idNegocio')); // Não dá pq muda a cor do body...
		var xmltoload = global_config.domainWebService + "online/cs/LMS/MeusExercicios.aspx?"+fullParameterURL+"&ve=2";
		carregaDados(xmltoload);
	}

	function getFullParameterURL() {
		var sPageURL = window.location.search.substring(1);
		return sPageURL;
	}

	function getURLParameter(sParam) {
		//
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			//
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				//
				return sParameterName[1];
			}
		}
		//
		return 0;
	}
	
	//
	function checkColors(color) {
		//
		$('#logoDesafio').css('background-image', 'url(../leitor/imgs/desafioAmigo.png)');
		if (color == "#ffffff") {
			//
			$('.header').css('background-color', '#300040');
			$('.footer').css('background-color', '#300040');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#333333');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #333333');
			$('input[type="text"]').css('color', '#333333');
			$('input[type="text"]').css('border', '1px solid #333333');
			$('.anterior').removeClass('black').addClass('black');
			$('.proximo').removeClass('black').addClass('black');
			$('#logoDesafio').css('background-image', 'url("../leitor/imgs/desafioAmigo2.png")');
		}
		else if (color == "#5484ed") {
			//
			$('.header').css('background-color', '#2d4d94');
			$('.footer').css('background-color', '#2d4d94');
			$('.wrapper').css('color', '#FFF');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#FFF');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #FFF');
			$('input[type="text"]').css('color', '#FFF');
			$('input[type="text"]').css('border', '1px solid #FFF');
			$('.anterior').removeClass('black').addClass('white');
			$('.proximo').removeClass('black').addClass('white');
		}
		else if (color == "#a4bdfc") {
			//
			$('.header').css('background-color', '#576fad');
			$('.footer').css('background-color', '#576fad');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
		}
		else if (color == "#46d6db") {
			//
			$('.header').css('background-color', '#268487');
			$('.footer').css('background-color', '#268487');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
		}
		else if (color == "#7ae7bf") {
			//
			$('.header').css('background-color', '#338869');
			$('.footer').css('background-color', '#338869');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
		}
		else if (color == "#51b749") {
			//
			$('.header').css('background-color', '#2c7127');
			$('.footer').css('background-color', '#2c7127');
			$('.wrapper').css('color', '#FFF');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#FFF');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #FFF');
			$('input[type="text"]').css('color', '#FFF');
			$('input[type="text"]').css('border', '1px solid #FFF');
			$('.anterior').removeClass('black').addClass('white');
			$('.proximo').removeClass('black').addClass('white');
		}
		else if (color == "#fbd75b") {
			//
			$('.header').css('background-color', '#9d8121');
			$('.footer').css('background-color', '#9d8121');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
			$('#logoDesafio').css('background-image', 'url("../leitor/imgs/desafioAmigo2.png")');
		}
		else if (color == "#ffb878") {
			//
			$('.header').css('background-color', '#9d693a');
			$('.footer').css('background-color', '#9d693a');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
			$('#logoDesafio').css('background-image', 'url("../leitor/imgs/desafioAmigo2.png")');
		}
		else if (color == "#ff887c") {
			//
			$('.header').css('background-color', '#9e4138');
			$('.footer').css('background-color', '#9e4138');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
		}
		else if (color == "#dbadff") {
			//
			$('.header').css('background-color', '#5d2f81');
			$('.footer').css('background-color', '#5d2f81');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
		}
		else if (color == "#e1e1e1") {
			//
			$('.header').css('background-color', '#828282');
			$('.footer').css('background-color', '#828282');
			$('.wrapper').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('color', '#454545');
			$('.checkradios-checkbox, .checkradios-radio').css('border', '2px solid #454545');
			$('input[type="text"]').css('color', '#454545');
			$('input[type="text"]').css('border', '1px solid #454545');
			$('.anterior').removeClass('white').addClass('black');
			$('.proximo').removeClass('white').addClass('black');
			$('#logoDesafio').css('background-image', 'url("../leitor/imgs/desafioAmigo2.png")');
		}
		
		$(document.body).css('background-color', $('select[name="colorpicker-shortlist"]').val());
	}

	const observer = new MutationObserver((mutationsList, observer) => {
		const comentarioDiv = document.querySelector('.comentario');
		if (comentarioDiv) {
			observer.disconnect() // para de observar
			// só chama se estiver vazia
			if (comentarioDiv.innerHTML.trim() === '') {
				// joga a cópia pronta pra arrQuestoes
				arrQuestoes = allQuestionsValues;
				getRespostasAluno();
				verCorrecaoF();
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true })

	// ++++++++++++++++++
	function carregaDados(urlDados) {
		$.ajax({
			type: "GET",
			url: urlDados,
			dataType: "xml",
			cache: false,
			beforeSend : function(){
				myNotify("Por favor, aguarde...", 'info', false, 0);
			},
			error: function(){
				hideNotify();
	            myNotify("Ops! Ocorreu um erro ao recuperar as perguntas deste exercício. Por favor, tente mais tarde.", 'error', false, 0);
	        },
			success: function (xml) {
				hideNotify();
				strValor = $(xml).find('strValor').text();
				tipoObjeto = $(xml).find('tipoObjeto').text();
				topic_questions = $(xml).find('topic_questions').text();
				var totalQuestao = $(xml).find('totalQuestoes').text();
				var totalError = $(xml).find('errors').children('total').text();
			    totalError = parseInt(totalError);
			    //
			    if (totalError){
			    	var error = $(xml).find('errors').children('error').text();
			    	//console.log(xml);
					// Se tiver o código "ENSINAAI_OK" no erro, significa que o novo conteúdo está no banco e que é para atualizar a página
					if (error.indexOf("ENSINAAI_OK") >= 0) {
						//
						location.reload();
					}
			    	// Verifica se o erro retornado é do IPED e se o erro é da Avaliação Final (aluno precisa assistir todas as aulas antes de fazer a prova)
			    	// Texto retornado do IPED: "Você precisa visualizar todos os tópicos anteriores antes de responder a Avaliação Final."
			    	if (error.indexOf("antes de responder") > 0) {
			    		//
			    		erroAvaliacaoIPED = true;
			    	}
			    	else {
			    		//
				    	myNotify(error, 'error', true, 5000);
				    	setTimeout(sair, 2200);
			    	}
				} else {
					numQuestao = 0;
					arrQuestoes = [];
					arrRespostasAluno = [];
					arrRespostasCertasErradas = [];
					arrRespostasCertasTipo3 = [];
					qLocked = "false";
					var titulo = $(xml).find('descricao').text();
					var totalQuestao = $(xml).find('questoes').find('questao').size();
					tentativa = parseInt($(xml).find('tentativa').text());
					if ($(xml).find('maxTentativas').text())
						maxTentativas = parseInt($(xml).find('maxTentativas').text());
					notaMinima = parseInt($(xml).find('notaMinima').text());
					if ($(xml).find('indiceMultiplicadorNota').text())
						indiceMultiplicadorNota = parseInt($(xml).find('indiceMultiplicadorNota').text());
					if (!indiceMultiplicadorNota)
						indiceMultiplicadorNota = 1;
					var strDataInicio = $(xml).find('dtmInicio').text();
					if (strDataInicio)
						dtmInicio = new Date(Date.parse(strDataInicio));
					var strTotalMinutos = $(xml).find('totalMinutos').text();
					if (strTotalMinutos)
						totalMinutos = parseFloat(strTotalMinutos);
					var strMinutosRestante = $(xml).find('minutosRestante').text();
					if (strMinutosRestante)
						minutosRestante = parseInt(strMinutosRestante);
					var strSegundosRestante = $(xml).find('segundosRestante').text();
					if (strSegundosRestante)
						segundosRestante = parseInt(strSegundosRestante);
	
					$(xml).find('questoes').find('questao').each(function(){
						//
						numQuestao += 1;
						//
						var questoes = {};
						var questao = {};
						var alternativa = [];
						var resposta = [];
						var arrRespCert = [];
						var arrRespCertTip3 = [];
						var pergunta = $(this).attr("strTxt");
						var idQuestao = $(this).attr("idQuestao");
						var tipoQuestao = $(this).attr("tipoQuestao");
						var formulaQuestao = $(this).attr("strFormula");
						var pesoQuestao = $(this).attr("intPeso");
						var locked = $(this).attr("locked");
						
						
						//
						qLocked = locked;
						questao.id = idQuestao;
						questao.tipo = tipoQuestao;
						questao.pergunta = pergunta;
						questao.peso = pesoQuestao;
						questao.locked = locked;
						//
						$(this).find("alternativa").each(function(){
							//
							var txtAlternativa 		 = $(this).attr("strTxt");
							var txtResposta 		 = $(this).attr("strResposta");
							var idAlternativa 	 	 = $(this).attr("idAlternativa");
							var strRespostaUser 	 = $(this).attr("strRespostaUser");
							var comentarioCerta		 = $(this).attr("strComentarioCerto");
							var comentarioErrada 	 = $(this).attr("strComentarioErrado");
							//
							alternativa.push({id:idAlternativa, txtAlternativa:txtAlternativa, txtResposta:txtResposta, strRespostaUser:strRespostaUser, comentarioRespCerta:comentarioCerta, comentarioRespErrada:comentarioErrada});
							//
							arrRespostasCertasErradas.push({id:idAlternativa, txtAlternativa:txtAlternativa, txtResposta:txtResposta, comentarioCerta, comentarioErrada});
						});
						//
						$(this).find("resposta").each(function(){
							//
							var txtResposta = $(this).attr("strResposta");
							var idResposta =  $(this).attr("id");
							//
							resposta.push({id: idResposta, txtResposta: txtResposta});
							//
						});
						//
						questoes.questao = questao;
						questoes.alternativa = alternativa;
						questoes.formula = formulaQuestao;
						questoes.resposta = resposta;
						//
						arrQuestoes.push(questoes);
						/*
						if (tipoQuestao == 1 || tipoQuestao == 2) {
							//
							$('.main').append('<section class="page'+numQuestao+'"><div class="page_container"><h3>'+numQuestao+'/'+totalQuestao+' - '+pergunta+'</h3><div class="resposta">'+alternativas+'</div></div></section>');
						}
						else {
							//
							$('.main').append('<section class="page'+numQuestao+'"><div class="page_container"><h3>'+numQuestao+'/'+totalQuestao+' - '+pergunta+'</h3><div class="resposta"><div id="questionDiv'+numQuestao+'" class="questionDiv">'+alternativas3+'</div><div id="answerDiv'+numQuestao+'" class="answerDiv">'+alternativas3_1+'</div></div></div></section>');
						}
						*/
						//
					});
					//
					//console.log(arrQuestoes);
					geraQuestoes(arrQuestoes);
					
					allQuestionsValues = JSON.parse(JSON.stringify(arrQuestoes));

					$( ".question" ).draggable({ helper: "clone" });
					//
					$( ".answer" ).droppable({
						drop: function( event, ui ) {
							//
							//alert($(ui.draggable).attr('id'));
							var id = $(this).attr('id').substring(1); // ID da resposta
							var id2 = $(ui.draggable).attr('id').substring(1); // ID da pergunta
							var index = $(ui.draggable).attr('index');
							//
							$('#t'+id).val(index);
							
							var answerDiv = $(this).parent();
							answerDiv.find('input').each(function(){
								//
								var idInput = $(this).attr('id').substring(1);
								//
								if (idInput != id) {
									//
									if ($(this).val() == index) {
										//
										$(this).val("");
									}
								}
								//alert($(this).attr('id'))
							})
							//alert(id);
							
						  }
					 });
					//
					$('.titulo-aula span').html(titulo);
					$('.header').show();
					$('.wrapper').show();
					$('.footer').show();
					var widthHtml = $( window ).width();
					if (widthHtml <= 500){
						let heightHtml = $( window ).height();
						heightHtml = heightHtml - $('.footer').height() + 5;
						$('.wrapper').height(heightHtml + 'px');
					}
					
					if (maxTentativas < 10000000){
						let numRestTentativas = maxTentativas - tentativa + 1;
						if (numRestTentativas > 2)
							$('#divMaxTentativas').html('Você tem essa e mais '+(numRestTentativas-1)+' tentativas pra responder esse exercício e tirar nota igual ou acima de '+(notaMinima*indiceMultiplicadorNota));
						else if (numRestTentativas == 2)
							$('#divMaxTentativas').html('Você tem essa e mais 1 tentativa pra responder esse exercício e tirar nota igual ou acima de '+(notaMinima*indiceMultiplicadorNota));
						else
							$('#divMaxTentativas').html('<b>Atenção! Você só tem mais essa tentativa pra responder esse exercício e tirar nota igual ou acima de '+(notaMinima*indiceMultiplicadorNota)+'</b>');
						$('#divMaxTentativas').show();
					}
					if (ysnDesafioAmigo){
						$('.titulo-aula p b').text('');
						$('#logoDesafio').css('top', ($('.header').height() + 20) +'px');
					}else
						checkTempoQuestao();
				}
			},
			complete: function() {
				completeXML();
			}
		});
	}

	function hideNotify() {
		var $notify = $('.notifyjs-corner');
		var $note = $notify.children().first();
		$note.trigger('notify-hide');
	}

	function checkTempoQuestao(){
		if (totalMinutos > 0){
			//var dtmExpira = add_minutes(dtmInicio, totalMinutos);
			var dtmExpira = new Date();
			dtmExpira = add_min_sec(dtmExpira, minutosRestante, segundosRestante);
			$("#divTempoExercicio").show();
			$('#depois').hide();
			timerTempoExercicio(dtmExpira);
		}
	}

	function add_minutes(dt, minutes) {
    	return new Date(dt.getTime() + minutes*60000);
	}

	function add_seconds(dt, seconds) {
    	return new Date(dt.getTime() + seconds*1000);
	}

	function add_min_sec(dt, minutes, sec) {
    	return new Date(dt.getTime() + minutes*60000 + sec*1000);
	}

	//var timerExercicio;
	function timerTempoExercicio(dtmExpira){
		
		var countDownDate = dtmExpira.getTime();
		var now = new Date().getTime();
		var distance = countDownDate - now;

		
		var timerExercicio = setInterval(function() {
			distance-=1000;

			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			var msgTempo = "Tempo para concluir esse exercício: ";
			var tempofinal = hours * 60 * 60 + minutes * 60 + seconds;
			
			if (tempofinal > 0 && tempofinal < 30){
				piscarTempoExercicio();
		 		msgTempo = "Seu tempo está acabando: ";
		 	}

		 	if (tempofinal > 0){
		 		if (hours > 0)
		 			$("#divTempoExercicio").html(msgTempo+hours + ':' + (minutes <= 9 ? "0" + minutes : minutes) +  ":" + (seconds <= 9 ? "0" + seconds : seconds));
		 		else
		 			$("#divTempoExercicio").html(msgTempo+(minutes <= 9 ? "0" + minutes : minutes) +  ":" + (seconds <= 9 ? "0" + seconds : seconds));
		 	}

		 	if (distance <= 0) {
		 		clearInterval(timerExercicio);
		 		$('.footer-buttons').empty().html('<label id="lblTempoEsgotado">Seu tempo acabou! Entre em contato com a sua instituição de ensino.</label>');
		 	}
		 }, 1000);
	}

	function piscarTempoExercicio(){
		$('#divTempoExercicio').css("font-size", "20px");
		$('#divTempoExercicio').css("color", "#ff0000");
		$("#divTempoExercicio").animate({opacity:0},200,"linear",function(){
		  $(this).animate({opacity:1},200);
		});
	}

	function zoomObj(obj){
		scale = 2;
		var w = parseFloat(obj.outerWidth()); 
		var h = parseFloat(obj.outerHeight());
		var l = parseFloat(obj.css('left'));
		var t = parseFloat(obj.css('top'));
		obj.animate({
		    width: w*scale,
		    height: h*scale,
		    left: l + -(((w*scale) - w)/2),
		    top: t + -(((h*scale) - h)/2)
		  }, 400, function(){
		  	obj.animate({
				width: w,
				height: h,
				left: l,
				top: t
			  }, 400, function(){
			  	obj.outerWidth(w);
			  	obj.outerHeight(h);
			  });
		});
	}

	function completeXML(){
		//
		var width = $(window).width();
		var maxWidth = parseInt(width * 0.9); // 80% de tamanho máximo
		
		/*$('.main').fullpage({
			scrollOverflow: true,
			onLeave: function(){
				$.fn.fullpage.setAllowScrolling(false);
			},
			afterLoad: function(){
				$.fn.fullpage.setAllowScrolling(true);
			}
		});
		//
		$.fn.fullpage.reBuild(); */
		//
		$(".anterior").bind("click", function() {
			//
			var numPage = parseInt($(this).data('page')) - 1;
			moveToPage(numPage);
			//$.fn.fullpage.moveSectionUp();
		});
		//
		$(".proximo").bind("click", function() {
			//
			var numPage = parseInt($(this).data('page')) + 1;
			moveToPage(numPage);
			//$.fn.fullpage.moveSectionDown();
		});
		//
		//
		$('.checkradios').checkradios();
		//
		for (var i = 0; i < arrQuestoes.length; i++) { // Questões
			//
			var idQuestao = arrQuestoes[i].questao.id;
			var tipo = arrQuestoes[i].questao.tipo;
			//
			if (tipo == 3)
				$('input[name=q'+idQuestao+']').on('keydown', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||/65|67|86|88/.test(e.keyCode)&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});
		}
		//
		$('.page_container').css('max-width', maxWidth + 'px');
		$('.page_container').css('width', maxWidth + 'px');
		//
		$('.divNota').hide();
		$('#novamente').hide();
		$('#voltar').hide();
		$('#deixar').hide();
		$('#correcao').hide();

		if (ysnDesafioAmigo){
			if (fullParameterURL.indexOf('&desafio=criar') > 0){
				$('#salvar').show();
				$('#corrigir').hide();
			}else{
				$('#salvar').hide();
				$('#corrigir').show();
			}
			$('#voltar').show();
			$('#depois').hide();
		}else{
			if (qLocked == "true") {
				$('#voltar').show();
				$('#depois').hide();
				$('#corrigir').hide();
			}
			else {
				//
				if (totalMinutos <= 0)
					$('#depois').show();
				$('#corrigir').show();
			}
		}
		if (fullParameterURL.indexOf('noSair=1') > 0){
			$('#voltar').hide();
			$('#depois').hide();
		}
		if (tipoObjeto == "IPED") {
			$('#depois').hide();
		}
		//
		if (erroAvaliacaoIPED) {
			//
			$('.titulo-aula p').html("Avaliação Final");
			$('.header').show();
			$('.wrapper').show();
			$('.footer').show();
			$('#voltar').show();
			$('#depois').hide();
			$('#corrigir').hide();
			$('#novamente').hide();
			$('#deixar').hide();
			$('#correcao').hide();
			//
			$("#main").append(`<div class="page_container"></div>`);
			$(".page_container").append(`<h3>Ops! Você precisa visualizar todos os tópicos anteriores antes de responder a Avaliação Final.</h3>`);	
			hideNotify();
			// $.ajax({
			// 	type: "POST",
			// 	contentType: "application/json; charset=utf-8",
			// 	url: global_config.domainWebService + 'online/cs/LMS/getInfoIPED.aspx?' + fullParameterURL + "&type=topics-avaliacao",
			// 	// url: "https://httpbin.org/post",
			// 	// data: JSON.stringify(resultadoIPED),
			// 	cache: false,
			// 	beforeSend : function(){
			// 		myNotify("Por favor, aguarde...", 'info', true, 10000);
			// 	},
			// 	error: function(){
			// 		hideNotify();
	  //           	myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
	  //       	},
			// 	success: function(xml){
			// 		//
			// 		hideNotify();
			// 		// xml = `{"Code":200,"Error":"","Success":"","Data":[ { "topic_index": 1, "topic_id": 154, "topic_title": "Título do tópico...", "topic_image": "https://../url-da-imagem", "topic_type": 0, "topic_completed": 1, "topic_has_attachment": 1, "topic_percentage": 0 }, { "topic_index": 2, "topic_id": 192, "topic_title": "Título do tópico...", "topic_image": "https://../url-da-imagem", "topic_type": 0, "topic_completed": 1, "topic_has_attachment": 0, "topic_percentage": 8 }, { "topic_index": 3, "topic_id": 192, "topic_title": "Atividade Reflexiva - Publicar", "topic_image": "https://../url-da-imagem", "topic_type": 7, "topic_completed": 0, "topic_has_attachment": 0, "topic_percentage": 30 }, { "topic_index": 4, "topic_id": 192, "topic_title": "Atividade Reflexiva - Comentar", "topic_image": "https://../url-da-imagem", "topic_type": 8, "topic_completed": 0, "topic_has_attachment": 0, "topic_percentage": 40 }, { "topic_index": 5, "topic_id": 1211, "topic_title": "Avaliação Final", "topic_image": "https://../url-da-imagem", "topic_type": 1, "topic_completed": 0, "topic_has_attachment": 0, "topic_percentage": 95 } ]}`;
			// 		// xml = JSON.parse(xml);
			// 		console.log(xml);
			// 		//
			// 		xml.Data.forEach(function(item, index){
			// 			//
			// 			if (item.topic_completed == 0) {
			// 				//
			// 				if (item.topic_id > 0) 
			// 					$(".page_container").append(`<p>${item.topic_title}</p>`);
			// 			}
			// 		});
			// 	}
			// });
	    	setTimeout(sair, 6000);
		}
	}

	function criaQuestaoDesafio () {
		criaQuestao();
		$('.titulo-aula span').text("Criando um Desafio Amigo");
		$('.header').show();
		$('.wrapper').show();
		$('.footer').show();
		$('.titulo-aula p b').text('Desafio Amigo: ');
		$('#logoDesafio').css('top', ($('.header').height() + 20) +'px');

		completeXML();
	}

	$("#salvar").click(function () {
		var strPergunta = $('#pergunta').val();
		var strAlternativa0 = $('#alt0').val();
		var strAlternativa1 = $('#alt1').val();
		var strAlternativa2 = $('#alt2').val();

		if (strPergunta.length == 0){
			myNotify("Por favor, escreva uma pergunta", 'error', true, 3000);
			$('#pergunta').focus();
			return;
		}
		if (strAlternativa0.length == 0){
			myNotify("Por favor, escreva sua reposta correta", 'error', true, 3000);
			$('#alt0').focus();
			return;
		}
		if (strAlternativa1.length == 0){
			myNotify("Por favor, escreva uma resposta errada", 'error', true, 3000);
			$('#alt1').focus();
			return;
		}
		if (strAlternativa2.length == 0){
			myNotify("Por favor, escreva outra resposta errada", 'error', true, 3000);
			$('#alt2').focus();
			return;
		}
		$('#salvar').unbind('click');
		var urlAction = global_config.domainWebService + 'online/cs/LMS/SaveDesafio.aspx?' + fullParameterURL;
	    $.ajax({
	      type: "POST",
	      url: urlAction,
	      data: { pergunta: strPergunta, alternativa0: strAlternativa0, alternativa1: strAlternativa1,
	        alternativa2: strAlternativa2 },
	      dataType: "xml",
	      beforeSend : function(){
				myNotify("Por favor, aguarde...", 'info', true, 1000);
			},
	      error: function(){
	      	myNotify("Ops! Não foi possível salvar o seu desafio. Por favor, tente mais tarde.", 'error', true, 3000);
	      },
	      success: function(xml){
	          var totalError = $(xml).find('errors').children('total').text();
	          totalError = parseInt(totalError);
	          if (totalError){
	            var error = $(xml).find('errors').children('error').text();
	              myNotify(error, 'error', true, 5000);
	          }else{
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
	      	beforeSend : function(){
				myNotify("Por favor, aguarde...", 'info', true, 1000);
			},
			error: function(){
				console.log('Erro ao inativar desafio');
	           	//myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, tente mais tarde.", 'error', true, 5000)
	        },
			success: function(xml){
				var totalError = $(xml).find('errors').children('total').text();
			    totalError = parseInt(totalError);
			    if (totalError){
			    	var error = $(xml).find('errors').children('error').text();
			    	console.log('Erro ao inativar desafio: ' + error);
			    	//myNotify(error, 'error', true, 5000)
				}
			   	console.log('post');
			   	sair();
			}
		});
		
	});

	$("#desafiobtSim").click(function () {
		sair();
	});

	function sair(){
		try{
			window.parent.removerPlayer();
		}catch(e){ console.log('Sair...');}
	}
	
	$( window ).resize(function() {
		//
		var headerH = $('.header').height();
		var footerH = $('.footer').height();
		var windowH = $(window).height();
		ajustaWrapper();
	});

	function ajustaWrapper(){
		var headerH = $('.header').height();
		$('.wrapper').height('calc(100% - ' +  headerH + 'px - 55px)');
	}

	function replaceAll(string, token, newtoken) {
	  if (!string || string.length == 0)
	    return "";
	  while (string.indexOf(token) != -1) {
	    string = string.replace(token, newtoken);
	  }
	  return string;
	}

	//
	function geraQuestoes(arr) {
		//
		var totalQuestao = arr.length;
		//
		for (var i = 0; i < arr.length; i++) { // Questões
			//
			var idQuestao = arr[i].questao.id;
			var pergunta = replaceAll(replaceAll(arr[i].questao.pergunta, '<p', '<span'), '</p>', '</span>');
			var locked = arr[i].questao.locked;
			var alternativas = "";
			var alternativas3 = "";
			var alternativas3_1 = "";
			var alternativa3Col1 = [];
			var alternativa3Col2 = [];
			//
			for (var j = 0; j < arr[i].alternativa.length; j++) { // Alternativas
				//
				var idAlternativa = arr[i].alternativa[j].id;
				if (arr[i].resposta.length > 0)
					var txtResposta = arr[i].resposta[j].txtResposta;
				else
					var txtResposta = arr[i].alternativa[j].txtResposta;	
				var txtAlternativa = arr[i].alternativa[j].txtAlternativa;
				var strRespostaUser = arr[i].alternativa[j].strRespostaUser;
				var strRespostaSort = arr[i].resposta[j];

				//
				if (arr[i].questao.tipo == 1) {
					//
					if (locked == "true") {
						/*if (strRespostaUser == "Ativado") {
							if (txtResposta == $.md5(idAlternativa + "Certa"))// if (txtResposta == "Certa")
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idAlternativa+'" style="color:#00FF00;">'+txtAlternativa+'</label></div>';
							else
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idAlternativa+'" style="color:#FF0000;">'+txtAlternativa+'</label></div>';
						}
						else {
							alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled><label for="r'+idAlternativa+'">'+txtAlternativa+'</label></div>';
						}*/

						if (strRespostaUser == "Ativado") {
							if (txtResposta == $.md5(idAlternativa + "CERTA"))// if (txtResposta == "Certa")
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idQuestao+""+idAlternativa+'" style="color:#00FF00;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
							else
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idQuestao+""+idAlternativa+'" style="color:#FF0000;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						}
						else {
							if (txtResposta == $.md5(idAlternativa + "CERTA"))// if (txtResposta == "Certa")
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled><label for="r'+idQuestao+""+idAlternativa+'" style="color:#00FF00;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
							else
								alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						}
					}
					else {
						if (strRespostaUser == "Ativado")
							alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" checked><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						else
							alternativas = alternativas + '<div class="divP"><input type="radio" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'"><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
					}
				}
				else if (arr[i].questao.tipo == 2) {
					//
					if (locked == "true") {
						if (strRespostaUser == "Ativado") {
							if (txtResposta == $.md5(idAlternativa + "CERTA"))// if (txtResposta == "Certa")
								alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idQuestao+""+idAlternativa+'" style="color:#00FF00;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
							else
								alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled checked><label for="r'+idQuestao+""+idAlternativa+'" style="color:#FF0000;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						}
						else {
							if (txtResposta == $.md5(idAlternativa + "CERTA"))// if (txtResposta == "Certa")
								alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled><label for="r'+idQuestao+""+idAlternativa+'" style="color:#FF0000;">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
							else
								alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" disabled><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						}
					}
					else {
						if (strRespostaUser == "Ativado")
							alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'" checked><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
						else
							alternativas = alternativas + '<div class="divP"><input type="checkbox" name="r'+idQuestao+'" id="r'+idQuestao+""+idAlternativa+'" value="'+idAlternativa+'" class="checkradios" index="'+(i+1)+'"><label for="r'+idQuestao+""+idAlternativa+'">'+replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>')+'</label></div>';
					}
				}
				else if (arr[i].questao.tipo == 3) {
					//
					var ysnCorreto = ($.md5(arr[i].alternativa[j].id + arr[i].alternativa[j].strRespostaUser.toUpperCase()) == arr[i].alternativa[j].txtResposta);
					alternativa3Col1.push({idAlternativa:idAlternativa, index:(j+1), txtAlternativa:replaceAll(replaceAll(txtAlternativa, '<p', '<span'), '</p>', '</span>'), resposta:strRespostaUser, locked: locked, ysnCorreto: ysnCorreto});
					alternativa3Col2.push({idAlternativa:idAlternativa, idQuestao:idQuestao, resposta:txtResposta});
				}
			}
			
			//
			var classBtOcultaAnt="";
			var classBtOcultaProx="";
			if (ysnDesafioAmigo || totalQuestao == 1){
				classBtOcultaAnt="hideBT";
				classBtOcultaProx="hideBT";
			}else{
				if (i == 0)
					classBtOcultaAnt="hideBT";
				else if ((i + 1) == totalQuestao)
					classBtOcultaProx="hideBT";
			}
			
			if (arr[i].questao.tipo == 1 || arr[i].questao.tipo == 2) {
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
							// Se as mensagens forem iguais, mostra só uma
							if (comentarios.length === 2 && comentarios[0] === comentarios[1]) {
								comentarioHTML = '<div class="comentario">' + comentarios[0] + '</div>';
							} else {
								comentarioHTML = '<div class="comentario">' + comentarios.join(' / ') + '</div>';
							}
						}
					} else {
						// Questão tipo 1
						/*for (var k = 0; k < arr[i].alternativa.length; k++) {
							var alt = arr[i].alternativa[k];
							if (alt.strRespostaUser === "Ativado") {
								var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
								comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
								
								// Condicional para acervo#
								if (comentario.startsWith("acervo#")) {
									var acervoId = comentario.split("#")[1].trim();
									var idLogin = new URLSearchParams(window.location.search).get("idLogin");
									var token = new URLSearchParams(window.location.search).get("token");
									var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId + "&idLogin=" + idLogin + "&token=" + token;

									// Cria div placeholder com id único
									comentarioHTML = '<div class="comentario" id="acervo-placeholder-' + acervoId + '">'
												   + 	'<img src="./imgs/playBtn.png"'
												   +		'class="acervo-play-btn"'
												   +		'data-url="' + acervoUrl + '"'
												   +		'style="cursor:pointer;"'
												   +		'alt="Play vídeo do acervo"/>'
												   + '</div>';

								} else{
									comentarioHTML = '<div class="comentario">' + comentarioHTML + '</div>';
								}
								break;
							}
						}*/
						for (var k = 0; k < arr[i].alternativa.length; k++){
							var alt = arr[i].alternativa[k];
							
							if (alt.strRespostaUser === "Ativado") {
								var isCerta   = (alt.txtResposta === $.md5(alt.id + "CERTA"));
								var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
								var comentarioHTML;

								if (comentario.includes("#acervo#")) {
									// separa HTML antes do marker e o ID depois dele
									var partes     = comentario.split("#acervo#");
									var htmlAntes  = partes[0];
									var acervoId   = partes[1].trim();

									// pega idLogin e token da URL
									var idLogin    = new URLSearchParams(window.location.search).get("idLogin");
									var token      = new URLSearchParams(window.location.search).get("token");
									var acervoUrl  = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid="
												+ acervoId + "&idLogin=" + idLogin + "&token=" + token;

									comentarioHTML = ''
									+ '<div class="comentario">'
									+     htmlAntes
									+     '<div id="acervo-placeholder-' + acervoId + '" style="margin-top:1vw;">'
									+       '<img src="./imgs/playBtn.png"'
									+            ' class="acervo-play-btn"'
									+            ' data-url="' + acervoUrl + '"'
									+            ' style="cursor:pointer;"'
									+            ' alt="Play vídeo do acervo"/>'
									+     '</div>'
									+ '</div>';
								} else if (comentario.startsWith("acervo#")) {
									var acervoId = comentario.split("#")[1].trim();
									var idLogin = new URLSearchParams(window.location.search).get("idLogin");
									var token = new URLSearchParams(window.location.search).get("token");
									var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId + "&idLogin=" + idLogin + "&token=" + token;

									// Cria div placeholder com id único
									comentarioHTML = '<div class="comentario" id="acervo-placeholder-' + acervoId + '">'
												   + 	'<img src="./imgs/playBtn.png"'
												   +		'class="acervo-play-btn"'
												   +		'data-url="' + acervoUrl + '"'
												   +		'style="cursor:pointer;"'
												   +		'alt="Play vídeo do acervo"/>'
												   + '</div>';

								} else{
									comentarioHTML = '<div class="comentario">' + comentarioHTML + '</div>';
								}
								break;
							}

						}
					}
				}

				if (totalQuestao == 1)
					$('.main').append('<div class="section page'+i+'"><div class="page_container"><h3>'+pergunta+'</h3><div class="resposta">'+alternativas+'</div>' + comentarioHTML + '<div class="buttons"><a href="#" data-page="'+i+'" class="button '+classBtOcultaAnt+' black anterior">ANTERIOR</a><a href="#" data-page="'+i+'" class="button '+classBtOcultaProx+' black proximo">PR&Oacute;XIMA</a></div></div></div>');
				else
					$('.main').append('<div class="section page'+i+'"><div class="page_container"><h3>'+(i+1)+'/'+totalQuestao+' - '+pergunta+'</h3><div class="resposta">'+alternativas+'</div>' + comentarioHTML + '<div class="buttons"><a href="#" data-page="'+i+'" class="button '+classBtOcultaAnt+' black anterior">ANTERIOR</a><a href="#" data-page="'+i+'" class="button '+classBtOcultaProx+' black proximo">PR&Oacute;XIMA</a></div></div></div>');
			}
			else {
				//
				var styleQuestion = '';
				for (var a = 0; a < alternativa3Col1.length; a++) {
					//
					styleQuestion = '';
					if (alternativa3Col1[a].locked == "true"){
						if (alternativa3Col1[a].ysnCorreto)
							styleQuestion = ' style="color: #00FF00;" ';
						else
							styleQuestion = ' style="color: #FF0000;" ';
					}
					alternativas3 = alternativas3 + '<div '+styleQuestion+'class="question" id="q'+alternativa3Col1[a].idAlternativa+'" index="'+alternativa3Col1[a].index+'"><div class="divP">' + alternativa3Col1[a].index + ' - ' +alternativa3Col1[a].txtAlternativa+'</div></div>';
				}
				//
				for (var b = 0; b < alternativa3Col2.length; b++) {
					//
					var flag = false;
					//
					for (var c = 0; c < alternativa3Col1.length; c++) {
						//
						if (alternativa3Col2[b].resposta == alternativa3Col1[c].resposta) {
							//
							if (alternativa3Col1[c].locked == "true"){
								alternativas3_1 = alternativas3_1 + '<div class="answer" id="a'+alternativa3Col2[b].idAlternativa+'" val="'+alternativa3Col2[b].resposta+'"><div class="divP"><input type="text" disabled id="t'+alternativa3Col2[b].idAlternativa+'" name="q'+alternativa3Col2[b].idQuestao+'" maxlength="1" value="'+alternativa3Col1[c].index+'" />'+alternativa3Col2[b].resposta+'</div></div>';
								/*if (alternativa3Col1[c].ysnCorreto)
									alternativas3_1 = alternativas3_1 + '<div class="answer" id="a'+alternativa3Col2[b].idAlternativa+'" val="'+alternativa3Col2[b].resposta+'"><div class="divP"><input type="text" style="border:1px solid #00FF00;" disabled id="t'+alternativa3Col2[b].idAlternativa+'" name="q'+alternativa3Col2[b].idQuestao+'" maxlength="1" value="'+alternativa3Col1[c].index+'" />'+alternativa3Col2[b].resposta+'</div></div>';
								else
									alternativas3_1 = alternativas3_1 + '<div class="answer" id="a'+alternativa3Col2[b].idAlternativa+'" val="'+alternativa3Col2[b].resposta+'"><div class="divP"><input type="text" style="border:1px solid #FF0000;" disabled id="t'+alternativa3Col2[b].idAlternativa+'" name="q'+alternativa3Col2[b].idQuestao+'" maxlength="1" value="'+alternativa3Col1[c].index+'" />'+alternativa3Col2[b].resposta+'</div></div>';*/

							}else{
								alternativas3_1 = alternativas3_1 + '<div class="answer" id="a'+alternativa3Col2[b].idAlternativa+'" val="'+alternativa3Col2[b].resposta+'"><div class="divP"><input type="text" id="t'+alternativa3Col2[b].idAlternativa+'" name="q'+alternativa3Col2[b].idQuestao+'" maxlength="1" value="'+alternativa3Col1[c].index+'" />'+alternativa3Col2[b].resposta+'</div></div>';
							}
							flag = true;
							break;
						}
					}
					//
					if (!flag)
						alternativas3_1 = alternativas3_1 + '<div class="answer" id="a'+alternativa3Col2[b].idAlternativa+'" val="'+alternativa3Col2[b].resposta+'"><div class="divP"><input type="text" id="t'+alternativa3Col2[b].idAlternativa+'" name="q'+alternativa3Col2[b].idQuestao+'" maxlength="1" />'+alternativa3Col2[b].resposta+'</div></div>';
				}
				
				$('.main').append('<div class="section page'+i+'"><div class="page_container"><h3>'+(i+1)+'/'+totalQuestao+' - '+pergunta+'</h3><div class="resposta"><div id="questionDiv-'+idQuestao+'" class="questionDiv">'+alternativas3+'</div><div id="answerDiv-'+idQuestao+'" class="answerDiv">'+alternativas3_1+'</div></div><div class="buttons"><a href="#" data-page="'+i+'" class="button '+classBtOcultaAnt+' black anterior">ANTERIOR</a><a href="#" data-page="'+i+'" class="button '+classBtOcultaProx+' black proximo">PR&Oacute;XIMA</a></div></div></div>');
			}
		}

		// Ativa o carregamento do iframe só quando o usuário clicar na play button
		$(document).on('click', '.acervo-play-btn', function(){
			var $img    = $(this);
			var url      = $img.data('url');
			var $placeholder = $img.parent();

			// opcional: troca a img por um loader
			$placeholder.html('<p class="comentarioMsg">Carregando vídeo…</p>');

			// GET real e swap
			$.get(url)
			.done(function(data){
				if (!data.isError && data.uriEmbed) {
					$placeholder.html(
						'<iframe src="' + data.uriEmbed + '" '
						+ 'frameborder="0" class="comentarioIframe" '
						+ 'allowfullscreen width="100%" height="400px"></iframe>'
					);
				} else {
					$placeholder.html('<p style="color:red;">Erro ao carregar o vídeo.</p>');
				}
			})
			.fail(function(){
				$placeholder.html('<p style="color:red;">Falha na conexão.</p>');
			});
		});

	}

	function criaQuestao() {
		var alternativas = '<div class="divP"><div class="comentsA">Escreva aqui a resposta correta:</div><input type="radio" id="r0" class="checkradios" disabled checked><input type="text" id="alt0" maxlength="50" class="inputAlternativa"></div>';
		alternativas = alternativas + '<div class="divP"><div class="comentsA">Escreva abaixo as respostas erradas:</div><input type="radio" id="r1" class="checkradios" disabled><input type="text" id="alt1" class="inputAlternativa"></div>';
		alternativas = alternativas + '<div class="divP"><input type="radio" id="r2" class="checkradios" disabled><input type="text" id="alt2" class="inputAlternativa"></div>';
			
		$('.main').append('<div class="section page0"><div class="page_container"><h3><div class="comentsP">Escreva aqui a sua pergunta:</div><input type="text" id="pergunta" maxlength="50" class="inputPergunta"></h3><div class="resposta">'+alternativas+'</div><div class="buttons"><a href="#" data-page="0" class="button hideBT black anterior">ANTERIOR</a><a href="#" data-page="0" class="button hideBT black proximo">PR&Oacute;XIMA</a></div></div></div>');
	}

	//
	var currFont = parseInt($(".main").css("font-size"));

	$("#zoomin").click(function () {
		currFont += 1;
		$(".main").css("font-size", currFont);

	});
	$(".zoomOff").click(function () {
		$(".main").css("font-size", "16px");

	});
	$("#zoomout").click(function () {
		currFont -= 1;
		$(".main").css("font-size", currFont);

	});
	//
	
	function getRespostasAluno() {
		//
		arrRespostasAluno = [];
		var respostaVazia = [];
		var totalRespondido = 0;
		//
		for (var i = 0; i < arrQuestoes.length; i++) {
			//
			var idQuestao = arrQuestoes[i].questao.id;
			var tipoQuestao = arrQuestoes[i].questao.tipo;
			var formula = arrQuestoes[i].questao.formula;
			//
			if (tipoQuestao == 1) {
				//
				var respostaAluno = ($('input[name=r'+idQuestao+']:checked').val()); // Valor do input
				//
				if (respostaAluno != undefined) {
					//
					totalRespondido++;
					$('input[name=r'+idQuestao+']').each(function() {
						//
						if (respostaAluno == $(this).val()) {
							//
							arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"Ativado", idQuestao:idQuestao, status:"Ativado"});
						}
						else {
							//
							arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"Desativado", idQuestao:idQuestao, status:"Desativado"});
						}
					});
					//
				}
				else {
					// Posiciona pergunta que não foi respondida na tela
					//$(".main").moveTo(i+1);
					// Adiciona respostas vazias para essa questão
					$('input[name=r'+idQuestao+']').each(function() {
						//
						arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"", idQuestao:idQuestao, status:"vazio"});
					});
					//
					//
					respostaVazia.push((i+1));
				}
			}
			else if (tipoQuestao == 2) {
				//
				var respostaQuestao = [];
				var respostaAluno = [];
				// Procura por todos os checkbox marcados nessa questão
				$('input[name=r'+idQuestao+']:checked').each(function() {
					// Adiciona o ID das alternativas checadas no array
					respostaAluno.push($(this).val());
				});
				//
				if(respostaAluno.length > 0) { // Aluno marcou pelo menos 1 alternativa
					//
					totalRespondido++;
					$('input[name=r'+idQuestao+']').each(function() {
						//
						var flag = false;
						//
						for (var c = 0; c < respostaAluno.length; c++) {
							//
							if (respostaAluno[c] == $(this).val()) {
								//
								arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"Ativado", idQuestao:idQuestao, status:"Ativado"});
								flag = true;
								break;
							}
						}
						//
						if (!flag)
							arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"Desativado", idQuestao:idQuestao, status:"Desativado"});
					});
				}
				else {
					// Posiciona pergunta que não foi respondida na tela
					//$(".main").moveTo(i+1);
					// Adiciona respostas vazias para essa questão
					$('input[name=r'+idQuestao+']').each(function() {
						//
						arrRespostasAluno.push({id:$(this).val(), tipo:tipoQuestao, resposta:"", idQuestao:idQuestao, status:"vazio"});
					});
					//
					//
					respostaVazia.push((i+1));
				}
			}
			else if (tipoQuestao == 3) {
				//
				$('input[name=q'+idQuestao+']').each(function() {
					//
					if ($(this).val() != "") {
						//
						totalRespondido++;
						var respostaSelecionada = $(this).parent().parent().attr('val');
						var index = $(this).val()
						//
						$('#questionDiv-'+idQuestao).find('.question').each(function(){
							//
							if ($(this).attr('index') == index) {
								//
								var perguntaID = $(this).attr('id').substring(1, $(this).attr('id').length);
								//
								arrRespostasAluno.push({id:perguntaID, resposta:respostaSelecionada, tipo:tipoQuestao, idQuestao:idQuestao, index:index});
							}
						});
						
					} else {
						// Posiciona pergunta que não foi respondida na tela
						//$(".main").moveTo(i+1);
						// Adiciona respostas vazias para essa questão
						$('#questionDiv-'+idQuestao).find('.question').each(function(){
							//
							var perguntaID = $(this).attr('id').substring(1, $(this).attr('id').length);
							//
							arrRespostasAluno.push({id:perguntaID, resposta:"", tipo:tipoQuestao, idQuestao:idQuestao});
						});
						respostaVazia.push((i+1));
					}
				});
			}
		}
		//
		return {respostas:arrRespostasAluno, vazio:respostaVazia, totalRespondido: totalRespondido};
	}
	
	
	//
	$("#depois").click(function () {
		var respostas = getRespostasAluno();
		var arrRespostasAluno = respostas.respostas;
		var respVazia = respostas.vazio;
		if (respostas.totalRespondido == 0 || ysnDesafioAmigo){
			sair();
			return;
		}
		var strParam = "";
		var params = {};
		for (var a = 0; a < arrRespostasAluno.length; a++) {
			strParam += arrRespostasAluno[a].id + "|" + arrRespostasAluno[a].resposta + "|-1;";
		}
		strParam = strParam.substring(0, strParam.length - 1);
		params["Param"] = strParam;
		params["tentativa"] = tentativa;
		params["percentual"] = "0";
			
		$.ajax({
			type: "POST",
			url: global_config.domainWebService + "online/cs/LMS/SaveAlternativas.aspx?"+fullParameterURL,
			data: params,
			cache: false,
			beforeSend : function(){
				myNotify("Por favor, aguarde...", 'info', true, 1000);
			},
			error: function(){
	            myNotify("Ops! Ocorreu um erro ao salvar as respostas deste exercício. Por favor, tente mais tarde.", 'error', true, 5000)
	        },
			success: function(xml){
				var totalError = $(xml).find('errors').children('total').text();
			    totalError = parseInt(totalError);
			    if (totalError){
			    	var error = $(xml).find('errors').children('error').text();
			    	myNotify(error, 'error', true, 5000)
			    }else{
			    	var arrObjsAlterados = new Array();;
			    	var objAlterado;
			    	$(xml).find("objetosAlterados").each(function () {
			    		objAlterado = {
			    			idObjeto: $(this).find("idObjeto").text(),
			    			percentual: $(this).find("percentual").text(),
			    			notafinal: $(this).find("notafinal").text(),
			    		}
		    			arrObjsAlterados.push(objAlterado)
		    		});
			    	try{
			    		window.parent.removerPlayerObjs(arrObjsAlterados);
			    	}catch(e){
		    		}
			    }
			}
		});
	});
	//
	
	function moveToPage(intPage){
		var top = $('.page' + (intPage))[0].offsetTop - $('.wrapper')[0].offsetTop;
		//$('.wrapper').scrollTop(top);
		$('.wrapper').animate({ scrollTop: top }, 600);
	}

	var corrigindo = false;
	
	$("#corrigir").click(function () {
		//
		//var myJsonString = JSON.stringify(arrQuestoes);
		//alert(arrQuestoes[0].alternativa[0]);
		//$('body').text(myJsonString);
		//
		// console.log(tipoObjeto)
		// console.log(corrigindo)
		if (corrigindo)
			return;
		corrigindo = true;
		var isIped = (tipoObjeto.toUpperCase() == "IPED") ? true : false;
		// isIped = true;
		var respostas = getRespostasAluno();
		var arrRespostasAluno = respostas.respostas;
		//
		var respVazia = respostas.vazio;
		var corrigir = respVazia.length == 0;

		//console.log(respostas) 
		//console.log(respVazia) 
		//console.log(corrigir) 

		if (!corrigir){
			if (respVazia.length == 1){
				myNotify("Ops! Uma questão não foi respondida. É necessário responder todas as questões para solicitar a correção.", 'warning', true, 5000);
				moveToPage(respVazia[0]-1);
				//zoomObj($('.page'+(respVazia[0]-1)));
				//$.fn.fullpage.moveTo(respVazia[0]);
			}else if (respVazia.length > 1){
				myNotify("Ops! Algumas questões não foram respondidas. É necessário responder todas as questões para solicitar a correção.", 'warning', true, 5000);
				//$.fn.fullpage.moveTo(respVazia[0]);
				moveToPage(respVazia[0]-1);
				//zoomObj($('.page'+(respVazia[0]-1)));
			}
			corrigindo = false;
			return;
		}

		if (corrigir) {
			//
			var media = [];
			//
			for (var i = 0; i < arrQuestoes.length; i++) {
				//
				var idQuestao = arrQuestoes[i].questao.id;
				var tipoQuestao = arrQuestoes[i].questao.tipo;
				var peso = arrQuestoes[i].questao.peso;
				var formulaQuestao = arrQuestoes[i].formula;
				var alternativasQuestao = arrQuestoes[i].alternativa;
				var totalAlternativas = arrQuestoes[i].alternativa.length;
				var certa = 0;
				var errada = 0;
				//
				for (var j = 0; j < alternativasQuestao.length; j++) {
					//
					var idAlternativa = alternativasQuestao[j].id;
					//
					for (var a = 0; a < arrRespostasAluno.length; a++) {
						//
						var idAlternativaAluno = arrRespostasAluno[a].id;
						//
						if (idAlternativaAluno == idAlternativa) {
							//
							if (tipoQuestao < 3) {
								//
								var status = arrRespostasAluno[a].status; // Ativado ou Desativado
								var resposta = alternativasQuestao[j].txtResposta; // Certa ou Errada
								//
								if (status == "Ativado") {
									//
									if (resposta == $.md5(alternativasQuestao[j].id + "CERTA")) {//if (resposta == "Certa") {
										//
										certa++;
									}
									else {
										//
										errada++;
									}
								}
								else if (status == "Desativado"){ // Desativado
									//
									if (resposta == $.md5(alternativasQuestao[j].id + "ERRADA")) { //if (resposta == "Errada") {
										//
										certa++;
									}
									else {
										//
										errada++;
									}
								}
							}
							else {
								//
								var respostaAluno = arrRespostasAluno[a].resposta; // Texto da resposta do aluno
								var resposta = alternativasQuestao[j].txtResposta; // Texto da resposta verdadeira
								//
								if ($.md5(alternativasQuestao[j].id + respostaAluno.toUpperCase()) == resposta) {//if (respostaAluno == resposta) {
									//
									certa++;
								}
								else {
									//
									errada++;
								}
							}
						}
					}
				}
				if (tipoQuestao == "1"){
					if (certa != totalAlternativas){
						certa = 0;
						errada = totalAlternativas;
					}
				}
				//
				formulaQuestao = formulaQuestao.replace("certas", certa);
				formulaQuestao = formulaQuestao.replace("erradas", errada);
				formulaQuestao = formulaQuestao.replace("total", totalAlternativas);
				var t = eval(formulaQuestao);
				t = t.toFixed(2);
				//alert("Formula:"+formulaQuestao+"  idQuestao:"+idQuestao+"  Nota:"+t);
				//
				if (t <= 0)
					media.push({idQuestao:idQuestao, nota:0, peso:peso});
				else if (t > 10)
					media.push({idQuestao:idQuestao, nota:10, peso:peso});
				else
					media.push({idQuestao:idQuestao, nota:t, peso:peso});
			}
			//
			//
			for (var x = 0; x < media.length; x++) {
				//
				var idQuestao = media[x].idQuestao;
				//
				for (var a = 0; a < arrRespostasAluno.length; a++) {
					//
					var idQuestaoAlternativa = arrRespostasAluno[a].idQuestao;
					//
					if (idQuestao == idQuestaoAlternativa) {
						//
						arrRespostasAluno[a].nota = media[x].nota;
					}
				}
			}
			//
			//
			var strParam = "";
			notaAtual = 0;
			var numQuest = media.length;
			var params = {};
			//
			for (var a = 0; a < arrRespostasAluno.length; a++) {
				//
				strParam += arrRespostasAluno[a].id + "|" + arrRespostasAluno[a].resposta + "|" + arrRespostasAluno[a].nota + ";";
			}
			//
			strParam = strParam.substring(0, strParam.length - 1);
			//
			//
			var sumPeso = 0;
			for (var x = 0; x < media.length; x++) {
				sumPeso += parseInt(media[x].peso);
			}
			var notaPeso;
			for (var x = 0; x < media.length; x++) {
				notaPeso = media[x].nota * (media[x].peso / sumPeso);
				notaAtual += notaPeso;
			}
			notaAtual = notaAtual.toFixed(2);
			if (notaAtual > 10)
				notaAtual = 10;
			//
			//notaAtual = notaAtual / numQuest;
			//
			params["Param"] = strParam;
			params["tentativa"] = tentativa;
			params["notafinal"] = notaAtual;
			params["tokenNF"] = $.md5(notaAtual + '.' + tentativa);

			var urlAction = global_config.domainWebService + 'online/cs/LMS/SaveAlternativas.aspx?'+fullParameterURL+"&"+$.param(params);
			//
			var percentual = 100;
			if (notaAtual >= notaMinima) {
				//
				params["percentual"] = "100";
			}
			else {
				//
				percentual = parseInt(notaAtual) * 10;
				params["percentual"] = percentual;

			}

			var objReenviaSave = {
				urlAction: urlAction,
				percentual: percentual
			}
			try{
				window.parent.addReenviaPasso(objReenviaSave);
			}catch(e){

			}
			//
			if (isIped) {
				//
				var arrRespostasAlunoIPED = [];
				arrRespostasAluno.forEach(function(item, index) {
					//
					if (item.resposta == "Ativado") {
						//
						arrRespostasAlunoIPED.push(
							{
								"question_id": item.idQuestao,
								"question_response": item.id.slice(-1)
							}
						);
					}
				});
				let idCurso = getURLParameter("idCurso");
				let idAula = getURLParameter("idAula");
				let idObjeto = getURLParameter("idObjeto");
				let idLogin = getURLParameter("idLogin");
				let token = getURLParameter("token");
				let configIPED = strValor.split("#");
				let course_id = configIPED[1];
				let topic_index = configIPED[2];
				//
				$.ajax({
					type: "POST",
					url: `https://wing.com.br/online/cs/LMS/CorrigirIPED.aspx?token=${token}&idLogin=${idLogin}&course_id=${course_id}&topic_index=${topic_index}`,
					data: {respostasAluno: JSON.stringify(arrRespostasAlunoIPED)},
					cache: false,
					beforeSend : function(){
						myNotify("Por favor, aguarde...", 'info', true, 15000);
					},
					error: function(){
						hideNotify();
		            	myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
						corrigindo = false;
		        	},
					success: function(json){
						//
						hideNotify();
						let status = json.Code;
						// status = 200;
						if (status !== 200 && status !== 300) {
							//
							myNotify(json.Error, 'error', true, 7500);
						}
						else if (status === 300) {
							// Aluno não obteve a nota mínima e tela de ajuda aparece
							$('.main').fadeOut(200, function(){
					    		corrigindo = false;
					    		const notaZero = 0;
								$('#divTempoExercicio').hide();
								$('.divNota').fadeIn(200);
								$('#depois').hide();
								$('#corrigir').hide();
								$('#voltar').show();
								$('#correcao').hide();
								$('#novamente').hide();
								mostraNota(notaZero, true);
								if (fullParameterURL.indexOf('noSair=1') > 0){
									$('#voltar').hide();
									$('#depois').hide();
								}
							});
						}
						else {
							//
							// let fakeResult = {"Code":200,"Error":"","Success":"Avaliação registrada com sucesso!","Data":{"percentage":33,"question_responses":["d","c","a"],"user_responses":["a","a","a"]}}
							// let fakeResult = {"Code":200,"Error":"","Success":"Avaliação registrada com sucesso!","Data":{"percentage":66,"question_responses":["c","b","e"],"user_responses":["c","b","c"]}}
							fakeResult = json;
							let resultadoIPED = {
								"IdCurso": idCurso,
								"IdAula": idAula,
								"idObjetoEnsinoFK": idObjeto,
								"idLoginFK": idLogin,
								"NotaFinal": parseFloat((fakeResult.Data.percentage / 10) * indiceMultiplicadorNota),
								"Percentual": fakeResult.Data.percentage,
								"Tentativas": tentativa,
							};
							let resultadoDesempenhoIPED = {
								"IdCurso": idCurso,
								"IdAula": idAula,
								"idObjetoEnsinoFK": idObjeto,
								"idLoginFK": idLogin,
								"NotaFinal": parseFloat((fakeResult.Data.percentage / 10) * indiceMultiplicadorNota),
								"Percentual": fakeResult.Data.percentage,
								"Tentativas": tentativa,
							};
							let arrQuestaoIPED = [];
							let arrDesempenhoIPED = [];
							//
							fakeResult.Data.question_responses.forEach(function(item, index) {
								//
								let respostaCorreta = matrizIPED[item];
								let arrQuestao = arrQuestoes[index];
								let strQuestao = arrQuestao.questao.pergunta;
								let idQuestao = arrQuestao.questao.id;
								let arrAlternativas = arrQuestao.alternativa;
								let arrAlternativasIPED = [];
								//
								arrAlternativas.forEach(function(itemAlternativa, indexAlternativa) {
									//
									let idAlternativa = itemAlternativa.id;
									let strAlternativa = itemAlternativa.txtAlternativa;
									let numAlteranativa = idAlternativa.slice(-1);
									let strResposta = (numAlteranativa == respostaCorreta) ? "CERTA" : "ERRADA";
									arrAlternativasIPED.push(
										{
											"IdAlternativaIPED": idAlternativa,
											"StrAlternativa": strAlternativa,
											"StrResposta": strResposta
										}
									);
								});
								//
								arrQuestaoIPED.push(
									{
										"IdQuestaoIPED": idQuestao,
										"StrQuestao": strQuestao,
										"Alternativas": arrAlternativasIPED
									}
								)
							});
							//
							let questao = -1;
							let ultimaQuestao = 0;
							respostas.respostas.forEach(function(item, index) {
								//
								if (ultimaQuestao != item.idQuestao) {
									ultimaQuestao = item.idQuestao;
									questao = questao + 1;
								}
								//
								let respostaCorreta = matrizIPED[fakeResult.Data.question_responses[questao]];
								let numAlteranativa = item.id.slice(-1);
								//
								arrDesempenhoIPED.push(
									{
										"IdAlternativaIPED": item.id,
										"Nota": ((numAlteranativa == respostaCorreta) && (item.resposta == "Ativado")) ? 10 : 0,
										"StrResposta": item.resposta
									}
								);
							});
							//
							let arrQuestoesAcertos = [];
							arrDesempenhoIPED.forEach(function(item, index) {
								if (item.Nota === 10) {
									arrQuestoesAcertos.push(item.IdAlternativaIPED.slice(0, -1));
								}
							});
							arrQuestoesAcertos.forEach(function(item, index) {
								arrDesempenhoIPED.forEach(function(item2, index2) {
									if (item2.IdAlternativaIPED.indexOf(item) >= 0) {
										item2.Nota = 10;
									}
								});
							});
							//
							resultadoIPED.Questoes = arrQuestaoIPED;
							resultadoIPED.Respostas = arrDesempenhoIPED;
							// resultadoDesempenhoIPED.topic_questions = JSON.parse(topic_questions);
							//
							//console.log(fakeResult.Data.percentage);
							//console.log(resultadoIPED);
							//console.log(global_config.domainWebService + "online/cs/LMS/exerciciosIPED.aspx?"+fullParameterURL);
							//

							$.ajax({
								type: "POST",
								contentType: "application/json; charset=utf-8",
								url: global_config.domainWebService + "online/cs/LMS/exerciciosIPED.aspx?"+fullParameterURL,
								data: JSON.stringify(resultadoIPED),
								cache: false,
								beforeSend : function(){
									myNotify("Por favor, aguarde...", 'info', true, 10000);
								},
								error: function(){
									hideNotify();
					            	myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
					        	},
								success: function(xml){
									//
									hideNotify();
									var xml_error = $(xml).find('total').text();
								    //
								    if (parseInt(xml_error) > 0){
								    	//
								    	var xml_error_msg = $(xml).find('error').text();
								    	myNotify(xml_error_msg, 'error', true, 5000);
								    	setTimeout(sair, 2200);
									} else {
										//
										const nfinal = resultadoIPED.NotaFinal;
								    	$('.main').fadeOut(200, function(){
								    		corrigindo = false;
											$('#divTempoExercicio').hide();
											$('.divNota').fadeIn(200);
											$('#depois').hide();
											$('#corrigir').hide();
											$('#voltar').show();
											$('#correcao').show();
											if (nfinal < notaMinima)
												$('#novamente').show();
											else
												$('#novamente').hide();
											mostraNota(nfinal, true);
											if (fullParameterURL.indexOf('noSair=1') > 0){
												$('#voltar').hide();
												$('#depois').hide();
											}
										});
									}
								}
							});
						}
					}
				});
			}
			else {
				
				$.ajax({
					type: "POST",
					url: global_config.domainWebService + "online/cs/LMS/SaveAlternativas.aspx?"+fullParameterURL,
					data: params,
					cache: false,
					beforeSend : function(){
						myNotify("Por favor, aguarde...", 'info', true, 10000);
					},
					error: function(){
		            	myNotify("Ops! Ocorreu um erro ao corrigir as respostas deste exercício. Por favor, verifique a sua conexão com a internet e tente novamente", 'error', true, 7500);
						corrigindo = false;
		        	},
					success: function(xml){
						hideNotify();
						var totalError = $(xml).find('errors').children('total').text();
					    totalError = parseInt(totalError);
					    if (totalError){
					    	var error = $(xml).find('errors').children('error').text();
					    	myNotify(error, 'error', true, 5000);
					    	corrigindo = false;
					    	return;
						}
				    	var arrObjsAlterados = new Array();;
				    	var objAlterado;
				    	$(xml).find("objetosAlterados").each(function () {
				    		objAlterado = {
				    			idObjeto: $(this).find("idObjeto").text(),
				    			percentual: $(this).find("percentual").text(),
				    			notafinal: $(this).find("notafinal").text(),
				    		}
			    			arrObjsAlterados.push(objAlterado)
			    		});
				    	try{
				    		window.parent.ajustaVariavelMenu(arrObjsAlterados);
				    	}catch(e){
				    	}

				    	$('.main').fadeOut(200, function(){
				    		corrigindo = false;
							if (ysnDesafioAmigo){
								$('#corrigir').hide();
								$('#voltar').show();
								$('#desafioUtil').show();
								$('#desafiobtNao').show();
								$('#desafiobtSim').show();
								verCorrecaoF();
							}else{
								//clearInterval(timerExercicio);
					 			$('#divTempoExercicio').hide();
								$('.divNota').fadeIn(200);
								$('#depois').hide();
								$('#corrigir').hide();
								$('#voltar').show();
								$('#correcao').show();
								if (notaAtual < notaMinima)
									$('#novamente').show();
								else
									$('#novamente').hide();
								mostraNota(notaAtual);
							}
							if (fullParameterURL.indexOf('noSair=1') > 0){
								$('#voltar').hide();
								$('#depois').hide();
							}
						});
					}
				});
			}
		}
	});

	$('#deixar').click(function () {
		window.parent.removerPlayer(50);
	});

	$("#voltar").click(function () {
		window.parent.removerPlayer();
	});

	//
	$("#novamente").click(function () {
		//
		tentativa++;
		$('.main').empty();
		//$.fn.fullpage.destroy('all');
		//
		arrQuestoes = [];
		var xmltoload = global_config.domainWebService + "online/cs/LMS/MeusExercicios.aspx?"+fullParameterURL+"&ve=2";
		carregaDados(xmltoload);
		$('.divNota').fadeOut('300', function(){
			//
			$('.divNota').empty();
			$('.main').fadeIn('300');
		});
	});
	
	function mostraNota(nota, iped = false) {
		//
		var notaT = nota * indiceMultiplicadorNota;
		if (nota >= notaMinima) {
			//
			let msgRespostas = '<p>Veja suas respostas certas e erradas clicando no botão "Ver Correção" abaixo.</p>';
			if (nota == 10)
				msgRespostas = '<p>Veja suas respostas clicando no botão "Ver Correção" abaixo.</p>';
			if (getURLParameter('idNegocio')=="6496"){  // penem (Quero BoaBolsa)
				msgRespostas ='';
				$("#correcao").remove();
			}
			$('#novamente').hide();
			$('#deixar').hide();
			$('.divNota').append('<h3 style="color:#00FF00">Parabéns! Você tirou ' + notaT + ' neste exercício.</h3>' + msgRespostas);
			$('#divMaxTentativas').hide();
		}
		else {
			//
			if (iped) {
				//
				$('.divNota').append('<h3 style="color:#FF0000">Ops! Você não obteve a média mínima na Avaliação Final.</h3><p>Alguns tópicos precisam ser revistos no curso.</p>');
				if (maxTentativas < 10000000){
					let numRestTentativas = maxTentativas - tentativa;
					if (numRestTentativas > 1)
						$('#divMaxTentativas').html('Não foi dessa vez! Você tem mais '+numRestTentativas+' tentativas pra responder esse exercício.');
					else if (numRestTentativas == 1)
						$('#divMaxTentativas').html('Não foi desta vez! Você só tem <b>mais 1 tentativa</b> pra responder esse exercício.');
					else{
						$('#novamente').hide();
						$('#divMaxTentativas').html('Não foi desta vez! Seu exercício foi finalizado com esta sua última nota');
					}
					$('#divMaxTentativas').show();
				}
			}
			else {
				//
				if (getURLParameter('idNegocio')=="6496"){ // penem (Quero BoaBolsa)
					$('.divNota').append('<h3 style="color:#FF0000">Ops! Sua nota foi ' + notaT + ' neste exercício.</h3>');
					$("#correcao").remove();
				}
				else
					$('.divNota').append('<h3 style="color:#FF0000">Ops! Sua nota foi ' + notaT + ' neste exercício.</h3><p>Veja suas respostas clicando no botão "Ver Correção" abaixo.</p>');
				if (maxTentativas < 10000000){
					let numRestTentativas = maxTentativas - tentativa;
					if (numRestTentativas > 1)
						$('#divMaxTentativas').html('Não foi dessa vez! Você tem mais '+numRestTentativas+' tentativas pra responder esse exercício e tirar nota igual ou acima de '+(notaMinima*indiceMultiplicadorNota));
					else if (numRestTentativas == 1)
						$('#divMaxTentativas').html('Não foi desta vez! Você só tem <b>mais 1 tentativa</b> pra responder esse exercício e tirar nota igual ou acima de '+(notaMinima*indiceMultiplicadorNota));
					else{
						$('#novamente').hide();
						$('#divMaxTentativas').html('Não foi desta vez! Seu exercício foi finalizado com esta sua última nota');
					}
					$('#divMaxTentativas').show();
				}
			}
		}
		//
		var divNotaW = $('.divNota').width();
		var divNotaH = $('.divNota').height();
		var windowW = $(window).width();
		var windowH = $(window).height();
		//
		$('.divNota').css('left', (windowW/2) - (divNotaW/2));
		$('.divNota').css('top', (windowH/2) - (divNotaH/2));
	}
	//
	//
	$("#correcao").click(function () {
		verCorrecaoF();		
		//location.reload();
	});
	function verCorrecaoF(){
		//
		for (var i = 0; i < arrQuestoes.length; i++) {
			//
			var idQuestao = arrQuestoes[i].questao.id;
			var tipoQuestao = arrQuestoes[i].questao.tipo;
			var peso = arrQuestoes[i].questao.peso;
			var formulaQuestao = arrQuestoes[i].formula;
			var alternativasQuestao = arrQuestoes[i].alternativa;
			var totalAlternativas = arrQuestoes[i].alternativa.length;
			var locked = arrQuestoes[i].questao.locked;
			var pergunta = replaceAll(replaceAll(arrQuestoes[i].questao.pergunta, '<p', '<span'), '</p>', '</span>');

			// COMENTARIOS
			var comentarioHTML = '';
			if (locked == "true" || locked == "false") {
				if (tipoQuestao == "2") {
					var comentarios = [];
					for (var k = 0; k < alternativasQuestao.length; k++) {
						var alt = alternativasQuestao[k];
						for (var a = 0; a < arrRespostasAluno.length; a++){
							if (arrRespostasAluno[a].status === "Ativado") {
								var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
								var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
								comentarios.push(comentario);
							}
						}
						
					}
					if (comentarios.length > 0) {
						if (comentarios.length === 2 && comentarios[0] === comentarios[1]) {
							comentarioHTML = '<div class="comentario">'+comentarios[0]+'</div>';
						} else {
							comentarioHTML = '<div class="comentario">'+comentarios.join(' / ')+'</div>';
						}
					}
				} else {
					/*for (var k = 0; k < alternativasQuestao.length; k++) {
						var alt = alternativasQuestao[k];
						for (var a = 0; a < arrRespostasAluno.length; a++){
							if (arrRespostasAluno[a].status === "Ativado") {
								var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
								var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
								if (comentario.startsWith("acervo#")) {
									var acervoId = comentario.split("#")[1].trim();
									var idLogin = new URLSearchParams(window.location.search).get("idLogin");
									var token = new URLSearchParams(window.location.search).get("token");
									var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid="
													+ acervoId + "&idLogin=" + idLogin + "&token=" + token;
									comentarioHTML = '<div class="comentario" id="acervo-placeholder-'+acervoId+'">'
												+   '<img src="./imgs/playBtn.png"'
												+       'class="acervo-play-btn"'
												+       'data-url="'+acervoUrl+'"'
												+       'style="cursor:pointer;"'
												+       'alt="Play vídeo do acervo"/>'
												+ '</div>';
								} else {
									comentarioHTML = '<div class="comentario">'+comentario+'</div>';
								}
								break;
							}
						}
						
					}*/
					for (var k = 0; k < alternativasQuestao.length; k++){
						var alt = alternativasQuestao[k];
						for (var a = 0; a < arrRespostasAluno.length; a++){
							if (arrRespostasAluno[a].status === "Ativado"){
								var isCerta = (alt.txtResposta === $.md5(alt.id + "CERTA"));
								var comentario = isCerta ? alt.comentarioRespCerta : alt.comentarioRespErrada;
								var comentarioHTML;

								if (comentario.includes("#acervo#")){
									var partes = comentario.split("#acervo#");
									var htmlAntes = partes[0];
									var acervoId = partes[1].trim();

									var idLogin = new URLSearchParams(window.location.search).get("idLogin");
									var token = new URLSearchParams(window.location.search).get("token");
									var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId + "&idLogin=" + idLogin + "&token=" + token;

									comentarioHTML = ''
										+ '<div class="comentario">'
										+	htmlAntes
										+	'<div id="acervo-placeholder-' + acervoId + '" style="margin-top:1vw;">'
										+		'<img src="./imgs/playBtn.png"'
										+			' class="acervo-play-btn"'
										+			' data-url="'+ acervoUrl +'"'
										+			' style="cursor:pointer;"'
										+			' alt="Play vídeo do acervo"/>'
										+	'</div>'
										+'</div>';
								}else if (comentario.startsWith("acervo#")) {
									var acervoId = comentario.split("#")[1].trim();
									var idLogin = new URLSearchParams(window.location.search).get("idLogin");
									var token = new URLSearchParams(window.location.search).get("token");
									var acervoUrl = "https://lms.drmicro.com.br/postWing/iesde/new/content.aspx?uuid=" + acervoId + "&idLogin=" + idLogin + "&token=" + token;

									comentarioHTML = '' 
												+ '<div class="comentario" id="acervo-placeholder-'+acervoId+'">'
												+   '<img src="./imgs/playBtn.png"'
												+       'class="acervo-play-btn"'
												+       'data-url="'+acervoUrl+'"'
												+       'style="cursor:pointer;"'
												+       'alt="Play vídeo do acervo"/>'
												+ '</div>';
								} else {
									comentarioHTML = '<div class="comentario">'+comentario+'</div>';
								}

								break;
							}
						}
					}
				}
			}
			//
			for (var j = 0; j < alternativasQuestao.length; j++) {
				//
				var idAlternativa = alternativasQuestao[j].id;
				//
				for (var a = 0; a < arrRespostasAluno.length; a++) {
					//
					var idAlternativaAluno = arrRespostasAluno[a].id;
					//
					if (idAlternativaAluno == idAlternativa) {
						//
						if (tipoQuestao < 3) {
							//
							var status = arrRespostasAluno[a].status; // Ativado ou Desativado
							var resposta = alternativasQuestao[j].txtResposta; // Certa ou Errada
							//
							
							// Para mostrar a resposta em verde sempre que visualizar a correção
							// if (resposta == $.md5(alternativasQuestao[j].id + "Certa"))
							// 	$('#r'+idAlternativa).parent().parent().find("label").css("color", "#00FF00");
							// if (status == "Ativado") {
							// 	if (resposta != $.md5(alternativasQuestao[j].id + "Certa"))
							// 		$('#r'+idAlternativa).parent().parent().find("label").css("color", "#FF0000");
							// }
							

							// Para mostrar a resposta em verde se o aluno acertou ou se ele errou, mas somente quando ele atingir a nota minima
							if (notaAtual >= notaMinima || (tentativa + 1) > maxTentativas){
								if (resposta == $.md5(alternativasQuestao[j].id + "CERTA")){
									$('#r'+idAlternativa).parent().parent().find("label").css("color", "#00FF00");
									$('#r'+idQuestao+idAlternativa).parent().parent().find("label").css("color", "#00FF00");
								}
								if (status == "Ativado") {
									if (resposta != $.md5(alternativasQuestao[j].id + "CERTA")){
										$('#r'+idAlternativa).parent().parent().find("label").css("color", "#FF0000");
										$('#r'+idQuestao+idAlternativa).parent().parent().find("label").css("color", "#FF0000");
									}
								}
							}else{
								// Para mostrar a resposta em verde somente se o aluno acertar
								// e quando não atingi a nota mínima
								if (status == "Ativado") {
									if (resposta == $.md5(alternativasQuestao[j].id + "CERTA")){
										$('#r'+idAlternativa).parent().parent().find("label").css("color", "#00FF00");
										$('#r'+idQuestao+idAlternativa).parent().parent().find("label").css("color", "#00FF00");
									}
									else{
										$('#r'+idAlternativa).parent().parent().find("label").css("color", "#FF0000");
										$('#r'+idQuestao+idAlternativa).parent().parent().find("label").css("color", "#FF0000");
									}
								}
							}
						}
						else {
							//
							var respostaAluno = arrRespostasAluno[a].resposta; // Texto da resposta do aluno
							var resposta = alternativasQuestao[j].txtResposta; // Texto da resposta verdadeira
							//
							if ($.md5(alternativasQuestao[j].id + respostaAluno.toUpperCase()) == resposta) {//if (respostaAluno == resposta) {
								//
								$('#q'+idAlternativa).css("color", "#00FF00");
							}
							else {
								//
								$('#q'+idAlternativa).css("color", "#FF0000");
							}
						}
					}
				}
			}

			// add bloco de comentario logo após area de respostas
			$('.page'+i+' .page_container').append(comentarioHTML);
		}
		//
		//
		$("input").each(function(){
			//
			$(this).prop('disabled', true);
		});
		//
		//$.fn.fullpage.moveTo(1);
		//
		$('.divNota').fadeOut(200, function(){
			//
			$('.divNota .page_container').text("");
			$('.main').fadeIn(200);
			//
			$("#correcao").hide();
		});

		
		// ==== handler de play do acervo ====
		$(document).on('click', '.acervo-play-btn', function(){
			var $img    = $(this);
			var url     = $img.data('url');
			var $ph     = $img.parent();
			$ph.html('<p class="comentarioMsg">Carregando vídeo…</p>');
			$.get(url)
			.done(function(data){
				if (!data.isError && data.uriEmbed) {
					$ph.html(
						'<iframe src="' + data.uriEmbed + '" '
					+ 'frameborder="0" class="comentarioIframe" '
					+ 'allowfullscreen width="100%" height="400px"></iframe>'
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

observer.observe(document.body, { childList: true, subtree: true });


	function addCSSClient(idNegocio){
		return; // desativado por enquanto pois não temos mais o Receitas de Vida
		if (!idNegocio)
			return;
	    if (idNegocio.indexOf('_') > 0)
	        idNegocio = idNegocio.substring(0, idNegocio.indexOf('_'));
	    idNegocio = idNegocio.replace('O', '');
	    idNegocio = parseInt(idNegocio);
	    if (!idNegocio)
	        return;
	    var url = '../metro/css/'+idNegocio+'.css'
	    $('head').append(
	        $('<link rel="stylesheet" type="text/css" href="' + url + '" />')
	    );
	}
});