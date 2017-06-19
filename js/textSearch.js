/* global angular */

angular.module('app').controller('quickSearchCtl',  function ($scope,$state,sharedFactory) {
    $scope.doQuickSearch = function(ev) {
         // looks for enter key if triggered by keypress
        if (!ev || ev.which===13) {
            $state.go("compounds",{search:$scope.name, db:sharedFactory.dbId});
        }
    }
});

angular.module('app').controller('advancedSearchCtl', function($scope,$state, sharedFactory){
    $scope.and = [];
    $scope.or = [];
    $scope.value = "";
    $scope.RegEx = false;
    $scope.not = false;
    $scope.fields = [
        {'id': 0, 'name': '_id'}, {'id': 1, 'name': 'SMILES'}, {'id': 2, 'name': 'NP_likeness'},
        {'id': 3, 'name': 'MINE_id'}, {'id': 4, 'name': 'Inchikey'}, {'id': 5, 'name': 'Charge'},
        {'id': 6, 'name': 'Mass'}, {'id': 7, 'name': 'Formula'}, {'id': 8, 'name': 'Names'},
        {'id': 9, 'name': 'Pathways'}, {'id': 10, 'name': 'Enzymes'}, {'id': 11, 'name': 'Product_of'},
        {'id': 12, 'name': 'Reactant_in'}, {'id': 13, 'name': 'FP2'}, {'id': 14, 'name': 'FP4'},
        {'id': 15, 'name': 'Generation'}, {'id': 16, 'name': 'DB_links.KEGG'},
        {'id': 17, 'name': 'DB_links.PubChem'}, {'id': 18, 'name': 'DB_links.CAS'},
        {'id': 19, 'name': 'DB_links.ChEBI'}, {'id': 20, 'name': 'DB_links.KNApSAcK'},
        {'id': 21, 'name': 'DB_links.Model_SEED'}, {'id': 22, 'name': 'DB_links.NIKKAJI'},
        {'id': 23, 'name': 'DB_links.PDB-CCD'}, {'id': 24, 'name': 'logP'}];
    $scope.selected = $scope.fields[0];

    $scope.addItem = function(array, field, value){
        if (value) array.push([field, value, $scope.RegEx, $scope.not]);
    };

    $scope.removeRow = function(array, index){
        array.splice(index, 1);
    };

    var mongoizeArray = function(query, operator, array){
        if (query) {query += ", ";}
        else {query += "{";}
        query += operator+":[";
        for (var i = 0; i < array.length; i++) {
            query += '{"' + array[i][0] + '":';
            if (array[i][2]) {query += '{"$regex":"' + array[i][1] + '"}}, ';} // regex always has quotes
            else {
                if (!parseFloat(array[i][1]+1)) {array[i][1] = '"'+array[i][1]+'"';} // if it isn't a number we have to add quotes
                if (array[i][3]) {query += '{"$ne":' + array[i][1] + "}}, ";}
                else {query += array[i][1] + "}, ";}
            }
        }
        query = query.substring(0,query.length-2) + "]";
        return query;

    };

    $scope.search = function(and,or){
        var query = "";
        if (and.length) {query = mongoizeArray(query, '"$and"', and);}
        if (or.length) {query = mongoizeArray(query, '"$or"', or);}
        query += "}";
        $state.go('compounds', {'search':query, db:sharedFactory.dbId});
    };

     // enforce not and regex cant both be true
    $scope.$watch('not', function (){
        if ($scope.not) {$scope.RegEx = false;}
    });
});

angular.module('app').controller('compoundsCtl', function($scope,$stateParams,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.items=0;
    $scope.totalItems=-1;
    $scope.selected_model = sharedFactory.selected_model;
    $scope.getImagePath = sharedFactory.getImagePath;
    $scope.searchFormula = "";
    $scope.searchCompound = "";
    $scope.searchMINE = "";
    $scope.db = $stateParams.db;
    var data=[];
    var filteredData=[];
    var promise;
    var services = sharedFactory.services;
    if (typeof($stateParams.db) != 'undefined') {
        sharedFactory.setDB($stateParams.db);
    }
    if ($stateParams.search[0] === '{') {
        promise = services.database_query(sharedFactory.dbId, $stateParams.search, sharedFactory.selected_model.name, "");
    }
    else {promise = services.quick_search(sharedFactory.dbId, $stateParams.search);}
    promise.then(
            function(result){
                data = result;
                filteredData = sharedFactory.filterList(data, $scope.searchMINE, $scope.searchCompound, $scope.searchFormula);
                $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
                $scope.items = filteredData.length;
                $scope.totalItems = result.length;
                $scope.$apply();
            },
            function(err){
                $scope.totalItems=0;
                $scope.$apply();
                console.log("quick_search or database_query Failure");
                console.log(err);
            }
    );

    $scope.color = function(native,score){
        if(score === 1) {return "success";}
        if (score >= 0.75) {return "warning";}
        return "";
    };

    $scope.downloadResults = function(){
        var jsonObject = JSON.stringify(filteredData);
        var header = ["MINE_id", "Inchikey", "SMILES", "Formula", "Mass", "Names"];
        var csv = sharedFactory.convertToCSV(jsonObject, header);
        var d = new Date();
        sharedFactory.downloadFile(csv, d.toISOString()+'.csv');
    };

    $scope.$watch('searchMINE + searchFormula + searchCompound', function() {
        if (data) {
            filteredData = sharedFactory.filterList(data, $scope.searchMINE, $scope.searchCompound, $scope.searchFormula);
            $scope.items = filteredData.length;
            $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage)
        }
    });

    $scope.$watch('currentPage', function() {
        if (filteredData) {
            $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage)
        }
    });
});
