/* global angular */
/* global mineDatabaseServices */

angular.module('app').factory('ChemicalDamageFactory', function($rootScope){
    var factory = {
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        db: "CDMINE-16-11-30",
        getIds: function(db, collections) {
            var promise = factory.services.get_ids(db, collections, "");
            promise.then(function (result) {
                    factory.ids = result;
                    $rootScope.$broadcast("idsLoaded");
                },
                function (err) {console.error("get_ids fail");}
            );
        },
        getReactions: function(db, rxn_ids) {
            var promise = factory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result;
                    $rootScope.$broadcast("rxnLoaded");
                },
                function (err) {console.error(err);}
            );
        },
        //Popups with image & name
        getCompoundName: function(db){
            return function($event, id) {
                if ((!$($event.target).data('bs.popover')) && (id[0] === "C")) {
                    var Promise = factory.services.get_comps(db, [id]);
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
                                    content: '<img id="img-popover" src="' + factory.img_src + id + '.png" width="350">'
                                });
                            }
                        },
                        function (err) {console.log(err);}
                    );
                }
            }
        }
    };
    return factory;
});

angular.module('app').controller('s1Ctl', function($scope,$stateParams,$cookieStore,sharedFactory,ChemicalDamageFactory){
    $scope.currentPage = 1;
    $scope.numPerPage = 50;
    $scope.maxSize = 6;
    $scope.getImagePath = sharedFactory.getImagePath;
    var top30db = "ChemDamageLit";
    sharedFactory.setDB(ChemicalDamageFactory.db); //Set to the Chemical Damage Database
    var reactions;
    $scope.searchType = "";
    $scope.searchComp = "";
    console.log($stateParams.id);

    //if specific reactions specified, get only those
    if ($stateParams.id) {ChemicalDamageFactory.getReactions(top30db, $stateParams.id.split(','))}
    else {ChemicalDamageFactory.getIds(top30db, 'reactions')}

    $scope.$on("idsLoaded", function () {
        ChemicalDamageFactory.getReactions(top30db, ChemicalDamageFactory.ids);
    });

    $scope.$on("rxnLoaded", function () {
        reactions = sharedFactory.sortList(ChemicalDamageFactory.reactions, "Metabolite", false);
        $scope.items = reactions.length;
        //if there is a cookie for which page the user was last on, use it unless it's beyond the end of the list
        if($cookieStore.get("S1_Page")<($scope.items/$scope.numPerPage)) {$scope.currentPage = $cookieStore.get("S1_Page")}
        $scope.paginatedData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.$apply();
    });

    $scope.getCompoundName = ChemicalDamageFactory.getCompoundName(top30db);
    $scope.parseInt = parseInt;

    $scope.$watch('currentPage + searchType + searchComp', function() {
        if (reactions) {
            var filtered = sharedFactory.filterList(reactions, "Type", $scope.searchType);
            filtered = sharedFactory.filterList(filtered, "Metabolite", $scope.searchComp);
            $scope.paginatedData = sharedFactory.paginateList(filtered, $scope.currentPage, $scope.numPerPage);
            $scope.items = filtered.length;
            $cookieStore.put("S1_Page", $scope.currentPage);
        }
    });
});

angular.module('app').controller('s2Ctl', function($rootScope,$scope,$stateParams,$cookieStore,sharedFactory,ChemicalDamageFactory){

    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src+'op_images';
    sharedFactory.setDB(ChemicalDamageFactory.db); //Set to the Chemical Damage Database
    var operators;
    $scope.searchName = "";

    ChemicalDamageFactory.getIds(ChemicalDamageFactory.db, 'operators');

    $scope.$on("idsLoaded", function () {
        var promise = ChemicalDamageFactory.services.get_ops(ChemicalDamageFactory.db, ChemicalDamageFactory.ids.sort());
        promise.then(function (result) {
                operators = result;
                if ($cookieStore.get("S2_Page") < ($scope.items / $scope.numPerPage)) {
                    $scope.currentPage = $cookieStore.get("S2_Page")
                }
                $scope.paginated = sharedFactory.paginateList(operators, $scope.currentPage, $scope.numPerPage);
                $scope.items = operators.length;
                $scope.$apply();
            },
            function (err) {
                console.error("get_ops fail");
            }
        );
    });

    $scope.$watch('currentPage + searchName', function() {
        if (operators) {
            var filtered = sharedFactory.filterList(operators, "_id", $scope.searchName);
            $scope.paginated = sharedFactory.paginateList(filtered, $scope.currentPage, $scope.numPerPage);
            $scope.items = filtered.length;
            $cookieStore.put("S2_Page", $scope.currentPage);
        }
    });
});