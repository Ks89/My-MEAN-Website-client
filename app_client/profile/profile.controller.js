(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', '$routeParams','authentication', '$window', '$log', '$scope'];
  function profileCtrl($location, $routeParams, authentication, $window, $log, $scope) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      content: "Profile page"
    };
    vm.message = "Profile page";

    vm.local = {
      name: '',
      email: ''
    };

    vm.currentPath = $location.path();

    //----------------------------------------------------------
    //--------------------------3dauth--------------------------
    //----------------------------------------------------------
    //init
    vm.github = buildJsonUserData();
    vm.google = buildJsonUserData();
    vm.facebook = buildJsonUserData();
    vm.twitter = buildJsonUserData();
    vm.linkedin = buildJsonUserData();
    //connect REST path
    vm.facebookConnectOauthUrl = 'api/connect/facebook';
    vm.googleConnectOauthUrl = 'api/connect/google';
    vm.githubConnectOauthUrl = 'api/connect/github';
    vm.twitterConnectOauthUrl = 'api/connect/twitter';
    vm.linkedinConnectOauthUrl = 'api/connect/linkedin';
  
    //3dparty authentication
    authentication.getLoggedUser()
    .then(function(data) {
      $log.info("Profile called getLoggedUser");
      if(data) {
        console.log(data);
        console.log("Profile called data valid");
        var user = JSON.parse(data);
        console.log("Profile called getLoggedUser user parsed");
        console.log(user);
        if(user) {
          console.log("setting data.........................");
          setObjectValuesLocal(user.local, vm.local);
          setObjectValues(user.github, vm.github);
          setObjectValues(user.facebook, vm.facebook);
          setObjectValues(user.google, vm.google);
          setObjectValues(user.twitter, vm.twitter);
          setObjectValues(user.linkedin, vm.linkedin);
          console.log("---------------setted----------------");
        }
      } else {
        console.log("Profile called getLoggedUser but data was null");
      }
    }, function(error){
      console.log(error);
    });

    //TODO add linkedin e twitter
    // vm.twitterUnlinkOauthUrl = 'api/unlink/twitter';
    // vm.linkedinUnlinkOauthUrl = 'api/unlink/linkedin';
    vm.unlink3dAuth = function(serviceName) {
      console.log("unlink3dAuth " + serviceName + " called");
      if(checkIfLastUnlinkProfile(serviceName)) {
        console.log('Last unlink - processing...');
        authentication.unlink3dAuth(serviceName)
        .then(function(result) {
          console.log('Unlinked: ' + result);
          authentication.logout()
          .then(function(result) {
            console.log('Logged out: ' + result);
            $location.path('/home');
          },function(reason) {
            console.log('Impossibile to logout: ' + reason);
            $location.path('/home');
          });
        },function(reason) {
          console.log('Impossibile to unlink: ' + reason);
        });
      } else {
        console.log('NOT last unlink - checking...');
        if(serviceName==='facebook' || serviceName==='google' || serviceName==='github') {
          console.log('NOT last unlink - but service recognized, processing...');
          authentication.unlink3dAuth(serviceName)
            .then(function(result) {
              console.log(serviceName + ' Unlinked: ' + result);
              $location.url('/profile');
            },function(reason) {
              console.log('Impossibile to unlink: ' + reason);
            });
        } else {
          console.error("Unknown service. Abroting operation!");
        }
      }
    };

    function buildJsonUserData() {
      return {
        id : '',
        email : '',
        name : '',
        token : '',
      };
    }
    function setObjectValues(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.name;
        destData.token = originData.token;
      }
    }
    function setObjectValuesLocal(originData, destData) {
      if(originData) {
        destData.email = originData.email;
        destData.name = originData.name;
      }
    }

    function checkIfLastUnlinkProfile(serviceName) {
      switch(serviceName) {
        case 'github':
          return vm.facebook.name==='' && vm.google.name==='' && vm.local.name==='';
        case 'google':
          return vm.github.name==='' && vm.facebook.name==='' && vm.local.name==='';
        case 'facebook':
          return vm.github.name==='' && vm.google.name==='' && vm.local.name==='';
        case 'local':
          return vm.github.name==='' && vm.facebook.name==='' && vm.google.name==='';
        default:
          console.log('Service name not recognized in profile checkIfLastUnlink');
          return false;
      }
    }

    //----------------------------------------------------------
    //------------------------local auth------------------------
    //----------------------------------------------------------
    vm.unlinkLocal = function() {
      //TODO check if there are other account. If not, call also logout!!!
      authentication.unlinkLocal()
      .then(function(data) {
        console.log('unlinklocal finished ');
        vm.local = {
          name: '',
          email: ''
        };
        //redirect to profile page
        $location.url('/profile');
      }, function(reason) {
        console.log('unlinkLocal failed: ' + reason);
      });
    };
  }
})();