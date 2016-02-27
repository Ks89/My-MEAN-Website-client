(function () {

  angular
    .module('mySiteApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location','authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in'
    };

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.facebookOauthUrl = 'api/auth/facebook';
    vm.googleOauthUrl = 'api/auth/google';
    vm.githubOauthUrl = 'api/auth/github';

    //vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doLogin();
      }
    };

    vm.doLogin = function() {
      vm.formError = "";
      authentication.login(vm.credentials)
      .then(function(){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        //redirect to profile page
        $location.url('/profile');
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
      })
      .error(function(err){
        vm.formError = err;
      });
    };
  }
})();