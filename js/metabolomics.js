/* global angular */

// Allows for communication between controllers note set up for test data
angular.module('app').factory('metabolomicsDataFactory', function($rootScope, sharedFactory){
    var factory = {
        trace:  "259.022442",  // default is for alpha-D-Galactose 1-phosphate with [M-H]- adduct
        msmsIons: "215.03498 32.67\n259.02481 100.0\n259.02481 100.0\n261.03448 100.0",
        traceType: 'form',
        filterKovats: false,
        kovats: [0, 20000],
        filterLogP: false,
        logP: [-35, 35],
        params: {
            tolerance: 3,
            ppm: false,
            charge: false,
            halogens: false,
            adducts: [],
            models: [],
            energy_level: "10",
            scoring_function: 'dot product'
        },
        storeFormData: function($scope, $cookieStore) { // updates factory and cookies on search
            factory.trace =$scope.trace;
            factory.params.tolerance = $scope.tolerance + + 0.000000000000001;
            factory.params.halogens = $scope.halogens;
            factory.params.ppm = $scope.ppm;
            factory.params.adducts = $scope.adducts;
            factory.filterKovats = $scope.filterKovats;
            factory.kovats = $scope.kovats;
            factory.filterLogP = $scope.filterLogP;
            factory.logP = $scope.logP;
            $cookieStore.put("charge: "+ $scope.charge, $scope.adducts);
        },
        mzSearch: function(db){
            //clone the parameters before passing them so we don't end up change in the factory object
            var params = jQuery.extend({}, factory.params);
            if (factory.filterLogP) {params.logP = factory.logP;}
            if (factory.filterKovats) {params.kovats = factory.kovats;}
            console.log(params);
            var promise;
            factory.hits = null;
            if (factory.msmsIons.length){
                promise = sharedFactory.services.ms2_search(db, factory.trace+"\n"+factory.msmsIons, factory.traceType, params);
            }
            else {
                promise = sharedFactory.services.ms_adduct_search(db, factory.trace, factory.traceType, params);
            }
            promise.then(function(result){
                    factory.hits = result;
                    $rootScope.$broadcast("metabolitesLoaded");
                },
                function(err){alert("An Error occurred!\n\n" + err.error.error);}
            );
        },
        filterHits: function(list, mz, adduct, formula, compound, mine) {
            // filtering but we have to handle names carefully (sometimes not present) and use RegEx with formula
            var filteredList = [];
            var patt = new RegExp(formula);
            for (var i = 0; i < list.length  ; i++) {
                if((list[i].peak_name.toString().indexOf(mz) > -1) &&
                    (list[i].adduct.toString().indexOf(adduct) > -1) &&
                    (patt.test(list[i].Formula.toString())) &&
                    (list[i].MINE_id.toString().indexOf(mine) > -1) &&
                    (!compound || (typeof(list[i].Names) != 'undefined') && (list[i].Names[0].indexOf(compound) > -1)))
                {filteredList.push(list[i]);}
            }
            return filteredList
        },
        uploadFile: function(ele_id){
            var selectedFile = document.getElementById(ele_id).files[0];
            if (selectedFile.name.search('.mgf')>-1){factory.traceType = "mgf";}
            else if (selectedFile.name.search('.mzxml')>-1){factory.traceType = "mzxml";}
            else if (selectedFile.name.search('.msp')>-1){factory.traceType = "msp";}
            else {
                alert('Upload only supports .mgf, .msp, and .mzXML formats');
                return;
            }
            var reader = new FileReader();
            reader.readAsText(selectedFile);
            return reader;
        }
    };
    return factory
});

