// This file is currently not loaded by index.html
angular.module('app').controller('keggCtl', ['$scope', function($scope){
    $scope.thisAtt = "";
    $scope.mapName = 'map00010';
}]);




angular.module('app').directive('keggCard', function() {
  return {
    restrict: 'E',
    link : function(scope, element , attrib){
  
        var wsPath = 'rcolasanti:MINEMaps';
        var client = new Workspace();
        var promise = client.get_objects([{
            workspace: wsPath,
            name: scope.mapName
        }]);
   
        $.when(promise).done( function(result){
            $(element).kbasePathway({
                ws:wsPath,
                editable: false,  
                mapData: result[0].data     
            })
            $('.cpd-label').click(function() {
                var label = $(this).text();
                scope.thisAtt = label;
                scope.$apply();

            })
            $('circle').click(function() {
                var label = $(this).parent().find('.cpd-label').text();
                scope.thisAtt = label;
                scope.$apply();

            })

        });
    }
  };
});
