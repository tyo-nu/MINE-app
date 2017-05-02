/* global angular */

angular.module('app').controller('operatorCtl',  function($scope,$stateParams,CompoundDataFactory, sharedFactory) {
    $scope.operatorName = $stateParams.id;
    $scope.img_src = sharedFactory.img_src;
    var promise = sharedFactory.services.get_operator(sharedFactory.dbId, $stateParams.id);
    promise.then(
        function (result) {
            $scope.data = result;
            CompoundDataFactory.getReactions(sharedFactory.dbId, $scope.data.Reaction_ids);
            $scope.$apply()
        },
        function (err) {
            console.log("get_ops fail")
        }
    );
});
