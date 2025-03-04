const fetches = {};

async function fetchx(type, args, send) {
  const id = args && args[1] && args[1].id;
  if (id) {
    const controller = new AbortController();
    fetches[id] = controller;
    args[1].signal = controller.signal;
  }
  try {
    if (args && args[1] && (args[1].body instanceof Array)) {
      const body = new FormData();
      await Promise.all(args[1].body.map(async ({key, value, type, ...extra}) => {
        if (type === 'file') {
          const response = await fetch(value);
          const buffer =  await response.arrayBuffer();
          body.append(key, new Blob([buffer]), extra.filename);
        } else {
          body.append(key, value);
        }
      }));
      args[1].body = body;
    }
    const response = await fetch.apply(null, args);
    try {
      if (type === 'json') {
        return send({ error:null, value: await response.json(), status: response.status });
      } else {
        return send({ error:null, value: await response.text(), status: response.status });
      }
    } catch (error) {
      return send({ error: error.message, value: null });
    }
  } catch (error) {
    return send({ error: error.message, value: null })
  } finally {
    if (id) {
      delete fetches[id];
    }
  }
}

function fetchCancel(id) {
  const controller = fetches[id];
  delete fetches[id];
  controller && controller.abort();
}

chrome.runtime.onMessage.addListener(function(message, sender, send) {
  if (message.query === 'GetConfiguration') {
    chrome.storage.local.get(['configuration'], (data) => {
      send({ value: (data && data.configuration) || {}, error: null });
    });
  } else if (message.query === 'SetConfiguration') {
    chrome.storage.local.set({'configuration': message.value}, () => {
      send({ value: null, error: null });
    });
  } else if (message.query === 'FetchText') {
    fetchx('text', message.args, send);
  } else if (message.query === 'FetchJson') {
    fetchx('json', message.args, send);
  } else if (message.query === 'FetchCancel') {
    fetchCancel(message.id);
    send({ value: null, error: null });
  }
  return true;
});
