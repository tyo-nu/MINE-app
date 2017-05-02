/* global angular */

angular.module('app').factory('CompoundDataFactory', function($rootScope, sharedFactory){
    var factory = {
        getCompound: function (db, id){
            var promise;
            //Controls for _id and MINE ids
            if (parseInt(id)) {promise = sharedFactory.services.get_comps(db, [parseInt(id)]);}
            else {promise = sharedFactory.services.get_comps(db, [id]);}
            promise.then(
                function(result){
                    factory.compound = result[0];
                    $rootScope.$broadcast("compoundLoaded");
                },
                function(err){
                    console.error("get_comps fail");
                    console.log(err);
                }
            )
        },
        getReactions: function(db, rxn_ids) {
            var promise = sharedFactory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result;
                    $rootScope.$broadcast("rxnLoaded")
                },
                function (err) {console.error("get_rxns fail");}
            );
        },
        //EC filtering
        filterList: function(reactions, searchOn) {
            if (searchOn && (typeof(reactions) != 'undefined') && (reactions.length > 0)) {
                return reactions.filter(function(rxn){
                    return rxn.Operators.some(function (op) {
                        return op.indexOf(searchOn) > -1;
                    });
                });
            }
            else{return reactions;}
        },
        //Popups with image & name
        getCompoundName: function(db){
            return function($event, id) {
                //only trigger for elements which don't already have popovers and are not coreactants
                if ((!$($event.target).data('bs.popover')) && (id[0] === "C")) {
                    var Promise = sharedFactory.services.get_comps(db, [id]);
                    Promise.then(
                        function (result) {
                            var cTitle;
                            if (result[0].Names) {cTitle = result[0].Names[0];}
                            else if (result[0].MINE_id) {cTitle = result[0].MINE_id;}
                            if (cTitle) {
                                $($event.target).popover({
                                    title: cTitle,
                                    trigger: 'hover',
                                    html: true,
                                    content: '<img id="img-popover" src="' + sharedFactory.getImagePath(id) +'" width="250">' +
                                    '<p style="text-align: center">Click for more detail</p>'
                                });
                                $('.popover').not(this).hide();
                                $($event.target).popover('show')
                            }
                        },
                        function (err) {console.log(err);}
                    );
                }
            };
        }
    };
    return factory
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    $scope.getImagePath = sharedFactory.getImagePath;
    if (typeof($stateParams.db) != 'undefined') {
        sharedFactory.setDB($stateParams.db);
    }

    $scope.$on("compoundLoaded", function () {
        $scope.data = CompoundDataFactory.compound;
        $scope.$apply();
    });

    $scope.mapLink = function(keggMap){
        return('http://www.genome.jp/kegg-bin/show_pathway?map' + keggMap.slice(0,5) + '+' +
            $scope.data.DB_links.KEGG.join('+'));
    };

    $scope.dbLink = function(db, id) {
        var linkTable = {
            "KEGG": 'http://www.genome.jp/dbget-bin/www_bget?cpd:',
            "CAS": 'http://www.sigmaaldrich.com/catalog/search?interface=CAS%20No.&term=',
            "ChEBI": 'http://www.ebi.ac.uk/chebi/searchId.do;92DBE16B798171059DA73B3E187F622F?chebiId=',
            "KNApSAcK": 'http://kanaya.naist.jp/knapsack_jsp/information.jsp?word=',
            "Model_SEED": 'http://modelseed.org/biochem/compounds/',
            "NIKKAJI": 'http://nikkajiweb.jst.go.jp/nikkaji_web/pages/top_e.jsp?CONTENT=syosai&SN=',
            "PDB-CCD": 'http://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/',
            "PubChem": 'http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=',
            "LIPIDMAPS": "http://www.lipidmaps.org/data/LMSDRecord.php?LMID=",
            "HMDB": "http://www.hmdb.ca/metabolites/",
            "LipidBank": "http://lipidbank.jp/cgi-bin/detail.cgi?id="
        };
        if (db in linkTable) {return linkTable[db]+id;}
        return '';
    };
});

angular.module('app').controller('productOfCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    if (typeof($stateParams.db) != 'undefined') sharedFactory.setDB($stateParams.db);
    if (!CompoundDataFactory.compound) { // if we hit this page directly we need to get the compound data first
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Product_of);
    }

    $scope.$on("compoundLoaded", function () {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Product_of);
    });
});


angular.module('app').controller('reactantInCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    if (typeof($stateParams.db) != 'undefined') sharedFactory.setDB($stateParams.db);
    if (!CompoundDataFactory.compound){ // if we hit this page directly we need to get the compound data first
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Reactant_in);
    }

    $scope.$on("compoundLoaded", function () {
        CompoundDataFactory.getReactions(sharedFactory.dbId, CompoundDataFactory.compound.Reactant_in);
    });
});

angular.module('app').controller('rxnListCtl',  function($scope,$stateParams,CompoundDataFactory, sharedFactory) {
    $scope.getImagePath = sharedFactory.getImagePath;
    $scope.currentPage = 1;
    $scope.numPerPage = sharedFactory.numPerPage;
    $scope.maxSize = 5;
    $scope.searchOn = '';
    $scope.db = $stateParams.db;
    var reactions;

    $scope.getCompoundName = CompoundDataFactory.getCompoundName(sharedFactory.dbId);

    $scope.$on("rxnLoaded", function () {
        reactions = CompoundDataFactory.reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
    });

    $scope.$watch('currentPage + searchOn', function() {
        if (reactions) {
            var filteredRxns = CompoundDataFactory.filterList(reactions, $scope.searchOn);
            $scope.filteredData = sharedFactory.paginateList(filteredRxns, $scope.currentPage, $scope.numPerPage);
            $scope.items = filteredRxns.length;
        }
    });
});