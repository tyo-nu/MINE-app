angular.module('app').controller('operatorCtl',  function($scope,$stateParams,sharedFactory) {
    $scope.operatorName = $stateParams.id;
    $scope.img_src = sharedFactory.img_src;
    var promise = sharedFactory.services.get_ops(sharedFactory.dbId, [$stateParams.id]);
    promise.then(
        function(result){
            $scope.data = result[0];
            $scope.$apply()
        },
        function(err){console.log("get_ops fail")}
    )
});
