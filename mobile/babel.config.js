module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated v4 uses the worklets plugin; babel-preset-expo (SDK 50+)
    // includes it automatically, listed here explicitly for safety.
  };
};