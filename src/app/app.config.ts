import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCQoSO9plS_0DB5y86SaYriXOcPCFP1GN0',
        authDomain: 'beehive-behave.firebaseapp.com',
        databaseURL:
          'https://beehive-behave-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'beehive-behave',
        storageBucket: 'beehive-behave.firebasestorage.app',
        messagingSenderId: '1073595724091',
        appId: '1:1073595724091:web:d2c678937d438a1255871e',
        measurementId: 'G-9XDF2BX3T2',
      }),
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    // provideAppCheck(() => {
    //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    //   const provider =
    //     new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
    //   return initializeAppCheck(undefined, {
    //     provider,
    //     isTokenAutoRefreshEnabled: true,
    //   });
    // }),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
  ],
};
