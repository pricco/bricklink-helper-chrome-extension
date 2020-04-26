import React from 'react';
import { Tabs } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

import { ConfigurationContextProvider } from '../Configuration';
import EditSettings from './EditSettings';
import '../styles.scss';


const App = () => {
  return (
    <ConfigurationContextProvider>
      <h1>BrickLink Helper <HeartTwoTone twoToneColor="#eb2f96" /></h1>
      <Tabs defaultActiveKey="about">
        <Tabs.TabPane tab="About" key="about">
          <h1>Features</h1>
          <ul>
            <li>Merge wanted lists.</li>
            <li>Bulk delete wanted lists.</li>
            <li>Force wanted list page size (default to 2000)</li>
          </ul>
          <h1>Requests, Support or Contributions</h1>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/pricco/bricklink-helper-chrome-extension">https://github.com/pricco/bricklink-helper-chrome-extension</a>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Settings" key="settings">
          <h1>Settings</h1>
          <EditSettings />
        </Tabs.TabPane>
      </Tabs>
    </ConfigurationContextProvider>
  );
}

export default App;
