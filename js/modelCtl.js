/* global angular */

// This controls the selection of KEGG metabolic reconstructions. Currently only used for metabolomics search
angular.module('app').controller('modelsCtl', function($scope, $state, sharedFactory){
    $scope.options = [];
    $scope.model = sharedFactory.selected_model;
    $scope.searchModels = function(query){
        var promise = sharedFactory.services.model_search(query);
        return promise.then(
            function (result) {
                // select expects a list of objects not strings, for now we convert here but this should be changed on the server side
                var data = $.map(result, function (n, i) {
                    return ({name: n, id: i});
                });
                console.log(result);
                $scope.options = data;
            },
            function (err) {
                console.log("Model Search Failure");
                $scope.options = [];
            }
        );
    };
    $scope.saveModel = function(){
        sharedFactory.selected_model = $scope.model;
        if (sharedFactory.db_dependent_states.indexOf($state.current.name) > -1) {
            $state.go($state.current,{},{reload:true});
        }
    };
});