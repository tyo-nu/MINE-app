// This file contains steps for all website tours
var generalTour = function(){
    var host = window.location.href.split('#')[0];
    return {
        storage:false,
        steps: [
            {

                orphan: true,
                title: "Exploring the MINE Databases",
                content: "Welcome to the home of the MINE databases. This tour will give you an overview of the features of this " +
                    "website and help you find the data you are looking for. You can advance this tour with the arrow keys."
            },
            {
                onShow: function(){window.location.assign(host+ '#/structure');},
                element: "#struct-tab",
                placement: "bottom",
                title: "Use structure search",
                content: "There are a number of structural search features available here."
            },
            {
                element: "#canvas",
                title: "Chemical Canvas",
                content: "You can draw a chemical structure here."
            },
            {
                element: "#search-options",
                placement: "left",
                title: "Search Options",
                content: "You can search for compounds with similar functional groups, with common substructure, or " +
                    "with exact matches to your compound."
            },
            {
                onShown: function(){window.location.assign(host+ '#/structure');},
                element: "#sim-thresh",
                placement: "left",
                title: "Similarity Threshold",
                content: "This allows you to set a minimum Tanimoto similarity (using RDKit fingerprints).",
                onNext: function(){
                    window.location.assign(host+ '#/acompound-32182/overview')
                }
            },
            {
                element: "#db-select",
                placement: "bottom",
                title: "Change the source database",
                content: "You can switch between the MINE source databases here at any time."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompound-32182/overview');},
                element: "#comp-row",
                placement: "left",
                reflex: true,
                title: "Go to the compound page",
                content: "Once you have found an interesting compound, click on the row to see more details."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompound-32182/overview');},
                orphan: true,
                title: "Compound Data page",
                content: "This page displays any data available for a MINE compound."
            },
            {
                element: "#db-links",
                placement: "left",
                title: "Find more information about a compound",
                content: "Click the header of any of these sections to see their contents. You can find the compound in other " +
                    "databases in various chiral and charged forms."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompound-32182/reactants')},
                element: "#reactions",
                title: "Explore reactions that involve this compound",
                content: "See all the predicted reactions that produce or consume this compound."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompound-32182/reactants');},
                element: "#rxn-img",
                placement: "left",
                title: "Examine computationally predicted derivatives",
                content: "Mouse over a structure to display its name and MINE ID. Click to go to that compound's info page."
            },
            {
                orphan: true,
                title: "Learning more",
                content: "If you have additional questions, please check out our Frequently Asked Questions. You might also be " +
                    "interested in taking our Metabolomics tour. We hope you find this resource valuable!"
            }
        ]
    }
};

var metabolomicsTour = function(){
    var host = window.location.href.split('#')[0];
    return {
        storage:false,
        steps: [
            {
                orphan: true,
                title: "Annotating MS/MS data with MINEs",
                content: "Welcome to the home of the MINE databases. This tour will give you an overview of using the MINE " +
                    "databases to annotate high resolution metabolomics data. You can advance this tour with the arrow keys."
            },
            {
                element: "#met-tab",
                placement: "bottom",
                title: "The Metabolomics tab",
                content: "The metabolomics annotation tools are available here.",
                onNext: function(){
                    window.location.assign(host+ '#/msAdductSearch');
                }
            },
            {
                element: "#db-select",
                placement: "bottom",
                title: "Change the source database",
                content: "You can switch between the MINE source databases here any time."
            },
            {
                element: "#models_text",
                placement: "right",
                title: "Selecting a Genome Reconstruction",
                content: "Type in a KEGG genome id to search for a reconstruction (e.g. 'eco' for E. coli). Click a name in " +
                    "the box below to set the reconstruction as the standard for native metabolites."
            },
            {
                element: "#trace",
                title: "Enter M/Z values",
                content: "Type or paste mass/charge ratios here, one per line."
            },
            {
                element: "#pos-radio",
                placement: "left",
                title: "Select ion mode",
                content: "Select an ion charge to change the list of available adduct types."
            },
            {
                element: "#adducts",
                placement: "left",
                title: "Select adducts to search on",
                content: "You can select potential adduct types here. Use CTRL+click to select individual adducts or " +
                    "SHIFT+click to select a range of compounds.",
                onShown:function(){
                    $('#adducts option:eq(1)').prop('selected', true).trigger('change');
                },
            },
            {
                element: "#tolerance",
                placement: "left",
                title: "Set the mass tolerance",
                content: "You can adjust the mass range and units (mDa or ppm) for all your results."
            },
            {
                element: "#logPForm",
                placement: "left",
                title: "Set allowed ranges for predicted logP",
                content: "You can also adjust the allowed range of predicted logP values for MINE compounds."
            },
            {
                element: "#halogen",
                placement: "left",
                title: "Toggle the presence of halogenated compounds",
                content: "KEGG has a number of non-natural halogenated compounds. If checked, these will be included in" +
                    " search results.",
                onNext: function(){
                    $('#ms-search-button').trigger('click');
                }
            },
            
            

            {
                orphan: true,
                title: "Tabular Metabolomics Results",
                content: "This page displays information for all compounds which match your search criteria. Compounds " +
                    "that appear in or can be produced from a selected KEGG Genome Reconstruction (see left dropdown search) are highlighted."
            },
            {
                element: "#filters",
                placement: "bottom",
                title: "Filtering results",
                content: "You can enter text here to filter the results shown."
            },
            {
                element: "#met-img",
                title: "Getting more information",
                content: "Click the compound image to see the compound's full entry."
            },
            {
                element: "#met-download",
                placement: "bottom",
                title: "Download your search results",
                content: "Click here to download a CSV file with your search results. This file can be opened with " +
                    "Microsoft Excel or parsed as a part of an annotation pipeline.",
                onNext: function(){
                    window.location.assign(host+ '#/ms2search');
                }
            },
            {
                orphan: true,
                title: "MS/MS searching",
                content: "The MS/MS searching options are similar to the the those for a single mass but the form only " +
                "supports one search at a time using these text boxes."
            },
            {
                element: "#msmsIons",
                title: "Product Ions",
                content: "Enter each product ion on a new line as a pair of m/z and intensity separated by a single space."
            },
            {
                element: "#upload-file",
                title: "File upload",
                content: "If you would like to search multiple features this is possible by uploading a file in MGF or " +
                "MSP format. Be mindful that large files take a longer to search. You can also take a look at our REST API for large searches."
            },
            {
                element: "#energy",
                placement: "left",
                title: "Scoring options",
                content: "Product ions are simulated using the Competitive Fragmentation Modeling approach. you can " +
                "adjust the fragmentation energy and the method used to calculate MS2 spectra similarity scores here."
            },
            {
                orphan: true,
                title: "Learning more",
                content: "If you have additional questions, please check out our Frequently Asked Questions. You might also be " +
                    "interested in taking our General tour. We hope you find this resource valuable!"
            }
        ]
    }
};