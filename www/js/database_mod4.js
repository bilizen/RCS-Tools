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
	deteclenguageModule4();
	onInit();
    responsive_window();
    checkValuesLocalStorage();
    getListStore();

    $(document).on('click','.storeArea',function(){	    	

    	var activeStore = $(this).find('.storeName');

    	if(activeStore.hasClass('active')){			
    		activeStore.removeClass('active');
    	}else{
    		$('.storeArea').find('.storeName').removeClass('active');
    		activeStore.addClass('active');
    	}
    	var storeNo=$(this).attr('data-value');
    	temporalyStore=storeNo;
    	updateModalFields(storeNo);
    });

    $('.btnSendEmail').click(function(){

    	$('#show_detailStore').modal('hide');

    	if( $('.emailClient').val() == "" ){
    		$('#show_emailMessage').modal('show');
    	}else{
    		var storeNo=temporalyStore;
    		var email=$('.emailClient').val();
    		sendEmailClient(email,storeNo);
    	}
    });

    $('.btnOkEmail').click(function(){
    	$('#show_detailStore').modal('show');
    });
});

$(window).resize(function() {
	responsive_window();
});

var temporalyStore=0;

function updateModalFields(storeNo){
	var array={StoreNo:storeNo};
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
            xurl = "http://" + ip + ":" + port + "/" + site + "/ListInformationStores/POST";
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

	        	 	var city = '';
	        	 	$('.address1, .address2, .city, .country, .phone').css('display', 'block');
	        	 	if (data.quantity>0){
	        	 		if (!(data.data[0].Address1.length > 0)) { $('.address1').css('display', 'none'); } else { $('.address1').text(data.data[0].Address1); }
	        	 		if (!(data.data[0].Address2.length > 0)) { $('.address2').css('display', 'none'); } else { $('.address2').text(data.data[0].Address2); }
	        	 		if (data.data[0].City.length > 0) city = city + data.data[0].City+', ';
	        	 		if (data.data[0].State.length > 0) city = city + data.data[0].State+' ';
						if (data.data[0].ZipCode.length > 0) city = city + data.data[0].ZipCode;
						if (!(city.length > 0)){ $('.city').css('display', 'none'); } else { $('.city').text(city); }       	 		
	        	 		if (!(data.data[0].CountryName.length > 0)) { $('.country').css('display', 'none'); } else { $('.country').text(data.data[0].CountryName); }
	        	 		if (!(data.data[0].Phone1.length > 0)) { $('.phone').css('display', 'none'); } else { $('.phone').text(data.data[0].Phone1); }	           				           			
	           			$('#show_detailStore').modal('show');
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

function sendEmailClient(email,storeNo){
	$('.emailClient').val('');
	var email=email;
	var storeNo=storeNo;
	var array={Email:email,StoreNo:storeNo};
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
            xurl = "http://" + ip + ":" + port + "/" + site + "/SendInformationStore/POST";
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
		           	if (data.succesful==1){
		           		if (current_lang == 'es'){
		                	mostrarModalGeneral("Mensaje enviado");
			            }else{
			                mostrarModalGeneral("Message sent");
			            }
		           		console.log("data succesful");	
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

function checkValuesLocalStorage(){
	$('.TitleStoreInfo').text(localStorage.RCSTools_titleMod4);
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


function getListStore(){
	var storeNo=localStorage.RCSTools_StoreNo;
	var array={StoreNo:storeNo};
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
            xurl = "http://" + ip + ":" + port + "/" + site + "/ListInformationStores/POST";
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
							cad+="<div class='storeArea' data-value='"+value.StoreNo+"'>"+
              					"<div class='storeName'>"+
                				"<p class='txtStoreName'>"+value.StoreName+"</p>"+
              					"</div></div>";
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


function deteclenguageModule4(){
	var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es'){
        changeLanguageModule4();
    }
}