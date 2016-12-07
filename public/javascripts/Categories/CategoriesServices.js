/**
 * Created by nickdestefano on 6/23/15.
 */
var app = angular.module('CategoriesService', []);

app.factory('categories', function($http, auth){
    var o = {
        categories: []
    };

    o.getAll = function() {
        return $http.get('/categories').success(function(data){
            angular.copy(data, o.categories);
        });
    };

    return o;
});