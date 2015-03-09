angular.module('starter.controllers', [])

.controller('ChartsCtrl', function($scope, Questions, Charts, $ionicModal) {
	var sid = 236551;
	moment.locale('fr');
	var curs = moment('2015-01-01');
	var period = "2-month";
	
	var grid = [],
		labels = [];
	if (period == 'weeks') {
		var _in = moment(curs).startOf('isoWeek');
		var _out = moment(curs).endOf('isoWeek');
		var d = moment(_in);
		labels = ['L','M','Me','J','V','S','D'];
		while(d.unix() < _out.unix()) {
			grid.push(d.format('YYYY-MM-DD'));
			d = d.add(1, 'days');
		}
	} else if (period == '1-month') {
		var _in = moment(curs).startOf('month');
		var _out = moment(curs).endOf('month');
		var d = moment(_in);
		while(d.unix() < _out.unix()) {
			grid.push(d.format('YYYY-MM-DD'));
			labels.push((d.format('e')=='0')?d.format('dd D'):'');
			d = d.add(1, 'days');
		}
	} else if (period == '2-month') {
		var _in = moment(curs).startOf('month').subtract('months',1);
		var _out = moment(curs).endOf('month');
		var d = moment(_in);
		while(d.unix() < _out.unix()) {
			grid.push(d.format('YYYY-MM-DD'));
			labels.push((d.format('e')=='0')?d.format('dd D'):'');
			d = d.add(1, 'days');
		}
	} else if (period == '3-month') {
		var _in = moment(curs).startOf('month').subtract('months',2);
		var _out = moment(curs).endOf('month');
		var d = moment(_in);
		while(d.unix() < _out.unix()) {
			grid.push(d.format('YYYY-MM-DD'));
			labels.push((d.format('e')=='0')?d.format('dd D'):'');
			d = d.add(1, 'days');
		}
	}
	
	Questions.all({sid:sid}).then(function(response) {
		var q = [];
		angular.forEach(response.data, function(row) {
			if (row.question != "systemuid") {
				q.push({
					label: row.question.replace(/(<([^>]+)>)/ig,"").replace(/\&nbsp;/ig," ").trim(),
					key: sid+'X'+row.gid+'X'+row.qid
				});
			}
		});
		q.push(q.shift()); // first and second at the end (demo)
		q.push(q.shift());
		$scope.questions = q;
		Charts.all({sid:sid,in:_in.format('YYYY-MM-DD'),out:_out.format('YYYY-MM-DD')}).then(function(response) {
			q.forEach(function(question,i) {
				var el = document.getElementById('chart-'+question.key);
				if (el) {
					var data = {};
					grid.forEach(function(date) {
						data[date] = null;
					});
					response.data.forEach(function(row) {
						if (row[question.key]) {
							data[row['submitdate'].substr(0,10)] = row[question.key];
						}
					});
					new Chart(el.getContext("2d")).Bar({
						labels: labels,
						datasets: [
							{
								fillColor: "#157EFB",
								strokeColor: "#ffffff",
								barStrokeWidth: 1,
								barShowStroke : false,
								barValueSpacing : 1,
								data:data
							}
						]
					}, {
						animation:(i<3)
					});
				}
			});
			$scope.charts = response.data;
		});
	});
	$ionicModal.fromTemplateUrl('templates/charts-share.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.share = function() {
			$scope.modal.show();
		};
		$scope.closeshare = function() {
			$scope.modal.hide();
		};
	});
})

.controller('ChartDetailCtrl', function($scope, $stateParams, Charts) {
  $scope.chart = Charts.get($stateParams.chartId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('SurveyCtrl', function($scope) {
})

.controller('NavBarCtrl', function($scope) {
  $scope.share = function() {
    alert('share');
  }
});
