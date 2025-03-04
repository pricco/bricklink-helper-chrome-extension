import React from 'react';

import { ConfigurationContextProvider } from '../Configuration';
import { UrlContextProvider, UrlMatch } from './contexts/Url';
import WantedListBulk  from './components/WantedListBulk';
import WantedListPageSizeLinks from './components/WantedListPageSizeLinks';
import StoreItems from './components/StoreItems';

// eslint-disable-next-line
import arrive from 'arrive';
// import '../styles.scss';


const Inject = () => {

  return (
    <ConfigurationContextProvider>
      <UrlContextProvider>
        <UrlMatch pattern={/.*\/wanted\/list.page/} target={WantedListBulk}/>
        <UrlMatch pattern={/.*/} target={WantedListPageSizeLinks}/>
        <UrlMatch pattern={/https:\/\/store.bricklink.com\/.*/} target={StoreItems}/>
      </UrlContextProvider>
    </ConfigurationContextProvider>
  );
}

export default Inject;
