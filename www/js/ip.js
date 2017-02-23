$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        //document.addEventListener("backbutton", onBackKeyDown, true);
        deteclenguageIp();
        onInit();
        if(checkNetConnection()==true){
            //1 yes, add a new server
            var variablEE = obtenerVariablesNewServer();
            if(variablEE ==0){
                existsData();
            }else{   
                //camibar el nombre del boton de ingresar --> agregar
                if (current_lang =='es'){
                    $("#btnenter").val("Agregar");
                }else{
                    $("#btnenter").val("Add");
                }
                $("#btn_left").removeAttr("hidden");
            }
        }else{
            $('#no_connection').modal('show');
            if (current_lang == 'es'){
                $('.titleMessage').text('Mensaje');
                $('.textNoConnection').text('No hay conexion de red');
                $('.btnok').text('Aceptar');
            }else{
                //modal para no conexion
            }
        }
    }
    // function onBackKeyDown() {
        //navigator.app.exitApp();     
    // }    
});

$(window).load(function(){
    deteclenguageIp();
    onInit();
    if(checkNetConnection()==true){
        //1 yes, add a new server
        var variablEE = obtenerVariablesNewServer();
        if(variablEE ==0){
            existsData();
        }else{   
            //camibar el nombre del boton de ingresar --> agregar
            if (current_lang =='es'){
                $("#btnenter").val("Agregar");
            }else{
                $("#btnenter").val("Add");
            }
            $("#btn_left").removeAttr("hidden");
        }
    }else{
        $('#no_connection').modal('show');
        if (current_lang == 'es'){
            $('.titleMessage').text('Mensaje');
            $('.textNoConnection').text('No hay conexion de red');
            $('.btnok').text('Aceptar');
        }else{
           //modal para no conexion
        }
    }

    /*esta funcion ocurre despues de que ya cargo toda la pagina*/
    $("#ip_1").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_1").val();
        if (variable > 255) {
            $("#ip_1").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_2").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_2").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_2").val();
        if (variable > 255) {
            $("#ip_2").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_3").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_3").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_3").val();
        if (variable > 255) {
            $("#ip_3").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("ip_4").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#ip_4").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
        var variable = $("#ip_4").val();
        if (variable > 255) {
            $("#ip_4").val("");
        } else {
            if (variable.length == 3) {
                document.getElementById("port").select();
            }
        }
    }).keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {/*valores del 0 - 9 segun el tabal ascii*/
            return false;
        }
    });

    $("#port").keypress(function (event) {
        if (event.keyCode < 48 || event.keyCode > 57) {
            return false;
        }
    });

    $("#btnenter").click(function () {
        var ip_1 = $("#ip_1").val();
        var ip_2 = $("#ip_2").val();
        var ip_3 = $("#ip_3").val();
        var ip_4 = $("#ip_4").val();
        var port = $("#port").val();
        var alias = $("#aliastext").val();
        var site = $("#sitetext").val();

        if (ip_1.length > 0 && ip_2.length > 0 && ip_3.length > 0 && ip_4.length > 0) {
            if (port.length > 0) {
                if (alias.length > 0) {
                    if (site.length > 0) {
                        site = site + "/WCFRCSReports.svc";
                        var ip = ip_1 + "." + ip_2 + "." + ip_3 + "." + ip_4;
                        validIP(ip, port, alias, site);
                    } else {
                        if (current_lang == 'es'){
                            mostrarModalGeneral("Sitio Inválido");
                        }
                        else{
                            mostrarModalGeneral("Invalid site");
                        }    
                    }
                } else {
                    if (current_lang == 'es'){
                        mostrarModalGeneral("Alias Inválido");

                    }else{
                        mostrarModalGeneral("Invalid alias");
                    }
                }
            } else {
                if (current_lang == 'es'){
                    mostrarModalGeneral("Puerto Inválido");
                }else{
                    mostrarModalGeneral("Invalid Port");
                }
            }
        }else{
            if (current_lang == 'es'){
                mostrarModalGeneral("IP Inválido");
            }else{
                mostrarModalGeneral("Insert IP");
            }
        }
    });
});


 

 


/************************ funcion valida IP ********************************************/
/*esta funcion es muy importante para no tener problemas de no poder ingresar a datos de servidores*/
//entra al ejecutar el APP
function validIP(ip, port, alias, site) {
    var urlbase = 'http://' + ip + ':' + port + '/' + site + '/Country/';
    $.ajax({
        url: urlbase,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 15000,
        crossdomain: true,
        async: true,
        beforeSend: function () {
            showLoading();
        },
        complete: function () {
            hideLoading();
        },
        success: function (data, textStatus, XMLHttpRequest) {
            console.log("COMPLETADO ... COMPLETADO");
            insertUrlBase(ip,port,urlbase,alias,"1",site,"");
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
}




function insertUrlBase(ip, port, urlbase, alias, use, site,pin){
    try {
        var query="SELECT * FROM "+TABLE_URL;
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var cant=results.rows.length;
                if(cant==0){
                    var query1 = "INSERT INTO " + TABLE_URL + " ( " + KEY_IP + " , " + KEY_PORT
                    + " , " + KEY_URLBASE + ", " + KEY_ALIAS + " , " + KEY_USE + ", " + KEY_SITE +" , "+KEY_PIN+") VALUES (?,?,?,?,?,?,?);";
                    localDB.transaction(function (transaction) {
                        transaction.executeSql(query1, [ip, port, urlbase, alias, use, site,pin], function (transaction, results) {
                        window.location.href = "login.html";
                        });
                    });
                }else{
                    var query2 = "UPDATE "+TABLE_URL+" SET "+KEY_USE+"='0'";
                    localDB.transaction(function (transaction) {
                        transaction.executeSql(query2, [], function (transaction, results) {
                         var query3 = "INSERT INTO " + TABLE_URL + " ( " + KEY_IP + " , " + KEY_PORT
                                + " , " + KEY_URLBASE + ", " + KEY_ALIAS + " , " + KEY_USE + ", " + KEY_SITE +" , "+KEY_PIN+") VALUES (?,?,?,?,?,?,?);";
                                localDB.transaction(function (transaction) {
                                transaction.executeSql(query3, [ip, port, urlbase, alias, use, site,pin], function (transaction, results) {
                                window.location.href = "login.html";
                                });
                            });
                        });
                    });
                }
            });
        });  
    } catch (e) {
        console.log("Error addData " + e + ".");
    }
}





function existsData(){
    var pin = "";
    var query = "SELECT *  FROM " + TABLE_URL+" WHERE "+KEY_USE+"='1'";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                if(results.rows.length>0){
                    pin= results.rows.item(0).pin;
                    if (pin=="") {
                        window.location.href= "login.html";
                    }else{
                        window.location.href= "menu.html";
                    }
                }
                
            }, function (transaction, error) {
                console.log("Error: " + error.code + "Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error existsData " + e + ".");
    }
    
}


function obtenerVariablesNewServer(){
    if(localStorage.RCSTools_newServer==null){
        localStorage.RCSTools_newServer=0;
        return 0;
    }else{
        if(localStorage.RCSTools_newServer==0){
            return 0;
        }else{
            localStorage.RCSTools_newServer=0;
            return 1;
        }
    }
}


function goMenu(){
    window.location.href="menu.html";
}

function buttonExitApp(){
    navigator.app.exitApp();
}

function deteclenguageIp(){
    var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguageIp();
    }

}