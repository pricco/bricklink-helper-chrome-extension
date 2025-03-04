import React from 'react';
import { createRoot } from 'react-dom/client';
import Settings from './settings';
import Inject from './inject';

if (document.getElementById('bhce-safe') === null) {
  const div = document.createElement('div');
  div.setAttribute('id', 'bhce-safe');
  document.body.appendChild(div);
}

if (document.getElementById('bhce-settings')) {
  const domNode = document.getElementById('bhce-settings');
  const root = createRoot(domNode);
  root.render(<Settings />);
} else {
  if (document.getElementById('bhce-inject') === null) {
    const inject = document.createElement('div');
    inject.setAttribute('id', 'bhce-inject');
    document.body.appendChild(inject);
    const domNode = document.getElementById('bhce-inject');
    const root = createRoot(domNode);
    root.render(<Inject />);
  }
}
