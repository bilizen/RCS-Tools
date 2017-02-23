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
	deteclenguageReport1();
	onInit();
    responsive_window(); //Responsive window : design_report1.js
    checkValuesLocalStorage();
    if(localStorage.RCSTools_CodeScan==""){
    	$('#txtCode').focus();
    }else{
		getDataCode(localStorage.RCSTools_CodeScan);
    	localStorage.RCSTools_CodeScan="";
    }

    $("#txtCode").keyup(function (event) {/*mientras estoy escrbiendo el numero*/
       	if(event.which == 13) {
			$('#txtCode').blur();
        	searchCode();
	   	}
	});
});

$(window).resize(function() {
  responsive_window();
});


function checkValuesLocalStorage(){
	if(localStorage.RCSTools_CodeScan==null){
		localStorage.RCSTools_CodeScan="";
	}
    localStorage.RCSTools_StyleCode=0;
    $('.titleStoreName').text(localStorage.RCSTools_StoreName);
    $('.titleNameReport').text(localStorage.RCSTools_titleMod1);
}

function responsive_window(){
	var windowHeight = $(window).height();
	var scan = $('.scan').height();
	var datainfo = $('.datainfo').height();
	// detect device
	if( /Android|webOS/i.test(navigator.userAgent) ) {
	    $('.imgProduct').height(windowHeight - scan - datainfo - 59); 
	}else{
		$('.imgProduct').height(windowHeight - scan - datainfo - 79); 
	}
}



function menu(){
    window.location.href = "menu.html";
}

function searchCode(){
	var cod=$('.txtSku').val();
	if(cod==""){
		if (current_lang == 'es'){
            mostrarModalGeneral("No hay código");
        }else{
            mostrarModalGeneral("No code");
        }
	}else{
		getDataCode(cod);
	}
}

function goScan(){
	window.location.href = "scan.html";
}


var GlobalSizeCode="";
var GlobalColorCode="";
var sku=0;

function getDataCode(cod){
	var cod=cod;
	var query="SELECT * FROM "+TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
            var ip = results.rows.item(0).ip;
            var port = results.rows.item(0).port;
            var alias = results.rows.item(0).alias;
            var site = results.rows.item(0).site;
			var xurl = "http://" + ip + ":" + port + "/" + site + "/GetInfoProduct/POST"
			var storeNo=parseInt(localStorage.RCSTools_StoreNo);
			var imageDataBase=parseInt(localStorage.RCSTools_databaseImage);
			var array={CodeProduct:cod,StoreNo:storeNo,ImageDataBase:imageDataBase};
			$('.txtSku').val("");
			$('.btnSizes').empty();
			$('.btnColor').empty();
			$('.txtStyle').val("");
			$('.txtPrice').val("");
			$('.txtSock').val("");
			$('.txtCmp').val("");
			$('.txtDescription').text("");
			$('.showProduct').attr('src',"");
			$.ajax({
		        url: xurl,
                type: 'POST',
                data: JSON.stringify(array),
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
		           	if (data.quantity>0){
		           		sku=data.data.SKU;
		           		localStorage.RCSTools_StyleCode=data.data.StyleCode;
						$('.btnSizes').append(data.data.SizeCode+"<span class='caret'></span>");
						GlobalSizeCode=data.data.SizeCode;
						$('.btnColor').append(data.data.ColorName+"<span class='caret'></span>");
						GlobalColorCode=data.data.ColorCode;
						$('.txtStyle').val(data.data.StyleName);
						$('.txtPrice').val(data.data.RetailPrice);
						$('.txtSock').val(data.data.QtyStore);
						$('.txtCmp').val(data.data.QtyCMP);
						$('.txtDescription').append(data.data.VendorName+"<br>"+
                            data.data.Desc1+"<br>"+
                            data.data.ColorLongName+"<br>");
						if(parseInt(cod)==data.data.SKU){
							$('.txtDescription').append(data.data.SKU);
						}else{
							$('.txtDescription').append(data.data.SKU+"/"+cod);
						}
						if(localStorage.RCSTools_databaseImage=="1"){
							if(data.data.Picture==""){
								if (current_lang == 'es'){
				               		document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound-es.jpg');
					            }else{
					                document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound.jpg');
					            }
							}else{
								document.getElementById('imageProduct').setAttribute( 'src','data:image/png;base64,'+data.data.Picture);
							}	
						}else{
							if(data.data.Picture==""){
								if (current_lang == 'es'){
				               		document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound-es.jpg');
					            }else{
					                document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound.jpg');
					            }
							}else{
								document.getElementById('imageProduct').setAttribute( 'src',data.data.Picture);
							}
						}					
		           	}else{
		           		if (current_lang == 'es'){
		               		mostrarModalGeneral("No hay Producto");
			            }else{
			                mostrarModalGeneral("No Product");
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
		                mostrarModalGeneral("Connection Fail");
		            }
		        }
		    });
    	});
	});
}



