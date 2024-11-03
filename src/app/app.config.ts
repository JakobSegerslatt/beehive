import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'beehive-behave',
        appId: '1:1073595724091:web:9e82bd49097fb36055871e',
        databaseURL:
          'https://beehive-behave-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'beehive-behave.appspot.com',
        apiKey: 'AIzaSyCQoSO9plS_0DB5y86SaYriXOcPCFP1GN0',
        authDomain: 'beehive-behave.firebaseapp.com',
        messagingSenderId: '1073595724091',
        measurementId: 'G-02KX4TWZ6S',
      })
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
