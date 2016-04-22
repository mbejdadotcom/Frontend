angular.module('firebase.config', [])
  .constant('FBURL', 'https://alyzio.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','github'])

  .constant('loginRedirectPath', '/login');
