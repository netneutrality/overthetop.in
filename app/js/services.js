'use strict';

/* Services */

var ottappServices = angular.module('ottapp.services', ['elasticsearch', 'ngResource']);

ottappServices.service('esClient', function (esFactory){
    return esFactory({
        host: 'dell-per720-1.swcert.cee.pnq.redhat.com:9200',
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
        getDomainReportParams: function(index, target) {
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
        },
        getDomains: function(res) {
            for (var i=0; i < res.aggregations.domains.buckets.length; i++) {
                res.aggregations.domains.buckets[i].id = i;
            }
            return res.aggregations.domains.buckets;
        }
    }
    return esResult;
});

