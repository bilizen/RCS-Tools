$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, true);
        deteclenguageMenu();
        onInit();
        if(checkNetConnection()==true){
        checkUser();
        verificateConfigImage();
        }else{
            $('#no_connection').modal('show');
            if (current_lang=='es'){
                $('.titleMessage').text('Mensaje');
                $('.textNoConnection').text('No hay conexion de red');
                $('.btnok').text('Aceptar');
            }else{
               //modal para no conexion
            }
        }  
    }

    function onBackKeyDown() {
        navigator.app.exitApp();     
    }
});


$(window).load(function(){
    deteclenguageMenu();
    onInit();
    if(checkNetConnection()==true){    
        checkUser();
        verificateConfigImage();
    }else{
        $('#no_connection').modal('show');
        if (current_lang=='es'){
            $('.titleMessage').text('Mensaje');
            $('.textNoConnection').text('No hay conexion de red');
            $('.btnok').text('Aceptar');
        }else{
           //modal para no conexion
        }
    }

    //radiobutton para las imagenes
    $('.radio_wrapper').click(function(){
        $('.radio_wrapper').removeClass('checked');
        $(this).addClass('checked');
        var a=$(this).attr('data-value');
        localStorage.RCSTools_databaseImage=a;
    });  
});




function verificateConfigImage(){
    $('.radio_wrapper').removeClass('checked');
    var databaseImage=localStorage.RCSTools_databaseImage;
    if(databaseImage==null){
        $('.database').addClass('checked');
        localStorage.RCSTools_databaseImage="1";
    }else{
        if(databaseImage=="1"){
            $('.database').addClass('checked');
        }else{
            $('.hosting').addClass('checked');
        }
    }
}


function checkUser(){
    try {
        var query1 = "SELECT * FROM " + TABLE_URL + " WHERE  " + KEY_USE + " = '1'";
        localDB.transaction(function (transaction) {
            transaction.executeSql(query1, [], function (tx, results) {
                var ip = results.rows.item(0).ip;
                var port = results.rows.item(0).port;
                var site = results.rows.item(0).site;
                var alias=results.rows.item(0).alias;
                var pin = results.rows.item(0).pin;
                var yurl = 'http://' + ip + ':' + port + '/' + site + '/RCSToolsLogin/POST';
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
                            $("#txtUser").text(data.employeeName);
                            $("#txtIP").text(ip);
                            $("#txtServer").text(alias);
                            $('.menu').empty();
                            $(data.report).each(function (index, value) {
                                if(value.functionCode==2602){
                                    localStorage.RCSTools_titleMod1=value.functionName;
                                    $('.menu').append("<button class ='waves-effect waves-light  item report1' onclick ='verificSelectStore()'>"+
                                    "<span class ='box'>"+
                                    "<span class ='iconReport'> </span>"+
                                    "<span class ='item_title lblgvst1' >"+value.functionName+"</span>"+
                                    "</span>"+
                                    "</button>");
                                }
                                if(value.functionCode==2603){
                                    localStorage.RCSTools_titleMod2=value.functionName;
                                    $('.menu').append("<button class ='waves-effect waves-light  item report2' onclick ='openModule2()'>"+
                                    "<span class ='box'>"+
                                    "<span class ='iconReport'> </span>"+
                                    "<span class ='item_title lblgvst2' >"+value.functionName+"</span>"+
                                    "</span>"+
                                    "</button>");
                                }
                                if(value.functionCode==2604){
                                    localStorage.RCSTools_titleMod3=value.functionName;
                                    $('.menu').append("<button class ='waves-effect waves-light  item report3' onclick ='verificSelectStore3()'>"+
                                    "<span class ='box'>"+
                                    "<span class ='iconReport'> </span>"+
                                    "<span class ='item_title lblgvst3' >"+value.functionName+"</span>"+
                                    "</span>"+
                                    "</button>");
                                }
                                if(value.functionCode==2605){
                                    localStorage.RCSTools_titleMod4=value.functionName;
                                    $('.menu').append("<button class ='waves-effect waves-light  item report4' onclick ='verificSelectStore4()'>"+
                                    "<span class ='box'>"+
                                    "<span class ='iconReport'> </span>"+
                                    "<span class ='item_title lblgvst4' >"+value.functionName+"</span>"+
                                    "</span>"+
                                    "</button>");
                                }
                            });                            
                        } else {
                            window.location.href = "login.html";
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        if (current_lang == 'es') {
                            mostrarModalGeneral("Error de Conexión");
                        } else {
                            mostrarModalGeneral("No Connection");
                        }
                    }
                });  
            });
        });
    } catch (e) {
    console.log("Error updateState " + e + ".");
    }
}

