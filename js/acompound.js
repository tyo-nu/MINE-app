/* global angular */

angular.module('app').factory('CompoundDataFactory', function($rootScope, sharedFactory){
    var factory = {
        getCompound: function (db, id){
            var promise;
            //Controls for _id and MINE ids
            if (parseInt(id)) {promise = sharedFactory.services.get_comps_all_info(db, [parseInt(id)]);}
            else {promise = sharedFactory.services.get_comps_all_info(db, [id]);}
            promise.then(
                function(result){
                    factory.compound = result[0];
                    if (result[0] !== null) {
                        $rootScope.$broadcast("compoundLoaded");
                    } else {
                        $rootScope.$broadcast("compoundError");
                        console.log('Invalid compound ID for selected database')
                    }
                    
                },
                function(err){
                    console.error("get_comps fail");
                    console.log(err);
                }
            )
        },
        getReactionsProductOf: function(db, cpd_id) {
            var promise = sharedFactory.services.get_rxns_product_of(db, cpd_id);
            promise.then(function (result) {
                    factory.producing_reactions = result;
                    $rootScope.$broadcast("rxnProductOfLoaded")
                },
                function (err) {console.error("get_rxns_product_of fail");}
            );
        },
        getReactionsReactantIn: function(db, cpd_id) {
            var promise = sharedFactory.services.get_rxns_reactant_in(db, cpd_id);
            promise.then(function (result) {
                    factory.consuming_reactions = result;
                    $rootScope.$broadcast("rxnReactantInLoaded")
                },
                function (err) {console.error("get_rxns_reactant_in fail");}
            );
        },
        getReactions: function(db, rxn_ids) {
            var promise = sharedFactory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result
                    $rootScope.$broadcast("rxnLoaded")
                },
                function (err) {console.error("get_rxns fail")}
            )
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
        },
        getKEGGInfo: function(kegg_id) {
            var promise = sharedFactory.services.get_kegg_info(kegg_id);
            promise.then(
                function(result){
                    factory.compound.KEGG = kegg_id;
                    factory.compound.Enzymes = result['Enzymes']
                    factory.compound.Pathways = result['Pathways']
                    $rootScope.$broadcast("keggLoaded");
                },
                function(err){
                    console.error("get_kegg_info fail");
                    console.log(err);
                })
        },
        getThermoInfo: function(c_id) {
            var promise = sharedFactory.services.get_thermo_info(c_id);
            promise.then(function (result) {
                    factory.compound.dG = Number(result['dG'].toFixed(2));
                    $rootScope.$broadcast("thermoLoaded");
                },
                function(err){
                    console.error("get_thermo_info fail");
                    console.log(err);
                })
        }
    };
    return factory
});

