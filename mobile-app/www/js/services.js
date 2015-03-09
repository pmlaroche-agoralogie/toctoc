angular.module('starter.services', [])

.factory('Questions', function($http) {
	return {
		all: function(query) {
			return $http.get('http://wiw.io/ICM/services/index.php/questions/'+query.sid)
		}
	};
})

.factory('Charts', function($http) {
	return {
		all: function(query) {
			console.log('http://wiw.io/ICM/services/index.php/data/'+query.sid+'/'+query.in+'/'+query.out);
			return $http.get('http://wiw.io/ICM/services/index.php/data/'+query.sid+'/'+query.in+'/'+query.out)
		}
	};
});