function showActualServer(){
    $('.show_actual_server').modal('show');
}


function showOptions(){
    $('#show_options').modal('show');
}

function mostrarModal() {
    $("#ServersList").modal({// cablear la funcionalidad real modal y mostrar el cuadro de diálogo
        "backdrop": "static",
        "keyboard": true,
        "show": true                     // garantizar el modal se muestra inmediatamente
    });
    getAllData();
}


function addID(abc){
    $('#ServersList').css('z-index','1030');
    $("#txtvalue").val(abc);
}        

function addIDDelete(id){
    $('#ServersList').css('z-index','1030');
    $("#txtvaluedelete").val(id);
}

function ocultaMiModal(){
    var id = $("#txtvalue").val();
    updateStateURL(id);
}

function ocultaMiModalDelete(){
    var id = $("#txtvaluedelete").val();
    deleteServer(id);
}


function newInfoServer(){
    localStorage.RCSTools_newServer=1;
    window.location.href = "ip.html";
}

function verificSelectStore(){
    try {
        if (localStorage.RCSTools_StoreNo!=null) {
            window.location.href = "module1.html";
        } else {
            show_modalAllStore1();
        }   
    }catch(e){
        console.log("error verificSelectStore:" + e);
    }    
}

function verificSelectStore3(){
    try {
        if (localStorage.RCSTools_StoreNo!=null) {
            window.location.href = "module3.html";
        } else {
            show_modalAllStore3();
        }   
    }catch(e){
        console.log("error verificSelectStore3:" + e);
    }    
}

function verificSelectStore4(){
    try {
        if (localStorage.RCSTools_StoreNo!=null) {
            window.location.href = "module4.html";
        } else {
            show_modalAllStore4();
        }   
    }catch(e){
        console.log("error verificSelectStore4:" + e);
    }    
}


function openModule1(){
    localStorage.RCSTools_StoreNo=$('.list_r1 .active').attr('data-value');
    localStorage.RCSTools_StoreName=$('.list_r1 .active').text();
    window.location.href = "module1.html";        
}

function openModule2(){
    window.location.href = "module2.html";    
}

function openModule3(){
    localStorage.RCSTools_StoreNo=$('.list_r3 .active').attr('data-value');
    window.location.href = "module3.html";
}

function openModule4(){
    localStorage.RCSTools_StoreNo=$('.list_r4 .active').attr('data-value');
    window.location.href = "module4.html";
}


