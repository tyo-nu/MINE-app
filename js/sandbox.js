// This file is not currently loaded by index.html
angular.module('app',[]);
angular.module('app').factory('DataFactory', function(){
    return {choice:{value:'This',  db :'KEGGexp'}};
});

angular.module('app').controller('mainCtl', function($scope,DataFactory){
  $scope.databases =  [
      {value:'This',  db :'KEGGexp'},
      {value:'This1',  db :'KEGGexp1'},
      {value:'This2',  db :'KEGGexp2'}
  ];
  $scope.data = DataFactory;
});

angular.module('app').controller('firstSubCtl', function($scope,DataFactory){
  $scope.test = "start"
  $scope.data = DataFactory;
  $scope.callback = function(){
      console.log("here");
  };
  $scope.$watch('DataFactory.choice', function() {
    console.log(DataFactory.choice.value);
});

});

angular.module('app').directive('cpdDetail', function() {
    return {
        link: function(scope, ele, attr) {
            var id = scope.comp[1];
            if (id[0]=="C") {
                $(ele).popover({title: scope.cName,
                    trigger: 'hover',
                    html: true,
                    content: '<img src="' + img_src + id + '.svg" width="250">',
                    template: '<div class="popover" role="tooltip" ><div class="arrow"></div>'
                        + '<h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                })
            }
        }
    }

});