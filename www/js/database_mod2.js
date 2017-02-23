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
	deteclenguageModule2();
	onInit();
    responsive_window();
    checkValuesLocalStorage();
    showInTableItems();
    
    $('.txtArea').keyup(function (event) {/*mientras estoy escrbiendo el numero*/
       	if(event.which == 13) {
			$('.txtItem').focus();
	   	}
	});

	$('.txtItem').keyup(function (event) {/*mientras estoy escrbiendo el numero*/
       	if(event.which == 13) {
			$('.txtQty').focus();
	   	}
	});

	$('.txtQty').keyup(function (event) {/*mientras estoy escrbiendo el numero*/
       	if(event.which == 13) {
			saveProduct();
			$('.txtQty').blur();
	   	}
	});
});

$(window).resize(function() {
	responsive_window();
});

var idItemRow=0;
function checkValuesLocalStorage(){
	$('.lblTitleModule').text(localStorage.RCSTools_titleMod2);

	if(localStorage.RCSTools_modulo2data==null){
		localStorage.RCSTools_modulo2data="";
	}

	if(localStorage.RCSTools_modulo2CodeScan==null){
		localStorage.RCSTools_modulo2CodeScan="";
		$('.txtArea').focus();
	}else{
		var arr_RCSTools_modulo2data=localStorage.RCSTools_modulo2data.split(",");
	    if(arr_RCSTools_modulo2data[0]==null){
	    	$('.txtArea').val("");
	    }else{
	    	$('.txtArea').val(arr_RCSTools_modulo2data[0]);
	    }
	    if(arr_RCSTools_modulo2data[1]==null){
	    	$('.txtQty').val("");	
	    }else{
	    	$('.txtQty').val(arr_RCSTools_modulo2data[1]);	
	    }
    	$('.txtItem').val(localStorage.RCSTools_modulo2CodeScan);
		localStorage.RCSTools_modulo2data="";
    	localStorage.RCSTools_modulo2CodeScan="";
	}

}

function showInTableItems(){
	var query="SELECT * FROM "+TABLE_ITEM;
	var total=0;
	localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
			for(var i=0;i<results.rows.length;i++){
				total=total+parseInt(results.rows.item(i).Quantity);
				$('.listItems').append("<tr>"+
				"<td class='header-cell col1 lblArea'>"+results.rows.item(i).Area+"</td>"+
				"<td class='header-cell col2 lblItems'>"+results.rows.item(i).Item+"</td>"+
				"<td class='header-cell col3 lblQty'>"+results.rows.item(i).Quantity+"</td>"+
				"<td class='header-cell col4 buttonDelete'><button type='button' data-dismiss='modal' class='btn-imagen-realcs' data-target='#ModalConfirmDeleteItem' onclick='modalDeleteItem("+results.rows.item(i).Id+")'></button></td>"+
				"</tr>");
			}
			$('.txtTotal').val(total);
        });
    });
}


function responsive_window(){
	var windowHeight = $(window).height();
	var scan = $('.scan').outerHeight();
	var datainfo = $('.datainfo').height();
	// detect device
	if( /Android|webOS/i.test(navigator.userAgent) ) {
	    $('.viewTable').height(windowHeight - scan - datainfo - 47);
	    $('.items').height($('.viewTable').height()-$('.table-header').height()-$('.btnOptions').height()-50);
	}else{
		$('.viewTable').height(windowHeight - scan - datainfo - 37);
		$('.items').height($('.viewTable').height()-$('.table-header').height()-$('.btnOptions').height()-50);
	}
	$('.items').width($('.headertable').innerWidth()-30);
}

function menu(){
    window.location.href = "menu.html";
}


function goScan(){
	localStorage.RCSTools_modulo2data=$('.txtArea').val()+","+$('.txtQty').val();
	window.location.href = "scan2.html";
}

function ExportFile(){
	try{
		var query="SELECT * FROM "+TABLE_ITEM;
    	localDB.transaction(function (transaction) {
        	transaction.executeSql(query, [], function (transaction, results) {
        		var dataFile="";
        		for(var i=0;i<results.rows.length;i++){
        			dataFile=dataFile+results.rows.item(i).Area+","+results.rows.item(i).Item+","+results.rows.item(i).Quantity+"\r\n";
        		}
        		var namefile=getNameFile();

				window.resolveLocalFileSystemURL("file:///storage/emulated/0", function(dir) {
					dir.getFile("Download/"+namefile+".txt", {create:true}, function(fileEntry) {
						fileEntry.createWriter(function (fileWriter) {
				    		fileWriter.onwriteend = function (e) {
				      			console.log('write is successful');
				      		};
				      		fileWriter.onerror = function (e) {
			                    console.log('Write failed: ' + e.toString());
			                };

			             	var blob = new Blob([dataFile], { type: 'text/plain' });
			                fileWriter.write(blob);
			                $('.txtArea').val("");
							$('.txtItem').val("");
							$('.txtQty').val("");
			                $('.txtTotal').val(0);
			                $('.listItems').empty();
			                var query2="DELETE FROM "+TABLE_ITEM;
					    	localDB.transaction(function (transaction) {
					        	transaction.executeSql(query2, [], function (transaction, results) {
					        	});
					        });
			                if(current_lang == 'es'){
				                mostrarModalGeneral("Se guardo el archivo");
				            }else{
				                mostrarModalGeneral("File saved");
				            }
						});
					});
				});

        	});
    	});
	}catch (e) {
    	console.log("Error ExportFile " + e + ".");
    }		
}

