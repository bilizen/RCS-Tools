$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
  	}

    function onBackKeyDown() {
    	window.location.href = "menu.html";     
    }
});


$(window).load(function(){
	deteclenguageModule3();
	onInit();
    responsive_window();
    checkValuesLocalStorage();
    getLisPromotions();
    $(document).on('click','.promoArea',function(){	    	
    	var promoDetail = $(this).find('.promoDetail');
    	var colorName = $(this).find('.promoName');
    	if(promoDetail.hasClass('showDetailPromo')){			
    		promoDetail.removeClass('showDetailPromo');
    		colorName.removeClass('active');
    	}else{
    		$('.promoArea').find('.promoDetail').removeClass('showDetailPromo');
    		$('.promoArea').find('.promoName').removeClass('active');
    		promoDetail.addClass('showDetailPromo');
    		colorName.addClass('active');
    	}
    });
});

$(window).resize(function() {
	responsive_window();
});


function checkValuesLocalStorage(){
	$('.TitlePromotions').text(localStorage.RCSTools_titleMod3);
}

function getLisPromotions(){
	var getDate=getStringDate();
	var storeNo=localStorage.RCSTools_StoreNo;
	var array={StoreNo:storeNo,Date:getDate};
	var xurl="";
 	var ip = "";
    var port = "";
    var alias = "";
    var site = "";
	 localDB.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ' + TABLE_URL + ' WHERE ' + KEY_USE + ' = 1', [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/ListPromotionsStores/POST";
			$.ajax({
				url: xurl,
		        type: 'POST',
		        data: JSON.stringify(array),
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        crossdomain: true,
		        async: true,
		        beforeSend: function () {
		            showLoading();
		        },
		        complete: function () {
		            hideLoading();
		        },
		        success: function (data, textStatus, XMLHttpRequest) {
		           	if (data.quantity>0){
		           		var cad="";
		           		$(data.data).each(function(index,value){
		           				cad+="<div class='promoArea'>"+
                					"<div class='promoName'>"+
                  					"<p class='txtDiscount'>"+value.PromoName+"</p>"+
                					"</div>"+
                					"<div class='promoDetail'>"+
                  					"<table>"+
                    				"<tr><td>Fecha Inicio:</td><td>"+convertDate(value.StartDate)+"</td>"+
                    				"</tr>"+
                    				"<tr><td>Fecha Fin:</td><td>"+convertDate(value.EndDate)+"</td>"+
                    				"</tr>"+
                  					"</table>"+
                					"</div>"+
              						"</div>";
		           		});
		           		$('.stores').append(cad);
		           	}
		        },
		        error: function (xhr, ajaxOptions, thrownError) {
		            console.log(xhr.status);
		            console.log(xhr.statusText);
		            console.log(xhr.responseText);
		            if (current_lang == 'es'){
		                mostrarModalGeneral("Error de Conexión");
		            }else{
		                mostrarModalGeneral("Connection Fail");
		            }
		        }
			});	
		});
    });
}

function responsive_window(){
	var windowHeight = $(window).height();
	var header = $('header').height();
	// detect device
	if( /Android|webOS/i.test(navigator.userAgent) ) {
	    $('#items').height(windowHeight-header);
	}else{
		$('#items').height(windowHeight-header);
	}
}

function menu(){
    window.location.href = "menu.html";
}

function convertDate(cad){
	var arr=cad.split('-');
	var orderDate="";
	if (current_lang == 'es') {
    	orderDate=arr[2]+"/"+arr[1]+"/"+arr[0];
	}else{
		orderDate=arr[1]+"/"+arr[2]+"/"+arr[0];
	}
	return orderDate;
}

function getStringDate(){
	var d1 = new Date();
    var month = d1.getMonth() + 1;
    var day = d1.getDate();
    var hours= d1.getHours();
	var minutes = d1.getMinutes();
	var second=d1.getSeconds();
    var stringDate =d1.getFullYear()+'-'+ (('' + month).length < 2 ? '0' : '') + month +'-'+(('' + day).length < 2 ? '0' : '') + day+
    				' '+(('' + hours).length < 2 ? '0' : '')+hours+':'+(('' + minutes).length < 2 ? '0' : '')+minutes+
    				':'+((''+second).length<2 ? '0':'')+second;
    return stringDate;
}

function deteclenguageModule3(){
	var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es'){
        changeLanguageModule3();
    }
}