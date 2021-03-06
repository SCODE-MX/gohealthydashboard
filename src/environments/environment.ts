// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCEO3194FbhWkkw3pOrGdbRCs1YknGMcJo',
    authDomain: 'gohealthy-84b4c.firebaseapp.com',
    databaseURL: 'https://gohealthy-84b4c.firebaseio.com',
    projectId: 'gohealthy-84b4c',
    storageBucket: 'gohealthy-84b4c.appspot.com',
    messagingSenderId: '1069867771545',
    appId: '1:1069867771545:web:7c3791b21b5eae82'
  },
  stripe: {
    key: 'pk_test_e3seNsumyGCb2APHEY4WLNZm00kNN3Emin'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