function writeListSizes() {
	var query="SELECT * FROM "+TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
            var ip = results.rows.item(0).ip;
            var port = results.rows.item(0).port;
            var alias = results.rows.item(0).alias;
            var site = results.rows.item(0).site;
			var xurl = "http://" + ip + ":" + port + "/" + site + "/GetSizeCode/POST"
			var styleCode=parseInt(localStorage.RCSTools_StyleCode);
			var array={StyleCode:styleCode};
			if(styleCode!=0){
				$.ajax({
			        url: xurl,
	                type: 'POST',
	                data: JSON.stringify(array),
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
			        	$('.loadlistSizes').empty();
			           	if (data.quantity>1){
			           		$(data.data).each(function (index, value) {
			           			if (GlobalSizeCode == value.SizeCode) {
			           				$('.loadlistSizes').append("<h1 class='sizeItem sizeItem-" +index+ " active'   onclick=setSize('" + value.SizeCode + "','"+index+"');>" + value.SizeCode + "</h1>");  
			           			}else{
			           				$('.loadlistSizes').append("<h1 class='sizeItem sizeItem-" +index+ "'   onclick=setSize('" + value.SizeCode + "','"+index+"');>" + value.SizeCode + "</h1>");  
			           			}	
	                        });
							$('#show_listSizes').modal('show');
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
			}	
    	});
	});
}

//pinta se selecciona la talla
function setSize(sizeCode,index) {
    $('.loadlistSizes h1').removeClass('active');
    $('.sizeItem-' + index).addClass('active');
    var colorCode=GlobalColorCode;
    getProductSizeColor(sizeCode,colorCode);
    $('#show_listSizes').modal('hide');
}



function writeListColors() {
	var query="SELECT * FROM "+TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
            var ip = results.rows.item(0).ip;
            var port = results.rows.item(0).port;
            var alias = results.rows.item(0).alias;
            var site = results.rows.item(0).site;
			var xurl = "http://" + ip + ":" + port + "/" + site + "/GetColorname/POST"
			var styleCode=parseInt(localStorage.RCSTools_StyleCode);
			var array={StyleCode:styleCode};
			if(styleCode!=0){
				$.ajax({
			        url: xurl,
	                type: 'POST',
	                data: JSON.stringify(array),
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
			        	$('.loadlistColors').empty();
			           	if (data.quantity>1){
			           		$(data.data).each(function (index, value) {
	                             if (GlobalColorCode == value.ColorCode) {
			           				$('.loadlistColors').append("<h1 class='colorItem colorItem-" +index+ " active'   onclick=setColor('" + value.ColorCode + "','"+index+"');>" + value.ColorName + "</h1>");  
			           			}else{
			           				$('.loadlistColors').append("<h1 class='colorItem colorItem-" +index+ "'   onclick=setColor('" + value.ColorCode + "','"+index+"');>" + value.ColorName + "</h1>");  
			           			}  
	                        });
	                        $('#show_listColors').modal('show');
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
			}	
		});
	});
}

//pinta cuadno se selecciona el color
function setColor(colorCode,index) {
    $('.loadlistColors h1').removeClass('active');
    $('.colorItem-'+index).addClass('active');
    var sizeCode=GlobalSizeCode;
    getProductSizeColor(sizeCode,colorCode);
    $('#show_listColors').modal('hide');
}


function getProductSizeColor(sizeCode,colorCode){
	var query="SELECT * FROM "+TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
            var ip = results.rows.item(0).ip;
            var port = results.rows.item(0).port;
            var alias = results.rows.item(0).alias;
            var site = results.rows.item(0).site;
			var xurl = "http://" + ip + ":" + port + "/" + site + "/GetProductSizeColor/POST"
			var storeNo=parseInt(localStorage.RCSTools_StoreNo);
			var styleCode=parseInt(localStorage.RCSTools_StyleCode);
			var imageDataBase=parseInt(localStorage.RCSTools_databaseImage);
			var array={StyleCode:styleCode,StoreNo:storeNo,SizeCode:sizeCode,ColorCode:colorCode,ImageDataBase:imageDataBase};
			$.ajax({
		        url: xurl,
                type: 'POST',
                data: JSON.stringify(array),
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
		           	if (data.quantity>0){
		           		$('.txtSku').val("");
						$('.btnSizes').empty();
						$('.btnColor').empty();
						$('.txtStyle').text("");
						$('.txtPrice').text("");
						$('.txtSock').text("");
						$('.txtCmp').text("");
						$('.txtDescription').text("");
						$('.showProduct').attr('src',"");

						sku=data.data.SKU;
		           		localStorage.RCSTools_StyleCode=data.data.StyleCode;
						$('.btnSizes').append(data.data.SizeCode+"<span class='caret'></span>");
						GlobalSizeCode=data.data.SizeCode;
						$('.btnColor').append(data.data.ColorName+"<span class='caret'></span>");
						GlobalColorCode=data.data.ColorCode;
						$('.txtStyle').val(data.data.StyleName);
						$('.txtPrice').val(data.data.RetailPrice);
						$('.txtSock').val(data.data.QtyStore);
						$('.txtCmp').val(data.data.QtyCMP);
						$('.txtDescription').append(data.data.VendorName+"<br>"+
	                        data.data.Desc1+"<br>"+
	                        data.data.ColorLongName+"<br>"+
							data.data.SKU+"/"+data.data.ALU);
						if(localStorage.RCSTools_databaseImage=="1"){
							if(data.data.Picture==""){
								if (current_lang == 'es'){
				               		document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound-es.jpg');
					            }else{
					                document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound.jpg');
					            }
							}else{
								document.getElementById('imageProduct').setAttribute( 'src','data:image/png;base64,'+data.data.Picture);
							}
						}else{
							if(data.data.Picture==""){
								if (current_lang == 'es'){
				               		document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound-es.jpg');
					            }else{
					                document.getElementById('imageProduct').setAttribute( 'src','../../img/imgNoFound.jpg');
					            }
							}else{
								document.getElementById('imageProduct').setAttribute( 'src',data.data.Picture);
							}
						}
		           	}else{
		           		if (current_lang == 'es'){
		                	mostrarModalGeneral("Producto no definido");
			            }else{
			                mostrarModalGeneral("Product not defined");
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
		                mostrarModalGeneral("Connection Fail");
		            }
		        }
		    });
    	});
	});
}


