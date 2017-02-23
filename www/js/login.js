$(document).ready(function(){
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		document.addEventListener("backbutton", onBackKeyDown, true);
	}

	function onBackKeyDown() {
        
	}
});


$(window).load(function(){
	deteclenguageLogin();
    onInit();
    verificSignOut();
    $("#pin").focus();
    $("#btnlogin").click(function(){
        var pin = $("#pin").val();
        var check = "";
        if($('.chkremember').hasClass('checked')){
            check = "1";
        }else{
            check = "0";
        }

        if(pin.length>0){
            validData(pin, check);
        }else{
            if(current_lang=='es'){
                mostrarModalGeneral("Pin Inválido");
            }
            else{
                mostrarModalGeneral("Invalid Pin"); 
            }
        }
    });
}); 

function changePinRemember(){
    if($('.chkremember').hasClass('checked')){
        $('.chkremember').removeClass('checked');
    }else{
        $('.chkremember').addClass('checked');
    }
}

//apretas el boton entrar en el LOGIN.HTML
function validData(pin, check) {
    //localStorage.RCSOnline_accServer=""+ip+","+port+","+urlbase+","+alias+","+site;
    var query ="SELECT * FROM " + TABLE_URL + " WHERE  " + KEY_USE + " = '1'";
    var pin=pin;
    var check=check;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var c_ip = results.rows.item(0).ip;
                var c_port = results.rows.item(0).port;
                var c_site = results.rows.item(0).site;
                var yurl = 'http://' + c_ip + ':' + c_port + '/' + c_site + '/login/session/post';
                var array = {Pin: pin};
                $.ajax({
                    url: yurl,
                    timeout: 15000,
                    type: 'POST',
                    data: JSON.stringify(array),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    crossdomain: true,
                    beforeSend: function () {
                        showLoading();
                    },
                    complete: function () {
                        hideLoading();
                    },
                    success: function (data, textStatus, XMLHttpRequest) {
                        //verifica que el pin es correcto
                        if (data.successful == 1) {
                            updatePinTableUrl(pin); 
                        } else {
                            if (current_lang == 'es'){
                                mostrarModalGeneral("PIN Invalido");
                            }else{
                                mostrarModalGeneral("Invalid PIN");
                            }
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        if (current_lang == 'es'){
                            mostrarModalGeneral("Error de Conexión");
                        }else{
                            mostrarModalGeneral("No Connection");
                        }
                    }
                });
            });
        });
    }catch (e) {
        console.log("Error updateState " + e + ".");
    }
    
}

//function para insertar el pin en la tabla urltable
function updatePinTableUrl(pin){
    try {
        var query = "UPDATE " + TABLE_URL + " SET  " + KEY_PIN + "='"+pin+"' WHERE "+KEY_USE+"='1'";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                localStorage.removeItem('RCSTools_StoreNo');
                //direcciona al MENU.html
                window.location.href = "menu.html";
            }, errorHandler);
        });
    } catch (e) {
        console.log("Error updatePinTableUrl " + e + ".");
    }

}


function verificSignOut(){
    var query = "SELECT * FROM " + TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            var alias=results.rows.item(0).alias;
            $('.siteName').val(alias);
        });
    });
}




function deteclenguageLogin(){
    var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguageLogin();
    }
}