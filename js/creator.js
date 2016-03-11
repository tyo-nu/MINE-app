angular.module('app').factory('operatorFactory', function(){
    return{
        mrvReactants:'',
        mrvProducts:'',
        spec: {
            operatorName:'',
            reactants:[],
            products:[],
            comments:'',
            "generate_reverse": false
        },
        operator:"",
        validateOperator: function() {
        if (!this.operator) {
            alert("ERROR: Operator is blank.");
            return false
        }
        return true
        }
    };
});

angular.module('app').controller('opCreatorCtl',  function($scope,$state,operatorFactory) {
    $scope.operatorName= operatorFactory.spec.operatorName;
    $scope.reactants= operatorFactory.spec.reactants;
    $scope.products= operatorFactory.spec.products;
    $scope.comments= operatorFactory.spec.comments;
    $scope.opURL = "";

    $scope.cofactors = [{'id': 0, 'name': 'Any'}, {'id': 1, 'name': '2-oxoglutarate'}, {'id': 2, 'name': '3-5-ADP'},
                     {'id': 3, 'name': '5-Formyl-H4MPT'}, {'id': 4, 'name': 'Acetaldehyde'},
                     {'id': 5, 'name': 'Acetate'}, {'id': 6, 'name': 'AcetylCoa'}, {'id': 7, 'name': 'ADP'},
                     {'id': 8, 'name': 'AMP'}, {'id': 9, 'name': 'ATP'},
                     {'id': 10, 'name': 'Bicarbonate'}, {'id': 11, 'name': 'CO2'}, {'id': 12, 'name': 'CoA'},
                     {'id': 13, 'name': 'DMAPP'}, {'id': 14, 'name': 'E'}, {'id': 15, 'name': 'Formaldehyde'},
                     {'id': 16, 'name': 'Glutamate'}, {'id': 17, 'name': 'H+'}, {'id': 18, 'name': 'H2O2'},
                     {'id': 19, 'name': 'H4MPT'}, {'id': 20, 'name': 'HBr'}, {'id': 21, 'name': 'HCl'},
                     {'id': 22, 'name': 'HF'}, {'id': 23, 'name': 'Histidine'}, {'id': 24, 'name': 'Indole'},
                     {'id': 25, 'name': 'IPP'}, {'id': 26, 'name': 'NAD+'}, {'id': 27, 'name': 'NADH'},
                     {'id': 28, 'name': 'Ammonia'}, {'id': 29, 'name': 'Nitrate'}, {'id': 30, 'name': 'O2'}, {'id': 31, 'name': 'PAPS'},
                     {'id': 32, 'name': 'Phenol'}, {'id': 33, 'name': 'Phospho-Histidine'}, {'id': 34, 'name': 'Pi'},
                     {'id': 34, 'name': 'PPi'}, {'id': 35, 'name': 'S-Adenosylhomocysteine'},
                     {'id': 35, 'name': 'S-Adenosylmethionine'}, {'id': 36, 'name': 'Sulfite'},
                     {'id': 37, 'name': 'Water'}];
    $scope.compoundChoice = $scope.cofactors[0];
    $scope.indices = '';
    $scope.tour = false;

    var services = new operatorCreator('http://bio-data-1.mcs.anl.gov/services/operator-creator');
    /*var promise = services.get_cofactors();
    promise.then(
            function(result){
                $scope.cofactors = JSON.parse(String(result))
                $scope.reactantChoice = $scope.cofactors[0];
                $scope.productChoice = $scope.cofactors[0];
                $scope.$apply();
            },
            function(err){
                alert("ERROR!");
                console.log(err);
    });*/

    var marvinSketcherInstance;
    MarvinJSUtil.getEditor("#sketch").then(function(sketcherInstance) {
        marvinSketcherInstance = sketcherInstance;
        marvinSketcherInstance.setDisplaySettings({
            "implicitHydrogen" : "OFF",
            "atomIndicesVisible" : true,
            "backgroundColor": "#f5f5f5"
            });
        initializeTour();
    }, function(error) {
        alert("Loading of the sketcher failed"+error);
    });

    $scope.addItem = function(array, value){
        if (array == $scope.reactants){
            if ($scope.indices){
                array.push(value+": "+ $scope.indices);
            }
            else{
                alert("Please specify atom indices for this reactant.");
            }
        }
        else{
            array.push(value);
        }
    };

    $scope.removeRow = function(array, index){
        array.splice(index, 1);
    };

    $scope.mrvIO = function(key){
        //this function interchanges data between the the editor and a target variable in mrv form
        if (operatorFactory[key]) {
            marvinSketcherInstance.importStructure("mrv", operatorFactory[key]).catch(function(error) {
                alert(error);
            });
            operatorFactory[key] = '';
        }
        else {
            var exportPromise = marvinSketcherInstance.exportStructure('mrv', null);
            exportPromise.then(function (source) {
                operatorFactory[key] = source;
                $scope.$apply();
            }, function (error) {
                alert(error);
            });
        }
    };

    $scope.buttonColor = function(key){
        if (operatorFactory[key]){
            return "btn btn-success"
        }
        else {
            return "btn btn-primary"
        }
    };

    $scope.buildOp = function(){
        if (!$scope.operatorName){
            alert("Please specify an operator name")
        }
        else if (!$scope.products){
            alert("Please specify an operator products")
        }
        else if (!$scope.reactants){
            alert("Please specify an operator reactants")
        }
        else{
            operatorFactory.spec = {
                "operatorName": $scope.operatorName,
                "reactants": $scope.reactants,
                "products": $scope.products,
                "comments": $scope.comments + "\nGenerated on "+ new Date().toDateString() +" by MINE Operator Creator",
                "generate_reverse": false
            };
            var promise = services.make_operator(operatorFactory.mrvReactants, operatorFactory.mrvProducts, operatorFactory.spec);
            promise.then(
                function(result){
                    operatorFactory.operator = result;
                    $state.go('optest');
                },
                function(err){
                    alert("ERROR!");
                    console.log(err);
                }
            );
        }
    };
    function initializeTour(){
        $scope.tourConfig = [
            {
                type: "title",
                heading: "Welcome to the Operator Creator Tour",
                text: "This Demo will walk you through the basics of generating reaction rules with the MINE operator" +
                    " creator tool. However it won't cover the how to successfully generalize chemistry."

            },
            {
                type: "element",
                selector: "#opName",
                heading: "Operator Name",
                placement: "left",
                text: "You should give your operator a descriptive name. If it's a based on enzyme chemistry this is " +
                    "usually a variation on the EC class covered",
                scroll: true
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Marvin Canvas",
                text: "This is the canvas for sketching the structures of reactants and products. Special atoms and " +
                    "ring codes can be entered using the psudoatom button. Click the A at the lower right-hand panel " +
                    "and select the blue question mark. Alternates atoms should be separated with commas and ring-codes " +
                    "with underscores.",
                scroll: true
            },
            {
                type: "function",
                fn: loadReactants
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Example Reactants",
                text: "Here we've loaded an example reactant. Note the representation of all bonds and hydrogen atoms" +
                    " not explicitly drawn using psudoatoms.",
                scroll: true
            },
            {
                type: "element",
                selector: "#btn-setR",
                heading: "Set the Reactants",
                text: "When we are happy with the display of the reactants we can set them by clicking this button",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: setReactants
            },
            {
                type: "element",
                selector: "#btn-setR",
                heading: "Reactants are set",
                text: "Note how the button turns green when the reactants are set. If we want to change the reactants" +
                    " later, all we need to do is click the button to load them back into the editor",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#compoundSelect",
                heading: "Enter reactant information",
                text: "Now we may add in compound information. Select a specific cofactor or Any and enter the atoms" +
                    " spanned by that compound",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#compoundAdd",
                heading: "Add reactant information",
                text: "Click to add the data above to the product or reactant arrays.",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: loadProducts
            },
            {
                type: "element",
                selector: "#canvas",
                heading: "Model reaction changes",
                text: "Now we can model the reaction changes by adding or removing bonds. During this process it's " +
                    "important not to add or delete atoms because this could corrupt the atom indexing and lead to " +
                    "nonsensical operators.",
                scroll: true
            },
            {
                type: "function",
                fn: fillForm
            },
            {
                type: "element",
                selector: "#op-form",
                heading: "Fill out the rest of the details",
                text: "Next fill in all the remaining information",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: setProducts
            },
            {
                type: "element",
                selector: "#bottom-btns",
                heading: "Fill out the rest of the details",
                text: "With the for filled out and the reactants and products loaded we are ready to generate the operator.",
                placement: "left",
                scroll: true
            },
            {
                type: "function",
                fn: buildOp
            },
            {
                type: "element",
                selector: "#op-text",
                heading: "Operator text",
                text: "This is the text that was generated that represents the chemical transformation. You can edit the " +
                    "text here and see it's impact on the operators function if necessary",
                scroll: true
            },
            {
                type: "element",
                selector: "#cpd-test",
                heading: "Test reactivity with kegg compounds",
                text: "This feature let's you enter a KEGG compound ID to check how many reactions the operator " +
                    "predicts. You can experiment with the tool to see that C00299 (Uridine) is a valid substrate.",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#map-test",
                heading: "Test reaction mapping",
                text: "This feature let's you test how many total reactions the operator predicts when run against all KEGG" +
                    " compounds as well as how many of those predicted reactions are present in KEGG. This test takes up to" +
                    " ten minutes to run though so be sure your operator is correct before testing.",
                placement: "left",
                scroll: true
            },
            {
                type: "element",
                selector: "#upload-op",
                heading: "Upload an existing operator",
                text: "You can even use these tools on existing operators. Use this box to upload an operator of your " +
                    "own from your computer.",
                scroll: true
            },
            {
                type: "element",
                selector: "#download",
                heading: "Download the completed operator",
                text: "If you are happy with the performance of this operator, click hear to download it as a BNICE " +
                    "compatible .dat file",
                placement: "left",
                scroll: true
            }
        ];

        function loadReactants() {
            marvinSketcherInstance.importStructure("mrv",'<cml><MDocument><MChemicalStruct><molecule molID="m1"><atomArray><atom id="a1" elementType="C" x2="-7.145833333333333" y2="2.0416666666666665" mrvPseudo="OH"/><atom id="a2" elementType="C" x2="-5.738973328563728" y2="2.6680410970033988" mrvPseudo="CH2"/><atom id="a3" elementType="C" x2="-5.237302612324531" y2="0.7957804953292473" mrvPseudo="CH-_N1;51;"/><atom id="a4" elementType="C" x2="-2.9252533190245176" y2="2.6680410970033988" mrvPseudo="O-_N1;51;"/><atom id="a5" elementType="C" x2="2.3541666666666665" y2="1.0416666666666667" mrvPseudo="=P"/><atom id="a6" elementType="C" x2="2.6743506705260156" y2="-0.46468063846339414" mrvPseudo="OH"/><atom id="a7" elementType="C" x2="3.8857303855338072" y2="0.8806928332344803" mrvPseudo="OH"/><atom id="a8" elementType="O" x2="0.8141666666666665" y2="1.041666666666667"/><atom id="a9" elementType="C" x2="-0.6921806384633944" y2="0.7214826628073179" mrvPseudo="=P&lt;"/></atomArray><bondArray><bond atomRefs2="a1 a2" order="1"/><bond atomRefs2="a2 a3" order="1"/><bond atomRefs2="a3 a4" order="1"/><bond atomRefs2="a5 a6" order="1"/><bond atomRefs2="a5 a7" order="1"/><bond atomRefs2="a5 a8" order="1"/><bond atomRefs2="a8 a9" order="1"/></bondArray></molecule></MChemicalStruct></MDocument></cml>').catch(function(error) {
              alert(error);
            });
        }
        function loadProducts() {
            marvinSketcherInstance.importStructure("mrv",'<cml><MDocument><MChemicalStruct><molecule molID="m1"><atomArray><atom id="a1" elementType="C" x2="-1.645833333333333" y2="-0.75" mrvPseudo="OH"/><atom id="a2" elementType="C" x2="-5.738973328563728" y2="2.6680410970033988" mrvPseudo="CH2"/><atom id="a3" elementType="C" x2="-4.570635945657864" y2="1.087447161995914" mrvPseudo="CH-_N1;51;"/><atom id="a4" elementType="C" x2="-2.9252533190245176" y2="2.6680410970033988" mrvPseudo="O-_N1;51;"/><atom id="a5" elementType="C" x2="-8.604166666666666" y2="1.2083333333333335" mrvPseudo="=P"/><atom id="a6" elementType="C" x2="-8.283982662807317" y2="-0.2980139717967275" mrvPseudo="OH"/><atom id="a7" elementType="C" x2="-7.072602947799525" y2="1.0473594999011469" mrvPseudo="OH"/><atom id="a8" elementType="O" x2="-8.019166666666665" y2="2.625"/><atom id="a9" elementType="C" x2="-0.6921806384633944" y2="0.7214826628073179" mrvPseudo="=P&lt;"/></atomArray><bondArray><bond atomRefs2="a2 a3" order="1"/><bond atomRefs2="a3 a4" order="1"/><bond atomRefs2="a5 a6" order="1"/><bond atomRefs2="a5 a7" order="1"/><bond atomRefs2="a5 a8" order="1"/><bond atomRefs2="a1 a9" order="1"/><bond atomRefs2="a2 a8" order="1"/></bondArray></molecule></MChemicalStruct></MDocument></cml>').catch(function(error) {
            alert(error);
            });
        }
        function fillForm() {
            $scope.operatorName='Example_Operator';
            $scope.reactants = ['Any: 1-4', "ATP: 5-9"];
            $scope.products = ['Any', 'ADP'];
            $scope.comments = 'This is an example operator'

        }
        function setReactants(){
            $scope.mrvIO("mrvReactants")
        }
        function setProducts(){
            $scope.mrvIO("mrvProducts")
        }
        function buildOp() {
            $scope.buildOp()
        }
        $scope.tour = true
    }
    $scope.startOpTour = function () {
        $scope.startJoyRide = true;
    };
});

