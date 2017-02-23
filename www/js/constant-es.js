function changeLanguageIp(){
    $("#lblmsg1").html("Ingrese la dirección IP del Servidor"); 
    $("#lblmsg2").html("Puerto: ");
    $("#lblmsg3").html("Alias: ");
    $("#lblmsg4").html("Sitio: ");
    $("#txtpreferences_index").html("Atrás");
    $("#btnenter").val("Ingresar");

    $('.titleMessage').text("Mensaje");
    $('.btnok').html('Aceptar')
}

/////////////////////////////

function changeLanguageLogin(){
    
    $(".lblSite").html("Sitio:");
    $(".lblPinEmployee").html("Pin del Empleado:");
    $("#btnlogin").val("Entrar");


    $('.titleMessage').text("Mensaje");
    $('.btnok').html("Aceptar");
}

////////////////////////////

function changeLanguageMenu(){
    $("#lblchangealit").html("Servidores");
    $(".close").html("Cerrar");
    $(".close.back").html("Atrás");
    $("#lblchangealic").html("¿Desea cambiar de Servidor?"); 
    $("#btnsi").html("Si");   
    $("#lbldeleteser").html("¿Desea eliminar este Servidor?");
    $("#btnsidelete").html("Si");


    $('#lblToolsTitle').html("Configuraciones"); 
    $('#txtServerT').text('Servidor: ');
    $('#txtIpT').text('IP: ');
    $('#txtUserT').text('Usuario: ');
    
    
    $('.actual_server').text('Servidor Actual');
    $('#lblViewServer').text('Servidor Actual');
    $("#servers_list").html("Servidores");
    $("#add_alias").html("Añadir Servidor");
    $(".lblMoreOptions").html("Más opciones");

    $(".lblImageRoot").html("Ruta de imagen");
    $(".lblChooseStore").html("Elegir tienda");

    $(".lblHosting").html("Hosting");
    $(".lblGlobal").html("Base de datos");

    $('#btnSignOut').text("Cerrar sesión");
    $('#lblSignOut').text("¿Está seguro que quiere cerrar sesión?");
    $('#btnYesSignOut').text("Si");
    $('.btnok').html('Aceptar');


    $('#title_store_menu_r1').text('Elija su tienda');

}

//////////////////////////////
function changeLanguageReport1(){    
    $('#txtpreferences').html("Atrás");
    $('.lblCode').html("Código");
    $('.btnScan').html("Escaner");
    $('.listSize').html("Talla");
    $('.btnok').html("Aceptar");
    $('.lblStyle').html("Estilo");
    $('.lblPrice').html("Precio");
    $('.lblCMP').html("Compañia");
    $('.btnOthersStock').html("Otras tiendas");
    $('.btnPromotions').text('Promociones');
    $('.TitleListSizes').html("Lista de tallas");
    $('.TitleListColors').html("Lista de Colores");

    $('.txtStoreName').html("Tienda");

    $('.txtPromotionsName').text("Nombre");
    $('.txtStartDate').text("Fecha inicio");
    $('.txtEndDate').text("Fecha fin");

    $('.titleMessage').text("Mensaje");
    $('.btnok').html("Aceptar");
    $(".close").html("Cerrar");
}
/////////////////////////////////////////
function changeLanguageModule2(){
    $('#txtpreferences').html("Atrás");
    $('.lblArea').html("Área");
    $('.btnScan').html("Escaner");
    $('.lblQty').html("Cantidad");
    $('.btnExport').html("Exportar");
    $('.titleMessage').text("Mensaje");
    $('.btnok').html('Aceptar');
    $('#btnsidelete').html('Si');
    $('#lbldeleteser').html('¿Desea eliminar esta fila?');
}
//////////////////////////////////
function changeLanguageModule3(){
    $('#txtpreferences').text("Atrás");
}
//////////////////////////////////
function changeLanguageModule4(){
    $('#txtpreferences').text("Atrás");
    $('.txtAddress').text("Dirección");
    $('.close').text("Cerrar");
    $('.btnSendEmail').text("Enviar correo");
    $('.emailClient').attr('placeholder','Ingrese correo');
    $('.btnok').text('Aceptar');
    $('.titleMessage').text('Mensaje'); 
    $('.txtemailMessage').text('Compruebe por favor el campo requerido');
}