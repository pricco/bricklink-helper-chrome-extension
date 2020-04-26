import React from 'react';

import { ConfigurationContextProvider } from '../Configuration';
import { UrlContextProvider, UrlMatch } from './contexts/Url';
import WantedListBulk  from './components/WantedListBulk';
import WantedListPageSizeLinks from './components/WantedListPageSizeLinks';

// eslint-disable-next-line
import arrive from 'arrive';
import '../styles.scss';


const Inject = () => {

  return (
    <ConfigurationContextProvider>
      <UrlContextProvider>
        <UrlMatch pattern={/.*\/wanted\/list.page/} target={WantedListBulk}/>
        <UrlMatch pattern={/.*/} target={WantedListPageSizeLinks}/>
      </UrlContextProvider>
    </ConfigurationContextProvider>
  );
}

export default Inject;