angular.module('app').controller('opTestCtl',  function($scope,$state,operatorFactory, sharedFactory) {
    $scope.op_name = operatorFactory.spec.operatorName;
    $scope.operator = operatorFactory.operator;
    $scope.keggID = "";
    $scope.mapDatabase = "";
    $scope.testedCompounds = [];
    $scope.mappedReactions = "";

    var services = new operatorCreator('http://bio-data-1.mcs.anl.gov/services/operator-creator');

    $scope.$watch('operator', function() {
        operatorFactory.operator = $scope.operator
    });

    $scope.uploadOperator = function(){
        var selectedFile = document.getElementById('operatorFile').files[0];
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload=function(){
            $scope.op_name= selectedFile.name;
            $scope.operator= reader.result;
            $scope.$apply();
        }
    };

    $scope.testOperator = function(testCompound) {
        if (operatorFactory.validateOperator()) {
            var promise = services.test_operator(operatorFactory.operator, testCompound);
            $scope.testedCompounds.push([testCompound,"Calculating..."]);
            var i = $scope.testedCompounds.length -1;
            promise.then(
                function(result){
                    $scope.testedCompounds[i][1] = result;
                    $scope.$apply();
                },
                function(err){
                    alert("ERROR!");
                    console.log(err);
                }
            );
        }
    };

    $scope.mapOperator = function(db) {
        if (operatorFactory.validateOperator()) {
            if ((db == "KEGGdb")||(db == "NoMap")) {
                var ok = confirm("Mapping an operator takes 5-10 minutes. Proceed?");
                if (ok) {
                    var promise = services.map_operator(operatorFactory.operator, db, "");
                    $('#map-btn').prop('disabled', true).text("Calculating...");
                    promise.then(
                        function(result){
                            $scope.mappedReactions = result;
                            console.log(result);
                            $('#map-btn').prop('disabled', false).text("Map Operator");
                            $scope.$apply();
                            alert("Mapping complete!");
                        },
                        function(err){
                            alert("Mapping Error");
                            console.log(err);
                            $('#map-btn').prop('disabled', false).text("Map Operator");
                        }
                    );
                }
            }
            else {
                alert("Please enter a different database.");
            }
        }
    };

    $scope.getImage = function() {
        if (operatorFactory.validateOperator()) {
            var promise = services.operator_image($scope.operator);
            promise.then(
                function(svg){
                    $('#img-div').html(svg);
                    $('#modal').modal('toggle')
                },
                function (err) {console.log(err)}
            )
        }
    };

    $scope.goEditor = function() {
        $state.go('creator');
    };

    $scope.downloadFile = function(contents,filename) {
        sharedFactory.downloadFile(contents,filename)
    };
});