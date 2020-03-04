

function mineDatabaseServices(base_url, auth, auth_cb) {

    this.base_url = base_url;

    var _auth = auth ? auth : { 'token' : '', 'user_id' : ''};
    var _auth_cb = auth_cb;

    this.model_search = function (query, _callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "model-search/q=" + query, [], 1, _callback, _errorCallback);
};

    this.quick_search = function (db, query, _callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "quick-search/" + db + "/q=" + query, [], 1, _callback, _errorCallback);
};
    this.similarity_search = function (db, comp_structure, min_tc, limit, parent_filter, _callback, _errorCallback) {
        params = JSON.stringify({'mol': comp_structure, 'model': parent_filter})
        return json_call_ajax("POST", this.base_url + "similarity-search/" + db + "/" + min_tc + "/" + limit, params, 1, _callback, _errorCallback);
};

    this.structure_search = function (db, comp_structure, parent_filter, _callback, _errorCallback) {
        params = JSON.stringify({'mol': comp_structure, 'model': parent_filter})
        return json_call_ajax("POST", this.base_url + "structure-search/" + db, params, 1, _callback, _errorCallback);
};

    this.substructure_search = function (db, substructure, limit, parent_filter, _callback, _errorCallback) {
        params = JSON.stringify({'mol': substructure, 'model': parent_filter})
        return json_call_ajax("POST", this.base_url + "substructure-search/" + db + "/" + limit, params, 1, _callback, _errorCallback);
};

    this.database_query = function (db, mongo_query, parent_filter, reaction_filter, _callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "database-query/" + db + "/q=" + mongo_query, [], 1, _callback, _errorCallback);
};

    this.get_ids = function (db, collection, query, _callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "get-ids/" + db + "/" + collection + "/q=" + query, [], 1, _callback, _errorCallback);
};

    this.get_comps = function (db, ids, _callback, _errorCallback) {
        params = JSON.stringify({'id_list': ids})
        return json_call_ajax("POST", this.base_url + "get-comps/" + db, params, 1, _callback, _errorCallback);
};

    this.get_rxns = function (db, ids, _callback, _errorCallback) {
        params = JSON.stringify({'id_list': ids})
        return json_call_ajax("POST", this.base_url + "get-rxns/" + db, params, 1, _callback, _errorCallback);
};

    this.get_ops = function (db, operator_names, _callback, _errorCallback) {
        params = JSON.stringify({'id_list': operator_names})
        return json_call_ajax("POST", this.base_url + "get-ops/" + db, params, 1, _callback, _errorCallback);
};

    this.get_operator = function (db, operator_name, _callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "get-op-w-rxns/" + db + "/" + operator_name, [], 1, _callback, _errorCallback);
};

    this.get_adducts = function (_callback, _errorCallback) {
        return json_call_ajax("GET", this.base_url + "get-adduct-names", [], 1, _callback, _errorCallback);
};

    this.ms_adduct_search = function (db, text, text_type, ms_params, _callback, _errorCallback) {
        var text_params = {"text": text, "text_type": text_type}
        var params = Object.assign({}, text_params, ms_params)
        params = JSON.stringify(params)
        return json_call_ajax("POST", this.base_url + "ms-adduct-search/" + db, params, 1, _callback, _errorCallback);
};

    this.ms2_search = function (db, text, text_type, ms_params, _callback, _errorCallback) {
        var text_params = {"text": text, "text_type": text_type}
        var params = Object.assign({}, text_params, ms_params)
        params = JSON.stringify(params)
        return json_call_ajax("POST", this.base_url + "ms2-search/" + db, params, 1, _callback, _errorCallback);
};

    /*
     * JSON call using jQuery method.
     */
    function json_call_ajax(http_method, url, params, numRets, callback, errorCallback) {
        var deferred = $.Deferred();

        if (typeof callback === 'function') {
           deferred.done(callback);
        }

        if (typeof errorCallback === 'function') {
           deferred.fail(errorCallback);
        }

        var beforeSend = null;
        var token = (_auth_cb && typeof _auth_cb === 'function') ? _auth_cb()
            : (_auth.token ? _auth.token : null);
        if (token != null) {
            beforeSend = function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            }
        }

        var xhr = jQuery.ajax({
            url: url,
            contentType: "application/json",
            dataType: "json",
            type: http_method,
            processData: false,
            data: params,
            beforeSend: beforeSend,
            success: function (data, status, xhr) {
                var result;
                try {
                    var result = data;
                } catch (err) {
                    deferred.reject({
                        status: 503,
                        error: err,
                        url: url,
                        resp: data
                    });
                    return;
                }
                deferred.resolve(result);
            },
            error: function (xhr, textStatus, errorThrown) {
                var error;
                if (xhr.responseText) {
                    try {
                        var resp = JSON.parse(xhr.responseText);
                        error = resp.error;
                    } catch (err) { // Not JSON
                        error = "Unknown error - " + xhr.responseText;
                    }
                } else {
                    error = "Unknown Error";
                }
                deferred.reject({
                    status: 500,
                    error: error
                });
            }
        });

        var promise = deferred.promise();
        promise.xhr = xhr;
        return promise;
    }
}


