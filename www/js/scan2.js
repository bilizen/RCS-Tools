$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        beforeScan();
        document.addEventListener("backbutton", onBackKeyDown, true);
    }

    function onBackKeyDown() {
        window.location.href = "module2.html";     
    }
});

$(window).load(function(){
    
});

function beforeScan(){
    cordova.plugins.barcodeScanner.scan(function(result){
        localStorage.RCSTools_modulo2CodeScan=result.text;
        window.location.href = "module2.html";
    },function(error){
        console.log(JSON.stringify(error));
        window.location.href = "module2.html";
    });
}