import { useEffect } from 'react';

import { useConfiguration } from '../../Configuration';


const WantedListPageSizeLinks = () => {
  const configuration = useConfiguration();

  useEffect(
    () => {
      if (configuration !== null) {
        const arrive = (linkNode) => {
          linkNode.setAttribute('href', `${linkNode.getAttribute('href').replace('edit', 'search')}&pageSize=${configuration.wantedListPageSize}`);
        };
        window.document.arrive('a[href^="/v2/wanted/edit.page?wantedMoreID="]', {existing: true}, arrive);
        return () => {
          window.unbindArrive(arrive);
        };
      }
    },
    [configuration],
  );

  return (null);
};

export default WantedListPageSizeLinks;