function showPromotionsOfProduct(){
	try{
		var xurl = "";
	    var ip = "";
	    var port = "";
	    var alias = "";
	    var site = "";
	    var query="SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + " ='1'";
	    localDB.transaction(function (tx) {
	        tx.executeSql(query, [], function (tx, results) {
	        	ip = results.rows.item(0).ip;
	            port = results.rows.item(0).port;
	            alias = results.rows.item(0).alias;
	            site = results.rows.item(0).site;
	            xurl = "http://" + ip + ":" + port + "/" + site + "/GetPromotionsForSku/POST";
	            var cadSku=" and Product.SKU ="+sku.toString();
	            var array= {CadSku:cadSku};
	            $.ajax({
				    url: xurl,
				    type: 'POST',
				    data: JSON.stringify(array),
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
				    success: function (data) {
				        if (data.quantity > 0) {
				            $(".loadPromotions").empty();
				            var show="";
				            $(data.data).each(function (index, value) {
				            	show +="<div class='storeRow'>"+
                                "<div class='col-xs-6 storeStock'>"+value.PromoName+"</div>"+
                                "<div class='col-xs-3 text-center storeStock'>"+(value.StartDate).substring(0,10)+"</div>"+
                                "<div class='col-xs-3 text-center storeStock'>"+(value.EndDate).substring(0,10)+"</div>"+
                            "</div>";  
				            });
				            $('.loadPromotions').append(show);
				        	$('#show_promotions').modal('show');
				        }
				    }, error: function (xhr, ajaxOptions, thrownError) {
				        console.log(xhr.status);
				        console.log(xhr.statusText);
				        console.log(xhr.responseText);
				        if (current_lang == 'es'){
				            mostrarModalGeneral("Error de Conexión");
				        }
				        else{
				            mostrarModalGeneral("No Connection");
				        }
				    }
				});
	        });
	    });
	}catch (e) {
    	console.log("Error showPromotionsOfProduct " + e + ".");
    }
}



function showOthersStores(){
	var xurl = "";
    var ip = "";
    var port = "";
    var alias = "";
    var site = "";
    var query="SELECT * FROM " + TABLE_URL + " WHERE " + KEY_USE + " ='1'";
    localDB.transaction(function (tx) {
        tx.executeSql(query, [], function (tx, results) {
            ip = results.rows.item(0).ip;
            port = results.rows.item(0).port;
            alias = results.rows.item(0).alias;
            site = results.rows.item(0).site;
            xurl = "http://" + ip + ":" + port + "/" + site + "/GetStoresProduct/POST";
            var storeNo=localStorage.RCSTools_StoreNo;
            var array= {Sku:sku,StoreNo:storeNo};
            if(sku!=0){
            	$.ajax({
	                url: xurl,
	                type: 'POST',
	                data: JSON.stringify(array),
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
	                success: function (data) {
	                    if (data.quantity > 0) {
	                        $(".loadOtherStores").empty();
	                        var mostrar="";
	                        $(data.data).each(function (index, value) {
	                        	mostrar +="<div class='storeRow'><div class='col-xs-8 storeStock'>"+value.StoreName+"</div>"+
	                        	"<div class='col-xs-4 text-center storeStock '>"+value.Qty+"</div></div>";  
	                        });
	                        $('.loadOtherStores').append(mostrar);
	                    	$('#show_otherStores').modal('show');
	                    }
	                }, error: function (xhr, ajaxOptions, thrownError) {
	                    console.log(xhr.status);
	                    console.log(xhr.statusText);
	                    console.log(xhr.responseText);
	                    if (current_lang == 'es'){
	                        mostrarModalGeneral("Error de Conexión");
	                    }
	                    else{
	                        mostrarModalGeneral("No Connection");
	                    }
	                }
	            });
            }  
        });
    });
}




function deteclenguageReport1(){
	var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es') {
        changeLanguageReport1();
    }
}