angular.module('app').controller('acompoundCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    $scope.generateCompoundImages = sharedFactory.generateCompoundImages;
    if (typeof($stateParams.db) != 'undefined') {
        sharedFactory.setDB($stateParams.db);
    }

    $scope.$on("compoundLoaded", function () {
        const kegg_id = CompoundDataFactory.compound.KEGG_id
        if (kegg_id != undefined) {
            CompoundDataFactory.getKEGGInfo(kegg_id)
        } else {
            $scope.data = CompoundDataFactory.compound;
            $scope.$apply();
            CompoundDataFactory.getThermoInfo(CompoundDataFactory.compound._id)
            setTimeout(() => $scope.generateCompoundImages(), 10);
        };
    });

    $scope.$on("compoundError", function () {
        $scope.data = {"MINE_id": "(Error: Invalid MINE ID for selected database)"};
        $scope.$apply();
    });

    $scope.$on("keggLoaded", function () {
        setTimeout(() => $scope.generateCompoundImages(), 10);
        $scope.data = CompoundDataFactory.compound;
        $scope.$apply();
        
        CompoundDataFactory.getThermoInfo($scope.data._id)
    });

    $scope.$on("thermoLoaded", function () {
        $scope.data = CompoundDataFactory.compound;
        $scope.$apply();
    });

    $scope.mapLink = function(keggMap){
        return('http://www.genome.jp/kegg-bin/show_pathway?map' + keggMap.slice(0,5) + '+' + $scope.data.KEGG);
    };

    $scope.dbLinkName = function(db) {
        var linkNameTable = {
            "biggM": "BiGG",
            "chebi": "ChEBI",
            "envipath": "enviPath",
            "hmdb": "HMDB",
            "keggC": "KEGG",
            "keggD": "KEGG Drug",
            "keggE": "KEGG",
            "keggG": "KEGG",
            "metacycM": "MetaCyc",
            "reactome": "reactome",
            "rheaG": "Rhea",
            "rheaP": "Rhea",
            "sabiorkM": "SABIO-RK",
            "seedM": "ModelSEED",
            "slm": "Swiss Lipids",
            "pubchem_id": "PubChem",
        };
        if (db in linkNameTable) {
            dbName = linkNameTable[db];
        } else {
            dbName = db;
        }
        return dbName;
    }

    $scope.dbLink = function(db, id) {
        linkName = $scope.dbLinkName(db)
        var linkTable = {
            "BiGG": 'http://bigg.ucsd.edu/universal/metabolites/',
            "CAS": 'http://www.sigmaaldrich.com/catalog/search?interface=CAS%20No.&term=',
            "ChEBI": 'http://www.ebi.ac.uk/chebi/searchId.do;92DBE16B798171059DA73B3E187F622F?chebiId=',
            "enviPath": 'http://envipath.org/package/',
            "HMDB": "http://www.hmdb.ca/metabolites/",
            "KEGG": 'http://www.genome.jp/dbget-bin/www_bget?cpd:',
            "KEGG Drug": 'http://www.genome.jp/dbget-bin/www_bget?drug:',
            "MetaCyc": 'https://metacyc.org/compound?orgid=META&id=',
            "ModelSEED": 'http://modelseed.org/biochem/compounds/',
            "reactome": 'https://reactome.org/content/detail/',
            "Rhea": 'https://www.rhea-db.org/rhea/',
            "SABIO-RK": 'http://sabio.h-its.org/compdetails.jsp?cid=',
            "PubChem": 'http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=',
            "Swiss Lipids": 'https://www.swisslipids.org/#/entity/slm:'
        };
        if (linkName in linkTable) {return linkTable[linkName] + id;}
        return '';
    };

    $scope.getKEGGID = function(xrefs) {
        if (xrefs) {
            for (const [key, id] of Object.entries(xrefs)) {
                if ($scope.dbLinkName(key) === 'KEGG' && id[0] === 'C') {
                    return id;
                }
            }
        } else {
            return null;
        }
    };

});

angular.module('app').controller('productOfCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    if (typeof($stateParams.db) != 'undefined') sharedFactory.setDB($stateParams.db);
    if (!CompoundDataFactory.compound) { // if we hit this page directly we need to get the compound data first
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactionsProductOf(sharedFactory.dbId, CompoundDataFactory.compound._id);
    }

    $scope.$on("compoundLoaded", function () {
        CompoundDataFactory.getReactionsProductOf(sharedFactory.dbId, CompoundDataFactory.compound._id);
    });
});


angular.module('app').controller('reactantInCtl', function($scope,$stateParams,sharedFactory,CompoundDataFactory){
    if (typeof($stateParams.db) != 'undefined') sharedFactory.setDB($stateParams.db);
    if (!CompoundDataFactory.compound){ // if we hit this page directly we need to get the compound data first
        CompoundDataFactory.getCompound(sharedFactory.dbId, $stateParams.id);
    }
    else {
        CompoundDataFactory.getReactionsReactantIn(sharedFactory.dbId, CompoundDataFactory.compound._id);
    }

    $scope.$on("thermoLoaded", function () {
        CompoundDataFactory.getReactionsReactantIn(sharedFactory.dbId, CompoundDataFactory.compound._id);
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

    $scope.$on("rxnProductOfLoaded", function () {
        reactions = CompoundDataFactory.producing_reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
        setTimeout(() => $scope.generateCompoundImages(), 10);
        $scope.$apply();
    });

    $scope.$on("rxnReactantInLoaded", function () {
        reactions = CompoundDataFactory.consuming_reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
        setTimeout(() => $scope.generateCompoundImages(), 10);
        $scope.$apply();
    });

    $scope.$on("rxnLoaded", function () {
        reactions = CompoundDataFactory.reactions;
        $scope.filteredData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.items = reactions.length;
        $scope.$apply();
        setTimeout(() => $scope.generateCompoundImages(), 10);
        $scope.$apply();
    })

    $scope.$watch('currentPage + searchOn', function() {
        if (reactions) {
            var filteredRxns = CompoundDataFactory.filterList(reactions, $scope.searchOn);
            $scope.filteredData = sharedFactory.paginateList(filteredRxns, $scope.currentPage, $scope.numPerPage);
            $scope.items = filteredRxns.length;
            setTimeout(() => $scope.generateCompoundImages(), 10);
        }
    });
});