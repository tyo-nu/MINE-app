/* global angular */
/* global mineDatabaseServices */

angular.module('app',['ui.router','ui.bootstrap','ngCookies', 'ngJoyRide', 'ui-rangeSlider', 'angulartics',
    'angulartics.google.analytics', 'ui.select', 'angularMasspecPlotter']);
angular.module('app').factory('sharedFactory', function($state, $cookieStore, $rootScope){
    var factory = {
        dbId: 'KEGGexp2',
        //if the db changes in one of these states, reload the page
        db_dependent_states: ['compounds', 'metabolomicsCompounds', 'structuresres', 'operator', 'acompound.reactants',
            'acompound.products', 'acompound.overview'],
        selected_model: "",
        img_src: "http://webfba.chem-eng.northwestern.edu/MINE_imgs/",
        services: new mineDatabaseServices('http://modelseed.org/services/mine-database'),
        numPerPage: 25, // default number of results to show per page
        setDB: function (db_id) {
            console.log("setDB:"+db_id);
            if (factory.dbId !== db_id) {
                factory.dbId = db_id;
                $cookieStore.put('mine_db', db_id);
                $rootScope.$broadcast("dbUpdated");
                $state.go($state.current, {db:db_id});
            }
        },
        getImagePath: function (id) {
            if (id) {
                var img_root = "http://webfba.chem-eng.northwestern.edu/MINE_imgs/";
                var dir_depth = 4;
                var ext = '.svg';
                for (var i = 0; i < dir_depth; i++) {
                    img_root += id[i] + "/";
                }
                return img_root + id + ext
            }
        },
        downloadFile: function (contents,filename) {
            // Warning: This function may not work with IE!
            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        convertToCSV: function(compounds, fields) {
            var objArray = typeof compounds != 'object' ? JSON.parse(compounds) : compounds;
            var replacer = function(key, value) {
                if (value === null) {return '';}
                if (typeof value === 'object') {return value.join(';');}
                return value;
            };
            var csv = objArray.map(function(row){
              return fields.map(function(fieldName){
                return JSON.stringify(row[fieldName], replacer)
              }).join(',')
            });
            csv.unshift(fields.join(',')); // add header column
            return csv.join('\r\n');
        },
        paginateList: function(list, currentPage, numPerPage){
            var begin = ((currentPage - 1) * numPerPage);
            var end = begin + numPerPage;
            return list.slice(begin, end);
        },
        filterList: function(list, mine, compound, formula) {
            // filtering but we have to handle names carefully (sometimes not present) and use RegEx with formula
            var filteredList = [];
            var f_patt = new RegExp(formula, 'i');
            var c_patt = new RegExp(compound, 'i');
            for (var i = 0; i < list.length; i++) {
                if ((f_patt.test(list[i].Formula.toString())) && (list[i].MINE_id.toString().indexOf(mine) > -1) &&
                    (!compound || (typeof(list[i].Names) != 'undefined') && (c_patt.test(list[i].Names.toString())))) {
                    filteredList.push(list[i])
                }
            }
            return filteredList
        },
        sortList: function(list, attribute, ascending){
            list.sort(function(a,b){
                if (a[attribute]===""||a[attribute]===null) return 1;
                if (b[attribute]===""||a[attribute]===null) return -1;
                var order;
                if (typeof a[attribute] === 'string') {
                        order = a[attribute].localeCompare(b[attribute])
                    }
                    else {order = a[attribute]-b[attribute]}
                return (ascending ? -order : order)
            });
            return list
        }
    };
    return factory
});
if (navigator.userAgent.indexOf('MSIE') > 0 || navigator.appVersion.indexOf('Trident/') > 0) {
   alert("This web application does not officially support Internet Explorer and some elements may not render or " +
       "function correctly in this environment. For best performance, utilize the Chrome browser.")
}

angular.module('app').directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});

angular.module('app').controller('cookieCtl',function($scope,$cookieStore) {
    $scope.startGeneralTour = function () {
        var tour = new Tour(generalTour());
        tour.init();
        tour.start();
    };

    $scope.startMetabolomicsTour = function () {
        var tour = new Tour(metabolomicsTour());
        tour.init();
        tour.start();
    };

    var visited = $cookieStore.get('mine');
    if( typeof(visited) == 'undefined') {
        $cookieStore.put('mine', "mine_visitor");
        //$scope.startGeneralTour()
    }
    $scope.getSize = function (url) {
        var request;
        request = $.ajax({
            type: "HEAD",
            url: url,
            success: function () {
              return request.getResponseHeader("Content-Length");
            }
        });
    };
    $scope.structure_src = 'http://lincolnpark.chem-eng.northwestern.edu/release/';
    $scope.spectra_src = 'http://minedatabase.mcs.anl.gov/release/CFM_spectra/';
});

