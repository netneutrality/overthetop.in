'use strict';

/* Services */

var ottappServices = angular.module('ottapp.services', ['elasticsearch', 'ngResource']);

ottappServices.service('esClient', function (esFactory){
    return esFactory({
        host: 'https://www.overthetop.in/api',
        apiVersion: '1.5',
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
                query_cache: true,
                q: '_id:' + id
            };
            return q;
        },
        getDomainParams: function(index, target) {
            var q = {
                index: index,
                type: target,
                query_cache: true,
                search_type: 'count',
                body: {
                    aggs: {
                        domains: {
                            terms: {
                                field: "from_domain",
                                size: 20000
                            }
                        }
                    }
                }
            };
            return q;
        },
        getDomainListParams: function(index, target, id) {
            var q = {
                index: index,
                size: 10000,
                type: target,
                query_cache: true,
                body: {
                    _source: {
                        include: ['from_name', 'subject', 'date', 'size', 'campaigns']
                    },
                    query: {
                        filtered: {
                            filter: {
                                term: { from_domain: id}
                            }
                        }
                    }
                }
            };
            return q;
        },
        
    }
    return esQuery;
});

ottappServices.factory('esResultBuilder', function(){
    var esResult = {
        getContent: function(res) {
            return res.hits.hits[0];
        },
        getDomains: function(res) {
            for (var i=0; i < res.aggregations.domains.buckets.length; i++) {
                res.aggregations.domains.buckets[i].id = i;
            }
            return res.aggregations.domains.buckets;
        },
        getDomainList: function(res) {
            var responses = [];
            for (var i = 0; i < res.hits.hits.length; i++) {
                var response = res.hits.hits[i]._source;
                response._id = res.hits.hits[i]._id;
                response.idx = i;
                responses.push(response);
            }
            return responses;
        }
    }
    return esResult;
});