//show store config
function show_modalConfigStore(){
    var xurl = "";
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
            xurl = "http://" + ip + ":" + port + "/" + site + "/GetAllStores/POST";
            $.ajax({
                url: xurl,
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
                    setTimeout(function () {
                    focusToactiveConfigStore();
                    }, 500);
                },
                success: function (data) {

                    if (data.quantity > 0) {
                        var StoreName;
                        var StoreNo;
                        var selectStoreNo=localStorage.RCSTools_StoreNo;
                        var show="";
                        $(".list_configStore").empty();
                        $(data.data).each(function (index, value) {
                            StoreNo = value.StoreNo;
                            StoreName = value.StoreName;
                            if(selectStoreNo!=null){
                                if (selectStoreNo == StoreNo) {
                                    show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreNo + "'  onclick=setConfigStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                } else {
                                    show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreNo + "'  onclick=setConfigStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";
                                } 
                            }else{                          
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreNo + "'  onclick=setConfigStoreNo('" + StoreNo + "');>" + StoreName + "</h1>";                              
                            }
                            
                        });
                        $('.list_configStore').append(show);
                        $('#show_modalConfigStore').modal('show');
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay tiendas");
                        }else{
                            mostrarModalGeneral("No stores");
                        }
                    }
                }, error: function (xhr, ajaxOptions, thrownError) {
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
}


//focus para el modal ConfigStore
function focusToactiveConfigStore() {
    var list = $('.list_configStore');
    list.animate({
        scrollTop: $('.list_configStore .active').offset().top - list.offset().top + list.scrollTop()
    });
}


//pinta la tienda que se selecciona ConfigStore
function setConfigStoreNo(storeNo) {
    $('.list_configStore h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
    localStorage.RCSTools_StoreNo=storeNo;
    localStorage.RCSTools_StoreName=$('.list_configStore .active').text();
}


//show store modulo1
function show_modalAllStore1() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var query ="SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + " = '1'";
    localDB.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/GetAllStores/POST";
            $.ajax({
                url: xurl,
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
                    setTimeout(function () {
                    focusToactiveStore();
                    }, 500);
                },
                success: function (data) {

                    if (data.quantity > 0) {
                        var StoreName;
                        var StoreNo;
                        var show = "";
                        $(".list_r1").empty();
                        $(data.data).each(function (index, value) {
                            StoreNo = value.StoreNo;
                            StoreName = value.StoreName;
                            if (index == 0) {
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreNo + "'  onclick=setStoreNo('"+StoreNo+"');>" + StoreName + "</h1>";      
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreNo + "'  onclick=setStoreNo('"+StoreNo+"');>" + StoreName + "</h1>";
                            }
                        });
                        $('.list_r1').append(show);
                        $('#show_modalStore1').modal('show');
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay tiendas");
                        }else{
                            mostrarModalGeneral("No stores");
                        }
                    }
                }, error: function (xhr, ajaxOptions, thrownError) {
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
}

//show store modulo3
function show_modalAllStore3() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var query ="SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + " = '1'";
    localDB.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/GetAllStores/POST";
            $.ajax({
                url: xurl,
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
                    setTimeout(function () {
                    focusToactiveStore3();
                    }, 500);
                },
                success: function (data) {

                    if (data.quantity > 0) {
                        var StoreName;
                        var StoreNo;
                        var show = "";
                        $(".list_r3").empty();
                        $(data.data).each(function (index, value) {
                            StoreNo = value.StoreNo;
                            StoreName = value.StoreName;
                            if (index == 0) {
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreNo + "'  onclick=setStoreNo3('"+StoreNo+"');>" + StoreName + "</h1>";      
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreNo + "'  onclick=setStoreNo3('"+StoreNo+"');>" + StoreName + "</h1>";
                            }
                        });
                        $('.list_r3').append(show);
                        $('#show_modalStore3').modal('show');
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay tiendas");
                        }else{
                            mostrarModalGeneral("No stores");
                        }
                    }
                }, error: function (xhr, ajaxOptions, thrownError) {
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
}

//show store modulo4
function show_modalAllStore4() {
    var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var query ="SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + " = '1'";
    localDB.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/GetAllStores/POST";
            $.ajax({
                url: xurl,
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
                    setTimeout(function () {
                    focusToactiveStore4();
                    }, 500);
                },
                success: function (data) {

                    if (data.quantity > 0) {
                        var StoreName;
                        var StoreNo;
                        var show = "";
                        $(".list_r4").empty();
                        $(data.data).each(function (index, value) {
                            StoreNo = value.StoreNo;
                            StoreName = value.StoreName;
                            if (index == 0) {
                                show += "<h1 class='storeName-" + StoreNo + " active' data-value='" + StoreNo + "'  onclick=setStoreNo4('"+StoreNo+"');>" + StoreName + "</h1>";      
                            } else {
                                show += "<h1 class='storeName-" + StoreNo + "' data-value='" + StoreNo + "'  onclick=setStoreNo4('"+StoreNo+"');>" + StoreName + "</h1>";
                            }
                        });
                        $('.list_r4').append(show);
                        $('#show_modalStore4').modal('show');
                    }else{
                        if (current_lang == 'es'){
                            mostrarModalGeneral("No hay tiendas");
                        }else{
                            mostrarModalGeneral("No stores");
                        }
                    }
                }, error: function (xhr, ajaxOptions, thrownError) {
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
}

//focus para el modal store
function focusToactiveStore() {
    var list = $('.list_r1');
    list.animate({
        scrollTop: $('.list_r1 .active').offset().top - list.offset().top + list.scrollTop()
    });
}

//focus para el modal store
function focusToactiveStore3() {
    var list = $('.list_r3');
    list.animate({
        scrollTop: $('.list_r3 .active').offset().top - list.offset().top + list.scrollTop()
    });
}

//focus para el modal store
function focusToactiveStore4() {
    var list = $('.list_r4');
    list.animate({
        scrollTop: $('.list_r4 .active').offset().top - list.offset().top + list.scrollTop()
    });
}

//pinta la tienda que se selecciona
function setStoreNo(storeNo) {
    $('.list_r1 h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
}

//pinta la tienda que se selecciona
function setStoreNo3(storeNo) {
    $('.list_r3 h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
}

//pinta la tienda que se selecciona
function setStoreNo4(storeNo) {
    $('.list_r4 h1').removeClass('active');
    $('.storeName-' + storeNo).addClass('active');
}

function updateStateURL(id) {
    var query = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '0'";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var query2 = "UPDATE " + TABLE_URL + " SET " + KEY_USE + " = '1' WHERE " + KEY_ID + " = ? ";  
                localDB.transaction(function (transaction) {
                    transaction.executeSql(query2, [id], function (transaction, results) {
                        localStorage.removeItem('RCSTools_StoreNo');
                        location.reload();
                    });
                });
            });
        });
    } catch (e) {
        console.log("Error updateState " + e + ".");
    }
}


function deleteServer(id) {
    var query1 = "SELECT " + KEY_USE + " FROM " + TABLE_URL + " WHERE " + KEY_ID + " = ?";
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query1, [id], function (transaction, results) {
                var total = results.rows.item(0).use;
                if (total == 1) {
                    mostrarModalGeneral("Servidor en uso");
                } else {
                    var query2 = "DELETE FROM " + TABLE_URL + " WHERE " + KEY_ID + " = ? ";
                    localDB.transaction(function (transaction) {
                        transaction.executeSql(query2, [id], function (transaction, results) {
                        }, errorHandler);
                    });
                }
            }, errorHandler);
        });
    } catch (e) {
        console.log("Error deleteServer " + e + ".");
    }
}

