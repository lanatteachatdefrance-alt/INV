import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.investirbourse.app',
  appName: 'Investir en Bourse',
  webDir: 'mobile',
  server: {
    url: 'https://investirenbourse.org',
    cleartext: false
  }
};

export default config;
