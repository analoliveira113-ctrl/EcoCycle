import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecocycle.app',
  appName: 'EcoCycle',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};
export default config;
