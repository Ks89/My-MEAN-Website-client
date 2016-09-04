System.config({
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true,
    module: 'system'
  },
  map: {
    'app'     : 'app',
    'rxjs'    : 'node_modules/rxjs',
    '@angular': 'node_modules/@angular',
    'angular2-recaptcha': 'node_modules/angular2-recaptcha',
    'angular2-image-popup': 'node_modules/angular2-image-popup',
    //angular2-component-outlet-modified: modified by myself to be able to use templateUrl instead of template
    'angular2-component-outlet-modified': 'app/angular2-component-outlet-modified',
    'h5webstorage': 'node_modules/h5webstorage',
    'ng2-simple-page-scroll': 'node_modules/ng2-simple-page-scroll',
    '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap',
    'angular2-ladda':             'node_modules/angular2-ladda',
    'ladda':                      'node_modules/ladda/js',
    'spin':                       'node_modules/ladda/js/spin.js',
  },
  paths: {
    'node_modules/@angular/*': 'node_modules/@angular/*/bundles',
    "@ng-bootstrap/ng-bootstrap": "node_modules/@ng-bootstrap/ng-bootstrap",
  },
  meta: {
    '@angular/*': {'format': 'cjs'},
    '@ng-bootstrap/ng-bootstrap/*': {'format': 'cjs'},
  },
  packages: {
    'app'                                : {main: 'main', defaultExtension: 'ts'},
    'rxjs'                               : {main: 'index'},
    '@angular/http'                      : {main: 'http.umd.min.js'},
    '@angular/common'                    : {main: 'common.umd.min.js'},
    '@angular/compiler'                  : {main: 'compiler.umd.min.js'},
    '@angular/core'                      : {main: 'core.umd.min.js'},
    '@angular/forms'                     : {main: 'forms.umd.min.js'},
    '@angular/platform-browser'          : {main: 'platform-browser.umd.min.js'},
    '@angular/platform-browser-dynamic'  : {main: 'platform-browser-dynamic.umd.min.js'},
    '@angular/router'                    : {main: 'router.umd.min.js'},
    'angular2-recaptcha'                 : {defaultExtension: 'ts'},
    'angular2-image-popup'               : {main: 'app/main', defaultExtension: 'ts'},
    'angular2-component-outlet-modified' : {main: 'index.js'},
    'h5webstorage'                       : {main: 'index.js', defaultExtension: 'js'},
    'ng2-simple-page-scroll'             : {main: 'ng2-simple-page-scroll', defaultExtension: 'ts'},
    '@ng-bootstrap/ng-bootstrap'         : {main: 'index.js'},
    'angular2-ladda'                     : {main: 'index.js', defaultExtension: 'js'},
    'ladda'                              : {main: 'ladda.js', defaultExtension: 'js'}
  }
});
