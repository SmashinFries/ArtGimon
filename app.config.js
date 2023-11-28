const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
    name: IS_DEV ? "Art Gimon DEV" : "Art Gimon",
    slug: "AiGimon",
    scheme: "artgimon",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    // updates: {
    //   enabled: true,
    //   checkAutomatically: "ON_LOAD",
    //   url: "https://u.expo.dev/2042bd0d-c904-4b0b-85c3-8c6596210477"
    // },
    runtimeVersion: {
      policy: "appVersion"
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: IS_DEV ? "com.kuzutech.ArtGimonDev" : "com.kuzutech.ArtGimon"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "2042bd0d-c904-4b0b-85c3-8c6596210477"
      }
    }
  }
