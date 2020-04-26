const system = typeof browser === "undefined" ? window.chrome : browser;

// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
system.runtime.onMessage.addListener(function(message, sender, send) {
  if (message.query === 'GetConfiguration') {
    system.storage.local.get(['configuration'], (data) => {
      send({ value: (data && data.configuration) || {}, error: null });
    });
  } else if (message.query === 'SetConfiguration') {
    system.storage.local.set({'configuration': message.value}, () => {
      send({ value: null, error: null });
    });
  }
  return true;
});
