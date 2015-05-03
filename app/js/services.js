'use strict';

/* Services */

var ottappServices = angular.module('ottapp.services', ['elasticsearch', 'ngResource']);

ottappServices.service('esClient', function (esFactory){
    return esFactory({
        host: 'https://www.overthetop.in/api',
        apiVersion: '1.3',
        log: 'trace',
        size: 100,
    });
});

ottappServices.factory('esQueryBuilder', function(){
    var esQuery = {
        getSearchQuery: function(name, email, content) {
            var q = [];
            if (name != undefined && name != '')   q.push({ match: { from_name: {query: name, operator: 'and'} } });
            if (email != undefined && email != '') q.push({ term: { from_hash: CryptoJS.SHA1(email).toString()} });
            if (content != undefined && content != '') {
                q.push({
                    match: {
                        text: {
                            query: content,
                            operator: 'and',
                            minimum_should_match: '90%'
                        }
                    }
                });
            }
            return q;
        },
        getDocumentQueryParams: function(index, target, id) {
            var q = {
                    index: index,
                    size: 1,
                    type: target,
                    q: '_id:' + id
                };
            return q;
        },
    }
    return esQuery;
});

ottappServices.factory('esResultBuilder', function(){
    var esResult = {
        getContent: function(res) {
            var d = res.hits.hits[0];
            for (var i = 1; i < res.hits.hits.length; i++)
            {
                var hit = res.hits.hits[i];
                d._source.content += hit._source.content.replace('<', '&lt;');
            }
            return d;
        }
    }
    return esResult;
});

