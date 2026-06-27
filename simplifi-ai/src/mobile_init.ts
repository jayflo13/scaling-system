import { PushNotifications } from '@capacitor/push-notifications';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const initMobileFeatures = async () => {
  if (Capacitor.isNativePlatform()) {
    console.log('Initializing mobile-specific features...');

    // 1. Push Notifications
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
    }

    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send token to Simplifi AI backend
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // 2. OAuth helper (example)
    // To be used instead of window.location.href during login
    const openOAuthBrowser = async (url: string) => {
      await Browser.open({ url });
    };

    return { openOAuthBrowser };
  }
  
  return null;
};
