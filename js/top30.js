
angular.module('app').factory('top30Factory', function($rootScope){
    var factory = {
        services: new mineDatabaseServices('http://bio-data-1.mcs.anl.gov/services/mine-database'),
        img_src: "http://lincolnpark.chem-eng.northwestern.edu/Smiles_dump/",
        getReactions: function(db, rxn_ids) {
            var promise = factory.services.get_rxns(db, rxn_ids);
            promise.then(function (result) {
                    factory.reactions = result;
                    $rootScope.$broadcast("rxnLoaded")
                },
                function (err) {console.error("get_rxns fail");}
            );
        },
        //Popups with image & name
        getCompoundName: function(db){
            return function($event, id) {
                if ((!$($event.target).data('bs.popover')) && (id[0] == "C")) {
                    var Promise = factory.services.get_comps(db, [id]);
                    Promise.then(
                        function (result) {
                            var cTitle;
                            if (result[0].Names) {cTitle = result[0].Names[0]}
                            else if (result[0].MINE_id) {cTitle = result[0].MINE_id}
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
    return factory
});

angular.module('app').controller('s1Ctl', function($scope,$stateParams,$cookieStore,sharedFactory,top30Factory){
    $scope.currentPage = 1;
    $scope.numPerPage = 50;
    $scope.maxSize = 6;
    $scope.img_src = sharedFactory.img_src;
    var top30db = "Expected";
    sharedFactory.setDB("CDMINE"); //Set to the Chemical Damage Database
    var reactions;
    $scope.searchType = "";
    $scope.searchComp = "";
    console.log($stateParams.id);

    //if specific reactions specified, get only those
    if ($stateParams.id) {top30Factory.getReactions(top30db, $stateParams.id.split(','))}
    else {top30Factory.getReactions(top30db, damageReactionIDs)}

    $scope.$on("rxnLoaded", function () {
        reactions = top30Factory.reactions;
        $scope.items = reactions.length;
        //if there is a cookie for which page the user was last on, use it unless it's beyond the end of the list
        if($cookieStore.get("S1_Page")<($scope.items/$scope.numPerPage)) {$scope.currentPage = $cookieStore.get("S1_Page")}
        $scope.paginatedData = sharedFactory.paginateList(reactions, $scope.currentPage, $scope.numPerPage);
        $scope.$apply();
    });

    $scope.getCompoundName = top30Factory.getCompoundName(top30db);
    $scope.parseInt = parseInt;

    $scope.$watch('currentPage + searchType + searchComp', function() {
        if (reactions) {
            var filtered = sharedFactory.filterList(reactions, "Type", $scope.searchType);
            filtered = sharedFactory.filterList(filtered, "Compound", $scope.searchComp);
            $scope.paginatedData = sharedFactory.paginateList(filtered, $scope.currentPage, $scope.numPerPage);
            $scope.items = filtered.length;
            $cookieStore.put("S1_Page", $scope.currentPage)
        }
    });
});

angular.module('app').controller('s2Ctl', function($rootScope,$scope,$stateParams,$cookieStore,sharedFactory,top30Factory){

    $scope.currentPage = 1;
    $scope.numPerPage = 20;
    $scope.maxSize = 5;
    $scope.img_src = sharedFactory.img_src;
    sharedFactory.setDB("CDMINE"); //Set to the Chemical Damage Database
    var operators;
    $scope.searchName = "";

    var promise = top30Factory.services.get_ops("CDMINE", operatorList);
    promise.then(function (result) {
            operators = result;
            if($cookieStore.get("S2_Page")<($scope.items/$scope.numPerPage)) {$scope.currentPage = $cookieStore.get("S2_Page")}
            $scope.paginated = sharedFactory.paginateList(operators, $scope.currentPage, $scope.numPerPage);
            $scope.items = operators.length;
            $scope.$apply();
        },
        function (err) {console.error("get_ops fail");}
    );

    $scope.$watch('currentPage + searchName', function() {
        if (operators) {
            var filtered = sharedFactory.filterList(operators, "_id", $scope.searchName);
            $scope.paginated = sharedFactory.paginateList(filtered, $scope.currentPage, $scope.numPerPage);
            $scope.items = filtered.length;
            $cookieStore.put("S2_Page", $scope.currentPage)
        }
    });
});

var operatorList = [
	"Aldehyde_Attack_cyc",
	"Aldehyde_Oxidation",
	"Alpha_Amine_Carbamylation",
    "AlphaBeta_HNE_1",
    "Amino_Carbamylation",
	"Amine_MGlyoxal_Condensation",
	"Amine_Malonaldehyde_Condensation",
	"Amine_Malonaldehyde_Condensation_2",
	"Amine_Pyridoxal_Condensation",
	"Amino_Aldehyde_2",
	"Amino_Glycoaldehyde",
	"Amino_Glyoxal",
	"Amino_Glyoxal_Cyclization_1",
	"Amino_Glyoxal_Cyclization_2",
	"Amino_Pyridoxal_1",
	"Amino_Vinyl_Cyclization_1",
    "Amino_Vinyl_Cyclization_2",
	"Aminoacrylate_CysAdduct_1",
	"Aminoacrylate_CysAdduct_3",
	"Auto-oxidation",
	"Beta_Hydroxy_Oxidation",
	"Carbonyl_Phosphoester_Hydrolysis",
	"Chorismate_Rearrangement",
	"CoA_Thiol_Adducts",
	"CoA_Thiol_Adducts_2",
    "Cyclohexadiene_Dehydration",
	"Cyclohexadiene_Dehydration_2",
	"Cysteamine_Vinyl",
	"Cysteine_Vinyl",
	"Deamination_1",
	"Deamination_2",
	"Decarbamylation",
	"Decarboxylation_1",
	"Decarboxylation_2",
	"Decarboxylation_3",
	"Desthio_Thiazole",
	"Dihydroxyacetone_1",
	"Disulfide_Formation",
	"Enol_Ether_Elimination",
	"Folates_Oxidation",
	"Folates_Oxidation_2",
	"Folates_Oxidation_3",
	"Glyceraldehyde_Elimination",
	"Glycoaldehyde_Amine_Condensation",
	"Glycoaldehyde_Cyc",
	"Glycolate_Oxidation",
	"Glyoxal_Elimination",
	"Guanidine_Glyoxal_Condensation",
	"Hydroxyaldehyde_Cyclization",
    "Hydroxypyruvate_Oxidation",
	"Imine_Reduction",
	"Imine_Hydrolysis",
	"Isocyanate_Formation",
	"Ketimine_Hydrolysis",
	"Lactam_Formation_1",
	"Lactam_Formation_2",
	"Lactam_Formation_3",
	"Malonaldehyde_Condensation_1",
	"Malonaldehyde_Oxidation",
	"Methyl_Ketone_Attack",
	"Methylation_1",
	"Methylation_2",
	"NAD(P)HX_Cyclization",
	"NAD(P)H_Hydration",
	"NAD(P)H_Oxidation_1",
	"NAD(P)H_Oxidation_2",
	"NAD(P)_Adducts_1",
	"NAD(P)_Adducts_2",
	"NAD(P)_Glycoaldehyde",
	"N_Glycosidic_Hydrolysis",
	"Nring_Pyridoxal_1",
	"Nring_Pyridoxal_2",
	"Open_Aldose_Dehydration",
	"Open_Phosphosugar_Cyclization",
	"Peroxidation_Decarboxylation",
	"Peroxide_Cleavage",
	"Peroxide_Epoxidation",
	"Phosphoribose_Cyclization_Phosphate_Elimination",
	"Pyridine_Cyclization",
	"Pyridine_Oxidation",
	"Pyridine_Oxidation_2",
	"Pyridoxal_1",
	"Pyridoxal_Cyclization",
	"Pyridoxine_Oxidation",
	"Pyrrole_Formation",
	"Pyrroline_2",
	"Pyrroline_3",
	"Ribose_Hydrolysis",
	"Ribose_Ring_Opening",
	"Ribulose_Hydrolysis",
	"Secondary_Amine_Hydrolysis",
	"Sulfonium_Cleavage",
	"Thiaminase",
    "Thiazole_Cleavage",
	"Thiazole_Ring_Opening_1",
	"Thiazole_Ring_Opening_2",
	"Thiazole_Oxidation",
	"Thiazolidine_Formation_1",
	"Thiazolidine_Formation_2",
	"Thioester_Formation",
	"Thioester_Hydrolysis",
	"Thiol_Fumarate",
	"Thiol_Glycoaldehyde",
	"Thiol_Glyoxal",
	"Thiol_oxidation",
    "Thiol_Vinyl_Cyclizing"
];

var damageReactionIDs = [
    "Rc22714d9fff22308065bcfc04f10c1c16c0be761",
    "Rbce39eaa62bb7d27febb03d6de933e73563e3fc7",
    "Rde2c9f9a54aec16049a35ed94d829b2eea2c52a8",
    "Rcc3e18516175194cc40040fb67822c0ebabcab59",
    "Rcc6f33026d799e264e226adfc01409cfd7d99f47",
    "R7f30c2294ed9a3e0e495134439d26944b6dc03f5",
    "Rd1e3b7403a716b2fa1e8ea6385bebb12a5ccf184",
    "R746e0dfdf2b2e3c6aa554ad2cbba42f66cfc1bd4",
    "Rc11a5d1d7a24c3f0d0717dbb21d6be9927b8f5ba",
    "R19d80e3bfdabae0cb8407ae300f61b45969a8d8b",
    "R6610697fbab8b9d2681744a3b72980fa7fb91bf3",
    "R13fe58ed7c0f3b55f6678f2c739832aeebc9651a",
    "R94ccd123fc661bd031f29887516ab66eb0156260",
    "R5a3dc2282573ff1694f6458454d5009b6ece290b",
    "R2b2f6640f4661409adf8a81d32ef3341a5d580ed",
    "Ra2a10a433f81ce4e2d8fa06dd212d5161f643b36",
    "R625208a26d90dffb311430433fbb16d69265b289",
    "Raeea25cd1bba325f6cbd7e6169944d5294ab1d7e",
    "R2b63b98971419f8f57b2ba94f8b6aeb2b3f12d4b",
    "R706c6ec526ecdbc30c82d2ad7431c3726d8460b8",
    "Re204771331f75ba98614824394418a5c62d7895a",
    "R0ad51cf8c25d12cfbb085eae04d5f359e9fb0097",
    "Re7f3978ae719f947ba7426822c5186233d574fc6",
    "R86c62935c7f11686f18e2ab03a1a494dd24f63c9",
    "Rbb00343dd3f039892f8813777de8efef373271dc",
    "Rddc670e5925be14c589d7ad1cd959877d4933cdd",
    "R874fa889c748521defed31b86325b5fa22ca5bb3",
    "R762463f2c6eb2e6ff14f78b0eee28d4fd2ff6a8a",
    "Rba3dff2435c34f4e36b03586e74809a89d0ba5fc",
    "R9fecc80c4be17c5d3504b48e8332291f3e122ff7",
    "Rc1a352e7c62b2b4a472583744e55ab69895fe98f",
    "Rc795317cb0dc841c929d9ecd5495bc9453797938",
    "R486d2419822deea501cb615317282aa8a6265515",
    "Rf0d3c103afe6ab8ee3b8746b25e3177315c602e2",
    "R069b1d7d7e599d738f6036279d557559b8758724",
    "Rbc14e6984a3338e4c212847d34b3a4444d45d9d9",
    "Rf4e8a4ebb498870a96b12992fdb60661a82b282e",
    "R9d6f21696d0494e5e5e5a13527a4191bd49f738d",
    "Rc7774fdaf9f396a2316162677b4cd8d5983487e3",
    "R8d95b60e3852580e6a911b5e937a17fe293de56f",
    "Re07db863820b4a766bee454a0345728687386baa",
    "R856299f1a8c6d1d420b2dc037c257a5e23ec05d6",
    "Rf4181dc0483c4c2438af04d25924556b63cae86c",
    "Rcc99acfb943b1df4f638a03e3ff1e498e94515b2",
    "R856299f1a8c6d1d420b2dc037c257a5e23ec05d6",
    "R7828fdcb0b113c2b3ea6d0122424097b986e845e",
    "R23ab6281a1e7bcb8760e0c3637d1afb1e1245614",
    "R8d9c8664defbdfc1927bb1a2c7f52932a1d42c17",
    "Rf153d62885fe1f3fbe0ff14173e95e7729ff982d",
    "R05316653faa4b493e386c15b7600cfc7254cfd9b",
    "R856299f1a8c6d1d420b2dc037c257a5e23ec05d6",
    "R86b8cffffb94244242dadea5c817920d8d56b8fe",
    "Rc1e25480b7bd9a38f4d65792c6216f13b56fa8f8",
    "R7a61225382510404658145c98036f11b4b2b4824",
    "R7d82eeb924a25088f540a8d834a2730a78a4fd0e",
    "Rf1d18225264a215095d9bf76d855099056446e8e",
    "R64fc49eee557c3053c734a2167f62443bc129a39",
    "R5cbb04138424846ddf99efa74e00ca76fcb832df",
    "R10f6c266375144b6f6dc7b2eb34b630eebb9f69f",
    "Rdb5e71bf100d7682c2d354eb30338b9ee3c42cc3",
    "R30d79c241d948a10b05afd343e95071ad23817a1",
    "R4b89f4f9ccc1e443d8759cb0dd7549186cc7ae6c",
    "R49b2cc7e2c7e64d5fb60bb71edb94dc18c96b1a3",
    "Re0bf39fe9d3348ab66c177a46658f26c3556263e",
    "R3400f3cff09704d954e5c4ef2b16b3502f76dd64",
    "R5c165e0974e253bcdb0e13f79ac8ffa68b439276",
    "Re5be63e936cad74b8a063afe8e1ee6a2729a4fd2",
    "Rb528151c9e2c005814d547c4f927e17463a4ad49",
    "Re84f9d31d5519955092184a7e02d9d4daf7343f0",
    "R687572be5857328d28627e012d57756be9595f50",
    "R6e1f0df27dfe12dd480358f326e524d365492e88",
    "R793cfad35e00184e56218d3e47c539caff899b38",
    "Rd3bc56b67978b235f05a7f7b31bdea65ab3320e6",
    "Re135d80f7083e80f0781b0d83293d08a40549eab",
    "R519f5dc888d43ba8d0c6eddc048f27184bc2e267",
    "Rf199771ede8ce97fe0e5c7bbb57a0662222b5606",
    "R50158c3286c21c174cafc569fe878d76b9e52152",
    "R8966312566b5a15d32c05ca22c38505a8af4cf73",
    "R3e2a41a6c5381b60577639f5549bbe889dc7f237",
    "Ra6dde202059bdb799c91e225029f6cd9269223dd",
    "R082b1ef05aff471215de3047f8a692752382e285",
    "Rda7ea8187b89340bd26dba8c76098717af115d98",
    "Rf77342c3d27c0e92839d9e5474986f7823176619",
    "R54b79d8be3e5f0c3f92955b0d6e65f42b29e11f7",
    "R03758c8c645f2c15a0d61f720cdbc91a368663ec",
    "R04a57f192f3657a6f78ce4a134cf093c8669d846",
    "R25ec7d6b480d4a374f078e0e6fd4477d80714e8e",
    "Re4fe27f1ae24d58ad41e5f8960eac796f83aeb2d",
    "R34690e5716d92e07a01fc0d1ee76aae4aa2c3a5f",
    "R1a6414bb3b9cc89034015d94f2963ce3f10084c8",
    "R906f60ee5b1ca1bb3b1c290e9901f42a50458774",
    "R16cab5e4fa1d0abd3a848ae2701616ec7ff91890",
    "R05c5053afe96b53e5141039ac857d2ad3f7c5988",
    "R45c2caa673c819dcfbee201c3c26dea9a112cd2a",
    "Rd6ecbb72f9b0af058ac6e7ef7e69fe549f59d70b",
    "R6096bcdb02cdc0b9bd7d1942cf00094d85e51f90",
    "R92549a750d8a7f6a4f1705061fef420a9f91fad0",
    "R4cc5fa4ef31a78b4a84b5b92755bf2277068a6e1",
    "Rc361ca52379072e578bec428a534d1283bd1cd9f",
    "R77b5ac377209414f3d597ba1ad7a4b69a9bc3928",
    "Rcfba69aaaeefdcc712e9ebf3229b2fa6cef5205c",
    "R827d6088dbec39d12b0cca789521abac74912fe0",
    "Rdda34585c7748f7c86e28a5c650ed382a9b3c05b",
    "Rbf24d5b29e0905c9bb3bfe2bd1126061bd674d6d",
    "R4c506809271758f87ffcfafbd7a01decfa1dc45c",
    "R11f8b02ad7f38fbfb492979928777ca399251002",
    "R3f56ef2a9dcffdbf143bc6566f85b41fca53059a",
    "Rce35f4c0f7d0937de4833f20ee751137bda17c5c",
    "R00980018eac9eb66e224c895c96443e1dce1a139",
    "R4104d351c67d1f0b98257d2589203da6aaec3b4e",
    "R7ed2cf5d5c4df5ff59a1ad60fc2accd7f951e6df",
    "Rd40d705d2dce3412ff3fb7d48f2d1b9a062891e9",
    "R01fd9e6e79244a30e2031cc903ea2e62481c6d68",
    "R82f0f26b651873f042bde047bfe7a26418e85838",
    "R92ea53f017a2ec94449c428f5053b70234674e93",
    "Re14f957ebc84b2f138700b136d56706ac376da13",
    "R1a9b64aa6c021f47d9de3b4615456434978d01fc",
    "R1b8b80d984f965d1251a754d894f3ebb16402088",
    "R0476accf8c53f9af6e33d45146f8a7ae05017fa3",
    "R410e6b54f299d14e1ee5663cea86dff8f146acc9",
    "Receeb0e001114482b0a7750e49a6a7776fe24f60",
    "Re40389c823db26560a4bb4de792eaab8c1387360",
    "Ra94dc4121f52cdbe38d2c0f786c7a9a4a7f2421b",
    "R88ba28c153755fdf706060d685a8df99ddc32e8a",
    "R4ff139af4935c6143f8b2f4374bb246c9fc8c769",
    "R09370b94918710da8b101587db28ae003555fe07",
    "R19be239b21b0a70cc95cbd89be3d7ad54456ad18",
    "Rf6e2e7d5b71da90b57f3b2b57c1a58e1afe1665b",
    "R548c3d54d079c55ea5a3f1447ea4d0653f0f513f",
    "R354e3474443114511b48777d6e1d762dfaa46522",
    "R21126bab3e0b792ebb9714dc7cff1e520305ac7d",
    "R4d709a9d6eb7b5ae5f91fa045a10de85759351e4",
    "R78a8c2e3a74c03cfb82804949943e4d829ecdd56",
    "R01c4ab34a9d420e9c706add22357fa3e86675028",
    "R960369a77dd519a714e718a09054c6842a7f878b",
    "R2cff15367eb8a722193db491ca53972aff50defb",
    "R783a8a2466f2924791902f82444874710ffdfb30",
    "Ra10ee8778b82f801f28d322a8d8ad3ae94cf7d5f",
    "Rc25c2518d1fb4db44a0f077f754e5e15ea508a5a",
    "R222e456bf66c6ead4bb85afb72e3f67cb7ca99cf",
    "Rf725123673010d4f6b7f1586ed6c4452c0bc5b3e",
    "R690f673ce6cd9ee169c993c32b871cd5d32f0562",
    "Rffc7ccefae1f1212f4f54d90cb707b217fcd2879",
    "Re1ac337db75f6ee5b40097b2da814d60fa0b9cbb",
    "Re8e811c1bf7445ba8ec2a55612bcc756ccac9035",
    "R32fe238d10a7f3bf1a0dd5f9b12cf29d1e1e3772",
    "R7977fa10f8fc7a1b097ca1606f37348229ee85a3",
    "R41b51a0534e22aa98bf1ad9ed29fde9c1e6f2043",
    "Raec904c5f273afa58d23a6486b22ffe59d979680",
    "Rfef835e7b29e0123b3f5eee659db67038e97752a",
    "R2543ec5b2a4dea3fc3ef93346189b937f39a8512",
    "R4b7a0e4a57f281ac01b73f56b55b385000c353f4",
    "R9b1d3a313ccb130ac7be1e1cc1d7ad22e2d827cf",
    "R71b859702a11b90e6525d83267198aa7eb5b3b99",
    "R1d192c4aabe0ffe2cc75e459734bfe472a68157b",
    "Reee00fb49dc5be1311837854563d1df3e75d7436",
    "R856425a19b7a3b3bec3f2f07508a126b546cfb0d",
    "R9536a122387a1263f0a968948dc5e968addd6ef5",
    "R4fc6487b0989e79f343c89ea35a1eb9712570c36",
    "R1ab115e86514401b3fe647f4512a50fd9097d85a",
    "R67bddb7e762d7c770298713e04a6b0f39600a8bd",
    "R1c5c0b69f0e3aaa91d56b6d79e734957c479cc9c",
    "R2a5b9cac2e51f27d70f7797e82648de237fafc5c",
    "R5f356caa98ecb22c8baf81b1ebdbf0aa24e74c4a",
    "R3922bd1520b70343367cac677d1ff584bdf062f3",
    "Re551087f96d85213ed6051a8e372317a0b06c7a6",
    "R18888e135bf3610975c7815418c9063c3180ddbe",
    "R4e9bb2d31b85ea30fdfc49094adb8e8817d60a22",
    "R92b1f6c33a2c4dbf601c9116d5b662d709bbff5a",
    "R02dd478296897f15158c69e24a555bd76c6f46ba",
    "Rc6f2febcaa581e6cefec5a5d61d25f342337df2f",
    "R895694b01df4c2118081edc2624cd96454538840",
    "R3f619dadb67f19e805edfda798c0b13dd6cf75dc",
    "Rd1af9578f437522784628e629c8b94aefd956374",
    "R285a1fb6021e1275585e65461ff279d83c9ec1fa",
    "R7baed24ed5a690b9e5731ddc9568d6068da9a80e",
    "R31820b24baa1929816c5b46262bc9a973419cbff",
    "Rcad5f34d202c912d3fd656b48a92043382d84237",
    "Rbe9a4c0cc74c67df328788ae967936dde19be35e",
    "Rf2676a84610a0770e23a55926c0054ca24fc5126",
    "Rf15985756f573b190d2544c9f106b3f8927d96e6",
    "R28c233224c964d0fe5d82460fc6abd68a8090dd9",
    "R162c8d0750eed7a21eb88645c51b6d616112db35",
    "R2fdd09bb9788f38a1eed608a7d6acf8691b778b3",
    "R05346f7eda34dc5d78a8bc25dfe7fd5bdef8b109",
    "Rc4bb1f52c4984aeb28b922f6f14afc936aa8bcb5",
    "Rbd10eefa6fa75ef13c08da30ed7bad58d8e0ed72",
    "R9d798f2c3c1009ccabb50a07d6f915d59f1e8209",
    "R69bf04182810277218e73683af34dff21714e06b",
    "Ra628ca0d14ab0f205fcd2bed87dca25e076afc82",
    "R3782b910a0789ff340ee63c9a9a93ca4684d7d57",
    "R190da75b888c51c97abe23fcd11b2e913f432979",
    "Rd2ea2f1a4ede546bc5e17bc9aa2bd88ab73b8862",
    "R86747e6ecf9b0ae308d081b16a40ae9181e481bb",
    "R7fe4b36ab6b7bbb62b3915f65dee1e9bce29ec61",
    "Rcb17db275061a3c63193af8f72e6bc0040ed6271",
    "R7fe4b36ab6b7bbb62b3915f65dee1e9bce29ec61",
    "R9c2724cf41a4cded7291d81d610db9bcac725505",
    "Re6f036fea355ad556073fdb14176df8ad599036d",
    "R6ae78a54f5f76b7bcfae3f16e616fedb5d1e4a63",
    "R86c9b0759971883cc7a6b7eb94b5d74cf906353d",
    "Rf14f52a0f03d569f60fc76397366b123dd2ded66",
    "R5788c9aae2f9361742d6c34884dffa3b683173ec",
    "R5d2b5bc607b8a7127fac12e82315b665efdf7acd",
    "R329c3142cadd89b5aa80b5ed144c9c75c1d25e67",
    "R1949b9db0245ce0db5c8a462f0f0473f89933e55",
    "R92d765a9f4eb828ca962b8b0f37175693baedaa1",
    "R8dba268a8488ee19a41df343bfa7d77bdb50ea38",
    "R0f12072e5aa11994269ea57a11b8fef7813b1cf9",
    "R80aec7503ac08e58480379193caf8195d25f8455",
    "R9a2dddeb0cc9b8265af0fb9ef8abd264073f6ad3",
    "Re160282dadb2474174288e3e0338e49c5f0aefdc",
    "R6a4c3a249f5854a31f705fb8ed32d476b5832402",
    "Rf23d2b351c6a10ee28b31cde621319c276249b58",
    "R4693c69587577e8f4aa9c5fb7192f921c825b45b",
    "R9fcbfb283e8a56135c8f0987cfd1a404e082519a",
    "R23e11ad413144087bd42432fcd86f88604f52970",
    "R354f1e0ac62346a0da2ff1833e188fa269755521",
    "R7ae6cb27a654d83d4bcb1a824459859910fe62ef",
    "R5ba8fa4b8a215e81634876b17320e5aa796a5e30",
    "R75280de2e50b215fb81ca8e83015f7cc2d5e1d22",
    "R69a98728861f6ffbce31b6b6a9f3b5c876fa8b80",
    "R94fa6bef5a75ee12bb6f395a291e58066fe1a1a8",
    "R3bf14013864b0de1b2d897bc0a3a22312fed8441",
    "Rf37ec9d8bb80663aa73a3aa43b599d0b255170e7",
    "R31b068edf5e2aa9b0cc5256b3215871330e381e9",
    "R82bd59c159d5c089279c5717ce2936831b08981c",
    "R7baed24ed5a690b9e5731ddc9568d6068da9a80e",
    "Rbb63477bbd2c7fda5408a19f4f1e135b7868527a",
    "Rb44869d26147856b1fa1a5b1c45b651d6ce3ac13",
    "Rd5e8a8aef5b0fb2c3c3a6578ee082f40c7efe607",
    "R9b5536ca5c2c273e7eccd518b638351faa122977",
    "Rc375a00a0e30bb630065e18a58c19061997849ca",
    "R147f12945364c2250ae36d907d2cf7fffc448b67",
    "R1434f9ab2e402ed5aec909e85dff01c59e24198b",
    "R285f8849a8218e3f21ac575f9ee1471ad2e3dfdf",
    "R21e486507eba4c2248742a799c0d19188d179a6e",
    "R655fc672ae701f52c7ae83455aa80dc400b32f5e",
    "R7041cda7c87435e34e4efa4fa1830a125530b52e",
    "R8013510db8be01acf23f76563e08de72e1d7bf20",
    "R4b2a069b3bb853495350fb492f51578e70e3b947",
    "Rf7b5ddde1f9a34fcf7998e362bb475d4b84565a3",
    "R6ed983184413869af94a695a7b37064fca48b7a2",
    "R23665f69af5875a928a55e9e8efd79b83d874439",
    "R6443f2a4d3a23d705bacad1c2240c0333e5d8c8c",
    "R9d349f5035a1715b5b8cd5fabcd1a17bccf93c53",
    "Re2b3064950b138610aeed3390e26a700a9a8bf36",
    "Rc11862be0133636f4ba81228df43175729adb945",
    "R946d09d63ce9d69d6d09fda2cde433d370fe821c",
    "Rcee670412dfe6ae7f17e2ac0693874741ad2215f",
    "R7a054c7ea406c12c9c476702dbb953a9758ddd49",
    "R3f786519c2f9bf484c5daf896bb97b9384e84b56",
    "Rc9f116d338c1f3ac0352acc3e8ad20b92cf3e42b",
    "Ra8e2049ef49d5b1bd931caa874419bfd962d785d",
    "Rb1878dc656b9d7d4befddf5a3260896508b89110",
    "Re29ff0f0d28868b3b4a88aebe4f14c45c99fe688",
    "R3a2f05f26a488887e3354674e463727683e36dd2",
    "R8050381c7d6e056f534e40e460c26971688eebf3",
    "Rbcf8690a6117a2f1b505fa347e4b0f836c8ba077",
    "Rb4bc9600efed02ca72d1d09723cf70b9c117c730",
    "R85a8be2991f580c8fb0a3cdb58a5dd15d0027457",
    "R49f90071f5258cb0af147d2c83461a290e4d7a73",
    "Rd9f257fe76bf93d2b0ae6e3fc799b230182a246b",
    "R962e9c6422d6a8b564330ed93fe291ff67b0a35b",
    "Rcad5f34d202c912d3fd656b48a92043382d84237",
    "R2c65d93bef2824ac68f3637ef3d372a189e127d7",
    "Rc48f3b0f9bbc38dee913acb491b82befe353572b",
    "R26167799fb2555b9d0b1f46f29195c1ecb020f98",
    "R509475d4deef2da594aad681a74d954cc045e032",
    "R2d77cee078bc25aa1b53895ae1972e51d879ba36",
    "R47d46dd835f712e2dfbf78672c0419c5c390c087",
    "Rad073f3729e57f0911295878363c401024278506",
    "R563360e4165c7bdd840b2320e3c7abfdbe28f194",
    "R959555aa53f43f8c1b622eac78550b8d367a341e",
    "Rca042d19d21512a5e8c0a307e1d88cf0253f304d",
    "R48927814e81845bc1b216555a5741cc2e3ad81a3",
    "Rca7ad9a71cb445e401f647b117b6730d8fb51ce5",
    "R6f43b3883f3cf2ce9c9e2fd59b87c39dad14aef0",
    "R6d0a99acf6a8cae3eb1a4681509bf0d69ad684d7",
    "R0ec73c9f6812a2ad6ed3e76ee39af6269e9d555d",
    "R184f1984716d9d1ede4507ece457ea58614a6b78"
];