angular.module('app').controller('metabolomicsCtl', function($scope,$state,$cookieStore,sharedFactory,metabolomicsDataFactory){
    $scope.trace = metabolomicsDataFactory.trace;
    $scope.tolerance = parseInt(metabolomicsDataFactory.params.tolerance);
    $scope.halogens = metabolomicsDataFactory.params.halogens;
    $scope.ppm = metabolomicsDataFactory.params.ppm;
    $scope.filterLogP = metabolomicsDataFactory.filterLogP;
    $scope.logP = metabolomicsDataFactory.logP;
    $scope.filterKovats = metabolomicsDataFactory.filterKovats;
    $scope.kovats = metabolomicsDataFactory.kovats;
    $scope.adducts = [];
    var adductList;

    sharedFactory.services.get_adducts().then(
        function(result){
            adductList = result;
            $scope.charge = metabolomicsDataFactory.params.charge; // triggers following watch statement
            $scope.$apply();
        },
        function(err) {console.log(err)}
    );

    $scope.uploadFile = function(id) {
        var reader = metabolomicsDataFactory.uploadFile(id);
        reader.onload=function(){
            $scope.trace = reader.result;
            $scope.$apply();
        }
    };

    $scope.$watch('charge', function() { // if the charge changes, update the adduct list while checking the cookies
        if (adductList) {
            metabolomicsDataFactory.params.charge = $scope.charge;
            if ($scope.charge) {$scope.adduct_list = adductList[0];}
            else {$scope.adduct_list = adductList[1]}
            var adducts = $cookieStore.get("charge: "+ $scope.charge);
            if (typeof(adducts) == 'object') $scope.adducts = adducts;
            else $scope.adducts = [];
        }
    });

    $scope.metSearch = function() {
        metabolomicsDataFactory.storeFormData($scope, $cookieStore);
        metabolomicsDataFactory.msmsIons = "";
        $state.go("metabolomicsCompounds");
    };
});

angular.module('app').controller('ms2searchCtl', function($scope,$state,$cookieStore,sharedFactory,metabolomicsDataFactory){
    $scope.trace = metabolomicsDataFactory.trace;
    $scope.msmsIons = metabolomicsDataFactory.msmsIons;
    $scope.tolerance = parseInt(metabolomicsDataFactory.params.tolerance);
    $scope.halogens = metabolomicsDataFactory.params.halogens;
    $scope.ppm = metabolomicsDataFactory.params.ppm;
    $scope.filterLogP = metabolomicsDataFactory.filterLogP;
    $scope.logP = metabolomicsDataFactory.logP;
    $scope.filterKovats = metabolomicsDataFactory.filterKovats;
    $scope.kovats = metabolomicsDataFactory.kovats;
    $scope.energy = metabolomicsDataFactory.params.energy_level;
    $scope.metric = metabolomicsDataFactory.params.scoring_function;
    $scope.adducts = [];
    var adductList;

    sharedFactory.services.get_adducts().then(
        function(result){
            adductList = result;
            $scope.charge = metabolomicsDataFactory.params.charge; // triggers following watch statement
            $scope.$apply();
        },
        function(err) {console.log(err);}
    );

    $scope.uploadFile = function(id) {
        var reader = metabolomicsDataFactory.uploadFile(id);
        reader.onload=function(){
            $scope.trace = "";
            $scope.msmsIons = reader.result;
            $("#parent_ion").attr('disabled','disabled');
            $("#msmsIons").attr('disabled','disabled');
            $scope.$apply();
        }
    };

    $scope.$watch('charge', function() { // if the charge changes, update the adduct list while checking the cookies
        if (adductList) {
            metabolomicsDataFactory.params.charge = $scope.charge;
            if ($scope.charge) {$scope.adduct_list = adductList[0];}
            else {$scope.adduct_list = adductList[1];}
            var adducts = $cookieStore.get("charge: "+ $scope.charge);
            if (typeof(adducts) == 'object') $scope.adducts = adducts;
            else $scope.adducts = [];
        }
    });

    $scope.metSearch = function() {
        metabolomicsDataFactory.storeFormData($scope, $cookieStore);
        metabolomicsDataFactory.params.energy_level = $scope.energy;
        metabolomicsDataFactory.params.scoring_function = $scope.metric;
        metabolomicsDataFactory.msmsIons = $scope.msmsIons;
        $state.go("metabolomicsCompounds");
    };
});

