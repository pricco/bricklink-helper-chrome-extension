import React, { useContext, useState, useEffect } from 'react';


const UrlContext = React.createContext(null);


const UrlContextProvider = ({ children }) => {
  const [state, setState] = useState(window.location.href);

  useEffect(
    () => {
      let interval = setInterval(() => {
        if (window.location.href !== state) {
          setState(window.location.href);
        }
      }, 100);
      return () => {
        window.clearInterval(interval);
      };
    },
    [state],
  );

  return (
    <UrlContext.Provider value={state}>
      {children}
    </UrlContext.Provider>
  );
};


const UrlContextConsumer = UrlContext.Consumer;


const useUrl = () => {
  return useContext(UrlContext);
};


const UrlMatch = ({ pattern, target }) => {
  const url = useUrl(null);
  const Target = target;
  return url !== null && pattern.test(url) && (<Target />);
};


export { useUrl, UrlContext, UrlContextProvider, UrlContextConsumer, UrlMatch };
