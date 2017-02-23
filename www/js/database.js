
//DATABASE NAME
//**************************//

var localDB = 'RCS';

//TABLE URL//
var TABLE_URL = "URLSTORE";
var KEY_ID = "id";
var KEY_IP = "ip";
var KEY_PORT = "port";
var KEY_URLBASE = "urlBase";
var KEY_ALIAS = "alias";
var KEY_USE = "use";
var KEY_SITE = "site";
var KEY_PIN = "pin";
//Table Store//
var TABLE_STORE = "STORE";
var KEY_IDSTORE = "ID";
var KEY_STORENO = "StoreNo";
var KEY_STORENAME = "StoreName";
var KEY_USEDSTORE = "UsedStore";
//Table Items
var TABLE_ITEM="ITEM";
var KEY_IDITEM="Id"
var KEY_AREA= "Area";
var KEY_ITEM = "Item";
var KEY_QUANTITY="Quantity";


function initDB() {
	var shortName = 'RCSOnline';
	var version = '2.0';
	var displayName = 'RCS Online';
	var maxSize = 10240; // Em bytes
	localDB = openDatabase(shortName, version, displayName, maxSize);
}


function createTables() {

	var tableURL = "CREATE TABLE " + TABLE_URL + " ( "
			+ KEY_ID + " INTEGER PRIMARY KEY, " + KEY_IP + " TEXT, " + KEY_PORT + " TEXT, " + KEY_URLBASE + " TEXT, "
			+ KEY_ALIAS + " TEXT, " + KEY_USE + " TEXT, " + KEY_SITE + " TEXT, "+KEY_PIN+" TEXT) ";

	var tableStore = "CREATE TABLE " + TABLE_STORE + "(" + KEY_IDSTORE + " INTEGER PRIMARY KEY, " + KEY_STORENO + " TEXT, " + KEY_STORENAME + " TEXT, "
			+ KEY_USEDSTORE + " TEXT)";

	var tableItem="CREATE TABLE "+TABLE_ITEM+"("+ KEY_IDITEM+" INTEGER PRIMARY KEY, " +KEY_AREA+" TEXT ,"+KEY_ITEM+" TEXT ,"+KEY_QUANTITY+" TEXT)";

	try {
		localDB.transaction(function (transaction) {
			transaction.executeSql(tableURL, [], nullDataHandler, errorHandler);
			console.log("Tabla URL status: OK.");

			transaction.executeSql(tableStore, [], nullDataHandler, errorHandler);
			console.log("Tabla Store status: OK.");

			transaction.executeSql(tableItem, [], nullDataHandler, errorHandler);
			console.log("Tabla Item status: OK.");
		});
	} catch (e) {
		console.log("Error creando Tabla URL " + e + ".");
		return;
	}
}

function dropTableExists(){
	var tableURL = "DROP TABLE IF EXISTS " + TABLE_URL;
	var tableStore = "DROP TABLE IF EXISTS " + TABLE_STORE;
	var tableItem = "DROP TABLE IF EXISTS " + TABLE_ITEM;
}



function onInit() {
	try {
		if (!window.openDatabase) {
			console.log("No soporta BD");
		} else { 
			initDB();
			createTables();
		}
	} catch (e) {
		if (e == 2) {
			console.log("Versión de base de datos invalida");
		} else {
			console.log("Error de desconexión: " + e + ".");
		}
		return;
	}
}


errorHandler = function (transaction, error) {//THIS VARIABLE IS FOR OUR TRANSACTION.EXECUTESQL IN OUR METHOD CREATETABLE
	console.log("Error: " + error.message);
	return true;
}

nullDataHandler = function (transaction, results) {//THIS VARIABLE IS FOR OUR TRANSACTION.EXECUTESQL IN OUR METHOD CREATETABLE
}




//verificar si hay conexion
function checkNetConnection() {
	var status = window.navigator.onLine;
	if (status) {
		return true;
	} else {
		return false;
	}
}

