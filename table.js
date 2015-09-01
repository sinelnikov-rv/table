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
        newItem.selected = false;
        newItem.html = '';
        return newItem;
    });
    function createHeadTable(dataForTable) {
        $('body').append('<table id="products"><thead><tr id="title"></tr><tr id="filter"></tr></thead></table>'); //
        for (var j in dataForTable[0]) {
            $('#title').append('<th>' + j + '</th>');
        }
    }
    function createFilterTable(dataForTable) {
        for (var j in dataForTable[0]) {
            if (j != 'product' && j != 'html' && j != 'selected') {
                $('#filter').append('<td id="' + j + '"><input id="' + j + 'Min" value="' + min(dataForTable, j) + '"><input id="' + j + 'Max" value="' + max(dataForTable, j) + '"></td>')

            } else {
                    $('#filter').append('<td></td>')
                }

            }
        }
    function createBodyTable(dataForRow) {

        $('tbody').remove();
        for (var i = 0; i < dataForRow.length; i++) {
            dataForRow[i].html +='<tr>';
            for (var n in dataForRow[i]){
                if(n != 'html' && n !='selected'){
                    dataForRow[i].html += '<td>' + dataForRow[i][n] + '</td>';
                }
            }
            dataForRow[i].html += '<td><input type="checkbox"></td>';

            $('#products').append(dataForRow[i].html);
            //$('#products').append('<tr id="row' + i + '" ></tr>');
            //for (var n in dataForRow[i]) {
            //    $('#row' + i).append('<td>' + dataForRow[i][n] + '</td>');
            //}
        }
        console.log(dataForRow);
    }
        createHeadTable(data);
        //createFilterTable(newData);
        createBodyTable(newData);
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
        if(isNaN(sourceValue) || (sourceValue <= max && sourceValue >= min)) {
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
    /*$('input').keyup(function(){
        var field = $(this).parent().attr('id');
            var newMax = $('#'+field+'Max').val();
            var newMin = $('#'+field+'Min').val();
        var filtered = filterData(newData,field,newMin,newMax);
        createBodyTable(filtered);
    });*/
    $(' :checkbox').click(function(){
        console.log(this);
    })

}
