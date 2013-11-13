function VotingCtrl($scope, $http, $templateCache) {
    $scope.topics = [];

    $scope.get_all_topics = function(){
        $http.get('/topics').success(function(data, status){
            if (data){
                $scope.topics = data;
            }
        });
    }

    $scope.addTopic = function(){
        var topic = {'name': $scope.new_topic}
        $http.post('/topics/', topic).success(function(data, status){
            $scope.get_all_topics();
            $scope.new_topic = "";
        })
    };

    $scope.like = function(id){
        var vote = {'id': id, }
        $http.post('/vote/', vote).success(function(data, status){
            $scope.update_voted_topics(id)
            $scope.get_all_topics();
        })
    }

    $scope.update_voted_topics = function(id){
        if(!$scope.voted_topics){
            $scope.voted_topics = [];
        }
        $scope.voted_topics.push(id);
        var cookie_value = JSON.stringify($scope.voted_topics);
        setCookie('voted_topics', cookie_value, 900000)
    }

    $scope.check_voted = function(id){
        if($scope.voted_topics){
            return $scope.voted_topics.indexOf(id) == -1;
        }

        return true;
    }

    $scope.read_cookie = function(){
        var cookie = getCookie('voted_topics')
        if(cookie){
            return JSON.parse(cookie);
        }
        return [];
    }

    $scope.get_all_topics();
    $scope.voted_topics = $scope.read_cookie();

};



/**
 * AngularJS module initialisation
 *  - sets the template notation to {[]} to not conflict with the django template notation
 *  - renames the header and cookie name to meet the change csrf implementation
 */
angular.module('voting', []).config(function($interpolateProvider, $httpProvider){
        // change angular notation symbol to not conflict django template language
        $interpolateProvider.startSymbol('{[').endSymbol(']}');

        // django csrf implementation compatibility
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        // django is_ajax() compatibility
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Use x-www-form-urlencoded tontent-type, so django will recognize data and render it to request.POST
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Override $http service's default transformRequest
        // to enable ajax request to pass the object instead of a serialized version (e.g. jQuery('form').serialize())
        $httpProvider.defaults.transformRequest = [function(data)
        {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj)
            {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for(name in obj)
                {
                    value = obj[name];

                    if(value instanceof Array)
                    {
                        for(i=0; i<value.length; ++i)
                        {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value instanceof Object)
                    {
                        for(subName in value)
                        {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value !== undefined && value !== null)
                    {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }
);


// cookie handling js <see http://www.w3schools.com/js/js_cookies.asp>
function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}