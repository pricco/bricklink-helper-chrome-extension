import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';

// import './styles.scss';

const Isolate = ({ node, tag, children }) => {
  const Root = tag || 'div';
  const Content = () => (
    <Root id="bhce-root">
      <ConfigProvider getPopupContainer={() => document.querySelector('#bhce-safe')}>
        {children}
      </ConfigProvider>
    </Root>
  );
  return node ? ReactDOM.createPortal(<Content />, node) : <Content />;
};

export default Isolate;
