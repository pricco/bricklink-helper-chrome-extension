import React, { useContext, useState, useEffect } from 'react';

import { showError } from './utils';
import { setConfiguration, getConfiguration} from './api';


const ConfigurationContext = React.createContext({ value: null, refresh: () => {} });

const DEFAULTS = {
  wantedListPageSize: 2000,
};


const refresh = async (setState) => {
  try {
    let value = await getConfiguration();
    setState({...DEFAULTS, ...value});
  } catch (error) {
    showError(error);
    setState({...DEFAULTS});
  }
};

const update = async (value, setState) => {
  try {
    await setConfiguration(value);
    setState({...DEFAULTS, ...value});
  } catch (error) {
    showError(error);
    setState({...DEFAULTS});
  }
};


const ConfigurationContextProvider = ({ children }) => {
  const [state, setState] = useState(null);

  useEffect(
    () => {
      refresh(setState);
      return () => {};
    },
    [],
  );

  return (
    <ConfigurationContext.Provider value={{ value: state, refresh: () => refresh(setState), update: (value) => update(value, setState) }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

const ConfigurationContextConsumer = ConfigurationContext.Consumer;


const useConfiguration = () => {
  return useContext(ConfigurationContext).value;
};

export { useConfiguration, ConfigurationContext, ConfigurationContextProvider, ConfigurationContextConsumer, DEFAULTS };
