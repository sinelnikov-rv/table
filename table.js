window.onload = function() { init(); };

var public_spreadsheet_url = '1TIF8w8uAB-iigH9fUHhjX6Vgc_0KEDD4ZdFlSDope38';

var OPTIONS = {
    'Вода, г': 'voda',
    'Белки, г': 'belki',
    'Жиры, г': 'jiri',
    'Углеводы, г': 'uglevodi',
    'ккал': 'kkal',
    'Продукт': 'product'
};

function init() {
    Tabletop.init( { key: public_spreadsheet_url,
        callback: showInfo,
        simpleSheet: true } );
}

function showInfo(data) {
    var newData = data.map(function (item) {
        var newItem = {};
        Object.keys(item).forEach(function (key) {
            newItem[OPTIONS[key]] = item[key].replace(',','.');
        });
        return newItem;
    });
    for (var j in newData[0]) {
        $('#title').append('<th>' + j + '</th>');
        if(j != 'product') {
            $('#filter').append('<td id="' + j + '"><input id="'+j+'Min" value="' + min(newData,j) + '"><input id="'+ j + 'Max" value="' + max(newData,j) + '"></td>')
        }
        else {
            $('#filter').append('<td></td>')
        }
    }
    for (var i = 0; i < newData.length; i++) {
        $('#products').append('<tr id="row' + i + '" ></tr>');
        for (var n in newData[i]) {
            $('#row' + i).append('<td>' + newData[i][n] + '</td>');
        }
    }
    $('th').click(function() {
        console.log(this);
        var table = $('table');
        var rows = table.find("tbody > tr").toArray().sort(comparer($(this).index()));

        this.asc = !this.asc;
        if (!this.asc){
            rows = rows.reverse();
        }
        for (var i = 0; i < rows.length; i++){
            table.append(rows[i]);
        }
    });
    function comparer(index) {
        return function(a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index);
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
        }
    }
    function getCellValue(row, index){
        return $(row).children('td').eq(index).html();
    }

    function filterData(data, field, min, max) {
    return data.filter(function (item) {
        var sourceValue = +item[field].replace('-','0');
        if (isNaN(sourceValue) || (sourceValue < max && sourceValue > min)) {
            return true;
        } else {
            return false;
        }
    });

    }
    function min(data,field){
        var array = [];
        for (var i in data){
            array.push((data[i][field]).replace('-','0'));
        }
        return Math.min.apply(null,array);
    }
    function max(data,field){
        var array = [];
        for (var i in data){
            array.push((data[i][field]).replace('-','0'));
        }
        return Math.max.apply(null,array);
    }
    $('input').keyup(function(){
        var field = $(this).parent().attr('id');
            newMax = $('#'+field+'Max').val();
            newMin = $('#'+field+'Min').val();
        var filtered = filterData(newData,field,newMin,newMax);
        console.log(filtered);
    });

        /*var table = $('table')
        var headers = table.find('th').length;
        var filterrow = table.append('<tr>');
        for (var i = 0; i < headers; i++){
            filterrow.append($('<th>').append($('<input>').attr('type','text').keyup(function(){
                table.find('tr').show()
                var self = $(this)
                filterrow.find('input[type=text]').each(function(){
                    var index = $(this).parent().index() + 1;
                    var filter = $(this).val() != ''
                    $(this).toggleClass('filtered', filter)
                    if (filter){
                        var el = 'td:nth-child('+index+')'
                        var criteria = ":contains('"+$(this).val()+"')"
                        table.find(el+':not('+criteria+')').parent().hide()
                    }
                });
            })))
        }
        filterrow.append($('<th>').append($('<input>').attr('type','button').val('Clear Filter').click(function(){
            $(this).parent().parent().find('input[type=text]').val('').toggleClass('filtered', false)
            table.find('tr').show()
        })))*/
}
