import React from 'react';
import { Tabs, Layout, Row, Col } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';

import Isolate from '../Isolate';
import { ConfigurationContextProvider } from '../Configuration';
import EditSettings from './EditSettings';
// import '../styles.scss';


const App = () => {
  return (
    <ConfigurationContextProvider>
      <Isolate>
        <Layout style={{ minHeight: '100vh'}}>
          <Layout.Content style={{ margin: '0 auto', padding: '60px 20px 20px 20px', width: '100%', maxWidth: '700px' }}>
            <Row>
              <Col span={24}>
                <h1>BrickLink Helper <HeartTwoTone twoToneColor="#eb2f96" /></h1>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Tabs defaultActiveKey="about">
                  <Tabs.TabPane tab="About" key="about">
                    <h1>Features</h1>
                    <h2>2025-03-04</h2>
                    <ul>
                      <li>Support for chrome manifest v3.</li>
                      <li>Show price info on store's item.</li>
                    </ul>
                    <h2>2020-11-29</h2>
                    <ul>
                      <li>Bulk duplicate wanted lists.</li>
                    </ul>
                    <h2>2020-04-25</h2>
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
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </Isolate>
    </ConfigurationContextProvider>
  );
}

export default App;
