window.onload = function() { init(); };

var public_spreadsheet_url = '1TIF8w8uAB-iigH9fUHhjX6Vgc_0KEDD4ZdFlSDope38';

/*var OPTIONS = {
 'Вода, г': 'voda',
 'Белки, г': 'belki',
 'Жиры, г': 'jiri',
 'Углеводы, г': 'uglevodi',
 'ккал': 'kkal',
 'Продукт': 'product'
 };*/

function init() {
    Tabletop.init( { key: public_spreadsheet_url,
        callback: showInfo,
        simpleSheet: true } );
}

function showInfo(data) {
    var newData = data.map(function (item) {
        var newItem = {};
        Object.keys(item).forEach(function (key) {
            newItem[key] = item[key].replace(',','.');
        });
        newItem.selected = false;
        newItem.html = createHtml(item);
        newItem.html.find('input').change(change.bind(newItem));
        newItem.table='products';
        return newItem;
    });
    function change (){
        if (!this.selected) {
            this.selected = true;
        } else {
            this.selected = false;
        }
        return this;
    }
    $('#clearChecked').click(clearChecked.bind(newData));

    function clearChecked() {
        newData = this.map(function (item) {
            item.selected = false;
            item.html.find('input').attr('checked',false);
            return item;
        });
    }
    var recipe = [];
    $('#addToRecipe').click(addToRecipe.bind(newData));
    function addToRecipe() {
        var elementExist = false;
        this.forEach(function (item) {
                if (recipe.length === 0) {
                    if (item.selected) {
                        recipe.push(item);
                    }
                } else {
                    recipe.some(function (recipeItem) {
                        if (recipeItem['Продукт'] === item['Продукт']) {
                            return elementExist = true;
                             //if (recipe.indexOf(item) === -1) {
                        }else {
                            if (item.selected) {
                                recipe.push(item);
                            }
                        }
                    })
                }
            }
        );
        recipe = recipe.map(function (item) {
            var newItem = {};
            Object.keys(item).forEach(function (key) {
                newItem[key] = item[key];
            });
            newItem.selected = false;
            newItem.table = 'recipe';
            return newItem;

        });
        createBodyTable(recipe);
        clearChecked.call(newData);
        console.log(recipe);
        return recipe;
    }
    $('#deleteFromRecipe').click(deleteFromRecipe.bind(recipe));
    function deleteFromRecipe(){
        console.log(this);
        var deleteItems =[];
        this.forEach(function(item){
            console.log(recipe.indexOf(item));
            if(item.selected) {
                console.log(item.selected);
                deleteItems.push(recipe.indexOf(item));
                item.selected = false;
                item.table = 'products';
            }
        });
        console.log(deleteItems);
        for(var i=deleteItems.length-1;i>=0;i--){
            recipe.splice(deleteItems[i],1);
        }
        clearChecked.call(newData);
        createBodyTable(newData);
        createBodyTable(recipe);
    }
    $('#clearRecipe').click(clearRecipe);
    function clearRecipe(){
        recipe.forEach(function(item){
            item.selected = true;
        });
        deleteFromRecipe.call(recipe);
        recipe =[];
    };
    var savedRecipe = [];
    $('#saveRecipe').click(saveRecipe);
    function saveRecipe () {
        var recipeName = $('#recipeName').val();
        if(recipe.length > 0 && recipeName !== ""){
            $('#recipeList').append("<li>" + recipeName + "</li>");
            var recipeName = recipe.map(function (item){
                    var newItem = {};
                    Object.keys(item).forEach(function (key) {
                            newItem[key] = item[key];
                        }
                    );
                    //delete newItem.selected;
                    //delete newItem.html;
                    newItem.Рецепт = recipeName;
                    return newItem;
                }
            );
            savedRecipe.push(recipeName);
        }
        $('#recipeName').val('');

        return savedRecipe;
    }
    function createHeadTable(tableID, position, dataForTable) {
        $('#' + position + '').append('<table id="' + tableID + '" class="table-bordered table-striped"><thead><tr class="fixed"></tr></thead></table>');
        for (var j in dataForTable[0]) {
            $('#' + tableID + ' > thead > tr').append('<th>' + j + '</th>');
        }
    }

    /* function createFilterTable(dataForTable) {
     for (var j in dataForTable[0]) {
     if (j !== 'product' && j !== 'html' && j !== 'selected') {
     $('#filter').append('<td id="' + j + '"><input id="' + j + 'Min" value="' + min(dataForTable, j) + '"><br><input id="' + j + 'Max" value="' + max(dataForTable, j) + '"></td>')

     } else {
     if(j === 'html' || j === 'selected'){
     $('#filter').append('');
     }
     $('#filter').append('<td></td>');
     }

     }
     }*/
    function createHtml (dataForRow){
        var row = $('<tr>');
        for (var n in dataForRow){
            row.append('<td>' + dataForRow[n].replace(',','.') + '</td>');
        }
        row.append('<td><input type="checkbox"></td>');
        return row;
    }
    function createBodyTable(dataForRow) {
        //$('#'+tableID +' > tbody').remove();
        for (var i in dataForRow) {
            var tableID = dataForRow[i].table;
            $('#'+tableID+'').append(dataForRow[i].html);
        }
    }
    createHeadTable("products", "leftside",data);
    createHeadTable("recipe", "bottom",data);
    //createFilterTable(newData);
    createBodyTable(newData);

    $('th').click(function() {
        var table = $(this).closest('table');
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
    $('#recipeList').on('click','li',function(){
        clearRecipe();
        console.log(savedRecipe[$(this).index()]);
        recipe = savedRecipe[$(this).index()];
        $('#recipeName').val($(this).text());
        createBodyTable(savedRecipe[$(this).index()]);
    });
    /*function filterData(data, field, min, max) {
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
     $('input').keyup(function(){
     var field = $(this).parent().attr('id');
     var newMax = $('#'+field+'Max').val();
     var newMin = $('#'+field+'Min').val();
     var filtered = filterData(newData,field,newMin,newMax);
     createBodyTable(filtered);
     });*/
}
