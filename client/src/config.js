// These are the default config values. They will be merged with the response
// for /client-config.json.
export default {
  // `true` to allow navigation to /system/analytics and `false` not to.
  showsAnalytics: true,
  home: {
    title: null,
    body: null
  },
  oidcEnabled: false,
  showsFeedbackButton: false,
  // `true` to show additional buttons to facilitate development and testing.
  devTools: false
};
