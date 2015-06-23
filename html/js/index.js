// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("online", onOnline, false);
// Cordova is ready
//
function onDeviceReady() {
    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    db.transaction(populateDB, errorCB, successCB);
    navigator.network.isReachable("google.com", reachableCallback, {});
//    onOnline();
}

// Populate the database 
//
function populateDB(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS EMSG');
    tx.executeSql('CREATE TABLE IF NOT EXISTS EMSG (m_id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, subject TEXT, message TEXT, status TEXT)');
    //tx.executeSql('INSERT INTO EMSG (email, subject, message, status) VALUES ("test.qc@gmail.com", "request-info", "test.qc message", "no")');
}

// Transaction error callback
//
function errorCB(tx, err) {
    console.log("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    console.log("success!");
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM EMSG WHERE status="no"', [], querySuccess, errorCB);
}
function updateMSG()
{

}

function chkErr(msg)
{
    console.log(msg);
}
// Query the success callback // 
function querySuccess(tx, results) {
//    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    var lenz = results.rows.length;
    for (var i = 0; i < lenz; i++) {
        authenticateUser(results.rows.item(i).email, results.rows.item(i).subject, results.rows.item(i).message,results.rows.item(i).m_id);
//        var m_idd = results.rows.item(i).m_id;
//        db.transaction(
//                function (tx) {
//                    console.log(m_idd);
//                    tx.executeSql('UPDATE EMSG SET status="sent" WHERE m_id=' + m_idd);
//                }, errorCB, function () {
//            console.log('status updated' + m_idd)
//        });

        console.log('querySuccess ID : ' + results.rows.item(i).m_id + ' I val::' + i);
    }


}
///////////////////////////////////////////////////////////////////////////


function mockSuccess(tx, results) {
    var dtx = '';
    var len = results.rows.length;
    dtx += "EMSG table: " + len + " rows found.<hr><hr><br><br>";
    for (var i = 0; i < len; i++) {
        dtx += "#" + i + "Message : " + results.rows.item(i).message + " status : " + results.rows.item(i).status + " M_ID : " + results.rows.item(i).m_id + "<hr>";

    }
    $('.data').html(dtx);
}
function queryMock(tx) {
    tx.executeSql('SELECT * FROM EMSG', [], mockSuccess, errorCB);
}
////////////////////////////////////////////////////////////////////////////


$('#send').click(function () {
    console.log('entered to form');
    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    db.transaction(
            function (tx) {
                var s_email = $('#email').val();
                var s_message = $('#msg').val();
                var s_subject = $('#subject').val();
                var s_status = "no";
                tx.executeSql('INSERT INTO EMSG (email, subject, message, status) VALUES ("' + s_email + '","' + s_subject + '","' + s_message + '","' + s_status + '")');
            }, errorCB, formClean);

});




function formClean() {
    $('#email').val('');
    $('#msg').val('');
    $('#subject').val('');
}

$('#bake').click(function () {
    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    db.transaction(queryMock, errorCB);
});



function onOnline() {
    // Handle the online event
//    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
//    db.transaction(queryDB, errorCB);
}


function sendUpdate(m_idd)
{
    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    db.transaction(
            function (tx) {
                console.log(m_idd);
                tx.executeSql('UPDATE EMSG SET status="sent" WHERE m_id=' + m_idd);
            }, errorCB, function () {
        console.log('status updated' + m_idd)
    });
}

//CD Raju vai
function crossDomainCall(url, data, fnSuccess, fnError) {
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json",
        dataType: 'jsonp',
        crossDomain: true,
        data: data,
        success: fnSuccess,
        error: fnError
    });
}

function authenticateUser(email, subject, message, iddd) {
//    var url = 'http://dev.testversions.com/vista-dental/run.php';
    var url = 'http://dev.testversions.com/endo-ultra/run.php';

    var data = {email: email, subject: subject, message: message};
    var fnSuccess = function (dataReceived) {
    };
    var fnError = function (e) {
        if (e.statusText === "success")
        {
            sendUpdate(iddd);
        }
    };
    crossDomainCall(url, data, fnSuccess, fnError);
}



// Check network status
function reachableCallback(reachability) {
    // There is no consistency on the format of reachability
    var networkState = reachability.code || reachability;
    var states = {};
    states[NetworkStatus.NOT_REACHABLE] = 'No network connection';
    states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
    states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK] = 'WiFi connection';
    if (networkState != 0)
        online = true;
}
var online = navigator.onLine || false;

//Now if you about to make an AJAX call to load up some dynamic data, you can easily check to see if you're online
if (online) {
    var db = window.openDatabase("tatabase", "2.0", "Email Teeth", 60000);
    db.transaction(queryDB, errorCB);

} else {
    console.log('ofline');
}