function getNameFile(){
	var d1 = new Date();
    var month = d1.getMonth() + 1;
    var day = d1.getDate();
    var hours= d1.getHours();
	var minutes = d1.getMinutes();
    var namefile =d1.getFullYear()+ (('' + month).length < 2 ? '0' : '') + month +(('' + day).length < 2 ? '0' : '') + day+
    				(('' + hours).length < 2 ? '0' : '')+hours+(('' + minutes).length < 2 ? '0' : '')+minutes;
    return namefile;
}

function saveProduct(){
	var txtArea=$('.txtArea').val();
	var txtItem=$('.txtItem').val();
	var txtQty=$('.txtQty').val();
	
	if(txtArea==""){
		if (current_lang == 'es'){
       		mostrarModalGeneral("No hay área");
        }else{
            mostrarModalGeneral("No area");
        }
	}else{
		if(txtItem==""){
			if (current_lang == 'es'){
	       		mostrarModalGeneral("No hay item");
	        }else{
	            mostrarModalGeneral("No item");
	        }
		}else{
			if(txtQty==""){
				if (current_lang == 'es'){
		       		mostrarModalGeneral("No tiene cantidad");
		        }else{
		            mostrarModalGeneral("No quantity");
		        }
			}else if(parseInt(txtQty)<=0){
				if (current_lang == 'es'){
		       		mostrarModalGeneral("Cantidad positiva");
		        }else{
		            mostrarModalGeneral("Positive amount");
		        }
			}else{
				getDataCode(txtItem,txtArea,txtQty);
			}
		}
	}
}



function getDataCode(txtItem,txtArea,txtQty){
	var txtItem=txtItem;
	var txtArea=txtArea;
	var txtQty=txtQty;
	var query="SELECT * FROM "+TABLE_URL+" WHERE "+KEY_USE+"='1'";
    localDB.transaction(function (transaction) {
        transaction.executeSql(query, [], function (transaction, results) {
            var ip = results.rows.item(0).ip;
            var port = results.rows.item(0).port;
            var alias = results.rows.item(0).alias;
            var site = results.rows.item(0).site;
			var xurl = "http://" + ip + ":" + port + "/" + site + "/Mod2VerifyProduct/POST";
			var array={CodeProduct:txtItem};

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
		           		var query1="INSERT INTO "+TABLE_ITEM+" ("+KEY_AREA+","+KEY_ITEM+","+KEY_QUANTITY+") VALUES('"+txtArea.toString()+"','"+ txtItem.toString()+"','"+txtQty.toString()+"')";	
		           		localDB.transaction(function (transaction) {
        					transaction.executeSql(query1, [], function (transaction, results) {
								var query2="SELECT * FROM "+TABLE_ITEM;	
				           		localDB.transaction(function (transaction) {
		        					transaction.executeSql(query2, [], function (transaction, results) {
		        						$('.listItems').empty();
		        						$('.txtArea').val("");
										$('.txtItem').val("");
										$('.txtQty').val("");
										var total=0;
		        						for(var i=0;i<results.rows.length;i++){
		        							total=total+parseInt(results.rows.item(i).Quantity);
		        							$('.listItems').append("<tr>"+
											"<td class='header-cell col1 lblArea'>"+results.rows.item(i).Area+"</td>"+
											"<td class='header-cell col2 lblItems'>"+results.rows.item(i).Item+"</td>"+
											"<td class='header-cell col3 lblQty'>"+results.rows.item(i).Quantity+"</td>"+
											"<td class='header-cell col4 buttonDelete'><button type='button' data-dismiss='modal' class='btn-imagen-realcs' data-target='#ModalConfirmDeleteItem' onclick='modalDeleteItem("+results.rows.item(i).Id+")'></button></td>"+
											"</tr>");
										}
										$('.txtTotal').val(total);
        							});
        						});
        					});
        				});		
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

function modalDeleteItem(id){
	idItemRow=id
	$('#ModalConfirmDeleteItem').modal('show');
}

function deleteItem(){
	try{
		var query="DELETE FROM "+TABLE_ITEM+" WHERE "+KEY_IDITEM+"="+idItemRow;
    	localDB.transaction(function (transaction) {
        	transaction.executeSql(query,[], function (transaction, results) {	 
        		var query2="SELECT * FROM "+TABLE_ITEM;	
           		localDB.transaction(function (transaction) {
					transaction.executeSql(query2, [], function (transaction, results) {
						$('.listItems').empty();
						$('.txtArea').val("");
						$('.txtItem').val("");
						$('.txtQty').val("");
						var total=0;
						for(var i=0;i<results.rows.length;i++){
							total=total+parseInt(results.rows.item(i).Quantity);
							$('.listItems').append("<tr>"+
							"<td class='header-cell col1 lblArea'>"+results.rows.item(i).Area+"</td>"+
							"<td class='header-cell col2 lblItems'>"+results.rows.item(i).Item+"</td>"+
							"<td class='header-cell col3 lblQty'>"+results.rows.item(i).Quantity+"</td>"+
							"<td class='header-cell col4 buttonDelete'><button type='button' data-dismiss='modal' class='btn-imagen-realcs' data-target='#ModalConfirmDeleteItem' onclick='modalDeleteItem("+results.rows.item(i).Id+")'></button></td>"+
							"</tr>");
						}
						$('.txtTotal').val(total);
					});
				});
        	});
    	});
	}catch (e) {
    	console.log("Error deleteItem " + e + ".");
    }
}


function deteclenguageModule2(){
	var lang = navigator.language.split("-");
    current_lang = (lang[0]);
    if (current_lang == 'es'){
        changeLanguageModule2();
    }
}