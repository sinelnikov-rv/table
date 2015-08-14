window.onload = function() { init() };

var public_spreadsheet_url = '1TIF8w8uAB-iigH9fUHhjX6Vgc_0KEDD4ZdFlSDope38';

function init() {
    Tabletop.init( { key: public_spreadsheet_url,
        callback: showInfo,
        simpleSheet: true } )
}
function showInfo(data, tabletop) {
    //alert("Successfully processed!")
    for (j in data[0]) {
        $('#title').append('<th>' + j + '</th>');
    }
    $('th:first').addClass("active-up");
    for (var i = 0; i < data.length; i++) {
        $('#products').append('<tr id="row' + i + '" ></tr>');
        for (var n in data[i]) {
            $('#row' + i).append('<td>' + data[i][n] + '</td>');
        }
    }
}