angular.module('app').controller('metabolomicsCompoundsCtl', function($scope,$state,$stateParams,metabolomicsDataFactory,sharedFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.items = -1;
    $scope.totalItems = -1;
    $scope.searchMZ = "";
    $scope.searchAdduct = "";
    $scope.searchFormula = "";
    $scope.searchCompound = "";
    $scope.searchMINE = "";
    $scope.sortColumn = 'Generation';
    $scope.sortInvert = true;
    $scope.generateCompoundImages = sharedFactory.generateCompoundImages;
    $scope.selectedModels = metabolomicsDataFactory.metaModels;
    $scope.factory = metabolomicsDataFactory;
    $scope.db = $stateParams.db;
    var filteredData = [];

    // if we get here w/o parameters (ie direct link), return to the search screen
    if (!metabolomicsDataFactory.params.adducts.length) $state.go('msAdductSearch');
    else {
        if (sharedFactory.selected_model) metabolomicsDataFactory.params.models = [sharedFactory.selected_model.name];
        metabolomicsDataFactory.mzSearch(sharedFactory.dbId);
    }

    $scope.$on("metabolitesLoaded", function () {
        filteredData = metabolomicsDataFactory.filterHits(metabolomicsDataFactory.hits, $scope.searchMZ,
            $scope.searchAdduct, $scope.searchFormula, $scope.searchCompound, $scope.searchMINE);
        if (!metabolomicsDataFactory.msmsIons){
            filteredData = sharedFactory.sortList(filteredData,$scope.sortColumn,$scope.sortInvert);
        }
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
        $scope.roundLogP()
        $scope.items = filteredData.length;
        $scope.totalItems = metabolomicsDataFactory.hits.length;
        $scope.$apply();
        $scope.generateCompoundImages();
    });

    $scope.roundLogP = function() {
        for (var f of $scope.displayData) {
            f.logP = Math.round(f.logP * 100) / 100
        }
    }

    $scope.color = function(native,score){
        // If native_hit is true, make it green
        if(native === true){return "success";}
        if (score >= 0.75) {return "warning";}
        return "";
    };

    $scope.downloadResults = function(){
        var jsonObject = JSON.stringify(filteredData);
        //var exclude = {"$$hashKey":"", 'id':"", 'Likelihood_score':"",
        // 'Pos_CFM_spectra':"", 'Neg_CFM_spectra':""};
        var header = ["Spectral_score", "peak_name", "adduct", "MINE_id",
            "Inchikey", "SMILES", "Formula", "logP"];
        var csv = sharedFactory.convertToCSV(jsonObject, header);
        var d = new Date();
        sharedFactory.downloadFile(csv, d.toISOString()+'.csv');
    };

    $scope.$watch('searchMINE + searchMZ + searchAdduct + searchFormula + searchCompound', function() {
        if (metabolomicsDataFactory.hits) {
            filteredData = metabolomicsDataFactory.filterHits(metabolomicsDataFactory.hits, $scope.searchMZ,
                $scope.searchAdduct, $scope.searchFormula, $scope.searchCompound, $scope.searchMINE);
            filteredData = sharedFactory.sortList(filteredData, $scope.sortColumn, $scope.sortInvert);
            $scope.items = filteredData.length;
            $scope.roundLogP();
            $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
            setTimeout(() => $scope.generateCompoundImages(), 10);  // timeout so smilesdrawer can do its thing after page loads
        }
    });

    $scope.$watch('sortColumn + sortInvert', function(){
        filteredData = sharedFactory.sortList(filteredData,$scope.sortColumn,$scope.sortInvert);
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
        setTimeout(() => $scope.generateCompoundImages(), 10);  // timeout so smilesdrawer can do its thing after page loads
    });

    $scope.$watch('currentPage', function(){
        $scope.displayData = sharedFactory.paginateList(filteredData, $scope.currentPage, $scope.numPerPage);
        $scope.roundLogP();
        setTimeout(() => $scope.generateCompoundImages(), 10);  // timeout so smilesdrawer can do its thing after page loads
    });

});