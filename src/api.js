// eslint-disable-next-line
const system = typeof browser === "undefined" ? window.chrome : browser;


export const getWantedListItems = async (id) => {
  const response = await fetch('/ajax/clone/wanted/search2.ajax', {
    headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    body: `showStores=0&storeSort=1&showIncomplete=1&showSuperlots=1&wantedMoreID=${id}&pageSize=10000`,
    method: 'POST',
  });
  const result = await response.json();
  return result.results.wantedItems;
};


export const deleteWantedList = async (id) => {
  const response = await fetch('/ajax/clone/wanted/editList.ajax', {
    headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    body: `wantedMoreID=${id}&action=D`,
    method: 'POST',
  });
  await response.json();
  return null;
};


export const createWantedList = async (name) => {
  const response = await fetch('/ajax/clone/wanted/editList.ajax', {
    headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    body: `wantedMoreName=${encodeURIComponent(name)}&wantedMoreDesc=&action=C`,
    method: 'POST',
  });
  const result = await response.json();
  return result.wantedMoreID;
};


export const addItemsToWantedList = async (id, items) => {
  const response = await fetch('/ajax/clone/wanted/add.ajax', {
    headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    body: `wantedMoreID=${id}&wantedItemStr=${encodeURIComponent(JSON.stringify(items))}`,
    method: 'POST',
  });
  await response.json();
  return null;
};


const call = (params) => {
  return new Promise(
    (resolve, reject) => {
      system.runtime.sendMessage(
        { ...params },
        ({error, value})  => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(value);
          }
        }
      );
    }
  );
};

export const fetchText = (...args) => {
  return call({query: 'FetchText', args});
};

export const fetchJson = (...args) => {
  return call({query: 'FetchJson', args});
};

export const fetchCancel = (id) => {
  return call({query: 'FetchCancel', id});
};

export const getConfiguration = () => call({ query: 'GetConfiguration' });
export const setConfiguration = (value) => call({ query: 'SetConfiguration', value });
