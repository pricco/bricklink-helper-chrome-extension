import React from 'react';
import ReactDOM from 'react-dom';
import Settings from './settings';
import Inject from './inject';

if (document.getElementById('bhce-safe') === null) {
  const div = document.createElement('div');
  div.setAttribute('id', 'bhce-safe');
  document.body.appendChild(div);
}

if (document.getElementById('bhce-settings')) {
  ReactDOM.render(<Settings />, document.getElementById('bhce-settings'));
} else {
  if (document.getElementById('bhce-inject') === null) {
    const inject = document.createElement('div');
    inject.setAttribute('id', 'bhce-inject');
    document.body.appendChild(inject);
    ReactDOM.render(<Inject />, document.getElementById('bhce-inject'));
  }
}