function getAllData() {
    var query = "SELECT " + KEY_ID + ", " + KEY_URLBASE + "," + KEY_ALIAS + " FROM " + TABLE_URL;
    try {
        localDB.transaction(function (transaction) {
            transaction.executeSql(query, [], function (transaction, results) {
                var mostrar = "";
                $("#divlistado").empty();
                for (var i = 0; i < results.rows.length; i++) {

                    var row = results.rows.item(i);
                    var _id = row['id'];
                    var _alias = row['alias'];
                    var _url = row['urlBase'];

                    //<div class="alias-item" id="alias-item">Cambiar de Alias 1 <button type="button" class="delete">×</button></div>

                    mostrar += "<div class='collection-item'> ";
                    mostrar += "<span data-toggle='modal' data-dismiss='modal' data-target='#ModalConfirm' onclick=\"addID(" + _id + ")\">" + _alias + "</span> ";//data-target ???
                    mostrar += "<button type='button' data-dismiss='modal' class='delete btn btn-fab red darken-1' data-toggle='modal' data-target='#ModalConfirmDelete' ";
                    mostrar += "onclick=\"addIDDelete(" + _id + ")\"><i class='material-icons right'></i></button></div>";
                }
                $("#divlistado").append(mostrar);


            }, function (transaction, error) {
                console.log("Error: " + error.code + "<br>Mensage: " + error.message);
            });
        });
    } catch (e) {
        console.log("Error getAllData " + e + ".");
    }
}

function modalMoreOptions(){
    $('#show_modalMoreOptions').modal('show');
}

function showImageRoot(){
    $('#show_imagesRoot').modal('show')
}

function showSignOut(){
    $('#ModalConfirmSignOut').modal('show');  
}

function confirmSignOut(){
    var query="UPDATE " + TABLE_URL + " SET "+KEY_PIN+"=''  WHERE " + KEY_USE + " = '1'";
    try{
        localDB.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, results) {
                window.location.href = "login.html"; 
            })
        });
    }catch (e){
        console.log("Error updateState " + e + ".");
    }  
}

function buttonExitApp(){
    navigator.app.exitApp();   
}

function deteclenguageMenu(){
    var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguageMenu();
    }
}