angular.module('app').controller('databaseCtl',  function ($scope,$state,sharedFactory,$cookieStore) {
    $scope.databases =  [
        {id:0, name:'KEGG',  db :'KEGGexp2'},
        {id:1, name:'EcoCyc', db : 'EcoCycexp2'},
        {id:2, name:'YMDB', db : 'YMDBexp2'},
        {id:3, name:'Chemical Damage SEED', db : 'CDMINE'},
    ];

    var updateSelection = function() {console.log("ping"); $scope.databases.forEach(
        function (option) {if (sharedFactory.dbId == option.db) $scope.database = $scope.databases[option.id]})};

    var database_id = $cookieStore.get('mine_db');
    if (typeof(database_id) != 'undefined') {sharedFactory.dbId = database_id}
    updateSelection();
    $scope.$on("dbUpdated", updateSelection);

    $scope.$watch('database', function() {
        sharedFactory.setDB($scope.database.db)
    });
});

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    //HOME
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: "cookieCtl"
    });
    $stateProvider.state('download', {
        url: '/download',
        templateUrl: 'partials/download.html',
        controller: "cookieCtl"
    });
    //FAQ
    $stateProvider.state('faq', {
        url: '/faq',
        templateUrl: 'partials/FAQ.html',
        controller: "cookieCtl"
    });

    // COMPOUNDS QUICK SEARCH see textSearch.js
    $stateProvider.state('compounds', {
        url: '/compounds-:search?db',
        views: {
            '':{
                templateUrl: 'partials/compoundslist.html',
                controller: "compoundsCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });
    $stateProvider.state('advancedsearch', {
        url: '/advancedsearch',
        views: {
            '':{
                templateUrl: 'partials/advancedsearch.html',
                controller: "advancedSearchCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });


    // AN INDIVIDUAL COMPOUND see acompound.js
    $stateProvider.state('acompound', {
        url: '/acompound-:id?db',
        templateUrl: 'partials/acompound.html',
        controller: "acompoundCtl"
    });
    $stateProvider.state('acompound.overview', {
        url: '/overview',
        templateUrl: 'partials/overview.html',
        controller: "acompoundCtl"
    });
    $stateProvider.state('acompound.reactants', {
        url: '/reactantIn',
        templateUrl: 'partials/reactions.html',
        controller: "reactantInCtl"
    });
    $stateProvider.state('acompound.products', {
        url: '/productOf',
        templateUrl: 'partials/reactions.html',
        controller: "productOfCtl"
    });

    $stateProvider.state('operator', {
        url: '/operator-:id?db',
        views: {
            '': {
                templateUrl: 'partials/operator.html',
                controller: "operatorCtl"
            },
            'rxns': {
                templateUrl: 'partials/reactions.html',
                controller: "rxnListCtl"
            }
        }
    });


    //METABOLOMICS see metabolomics.js
    $stateProvider.state('msAdductSearch', {
        
        url: '/msAdductSearch',
        views: {
            '':{
                templateUrl: 'partials/ms-adduct.html',
                controller: "metabolomicsCtl"
            },            
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });
    $stateProvider.state('ms2search', {

        url: '/ms2search',
        views: {
            '':{
                templateUrl: 'partials/ms2-search.html',
                controller: "ms2searchCtl"
            },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });
    $stateProvider.state('metabolomicsCompounds', {
      url: '/metabolomicsCompounds-:search?db',
      views: {
            '':{
                templateUrl: 'partials/metaboliteslist.html',
                controller: "metabolomicsCompoundsCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });


    // STRUCTURES see structures.js
    $stateProvider.state('structuresres', {
        url: '/structuresres:search?db',
        views: {
            '':{
                templateUrl: 'partials/compoundslist.html',
                controller: "structuresresCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }

    });
    $stateProvider.state('structure', {
        url: '/structure',
        views: {
            '':{
                templateUrl: 'partials/structureSearch.html',
                controller: "structureCtl"
                },
            'sidebar':{
                templateUrl: 'partials/models.html',
                controller: "modelsCtl"
            }
        }
    });

    //Top 30 damage prone metabolites reaction list
    $stateProvider.state('top30', {
        url: '/top30',
        templateUrl: 'partials/top30.html',
        controller: "cookieCtl"
    });
    $stateProvider.state('top30.s1', {
        url: '/S1:id',
        templateUrl: 'partials/S1.html',
        controller: "s1Ctl"
    });
    $stateProvider.state('top30.s2', {
        url: '/S2',
        templateUrl: 'partials/S2.html',
        controller: "s2Ctl"
    });
});