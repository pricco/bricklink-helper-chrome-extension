import React, { useState, useEffect } from 'react';

import { fetchText, fetchCancel } from '../../api';


const StoreItems = () => {

  useEffect(
    () => {
       const arrive = async (item) => {
         const img = item.querySelector('.image-box img');
         const src = img.getAttribute('src');
         const match = src.match(/\/(MT|PT|ST|IT)\/([\d]+)\/([a-z0-9-]+)\./);
         const type = match[1];
         const color = match[2];
         const part = match[3];
         const url = `https://www.bricklink.com/catalogPG.asp?${type[0]}=${part}&colorID=${color}`;
         const root = document.createElement('html');

         const id = crypto.randomUUID();
         const check = setInterval(() => {
           if (!item.isConnected) {
             clearInterval(check);
             fetchCancel(id);
           }
         }, 3000);
         try {
           root.innerHTML = await fetchText(url, {id});
         } catch {
           // abort error
           return;
         } finally {
           clearInterval(check);
         }

         const table = root.querySelector('table.fv');
         table.querySelectorAll('& > tbody > tr:first-child').forEach(e => e.remove());
         table.querySelectorAll('& > tbody > tr > td:nth-child(-n + 2)').forEach(e => e.remove());
         table.querySelectorAll('& > tbody > tr:nth-child(n + 3)').forEach(e => e.remove());
         table.querySelectorAll('[src^="/"]').forEach(e => e.setAttribute('src', `https://www.bricklink.com${e.getAttribute('src')}`));
         table.querySelectorAll('[href^="/"]').forEach(e => e.setAttribute('href', `https://www.bricklink.com${e.getAttribute('href')}`));
         table.style.marginTop = '10px';
         item.querySelector('.buy').appendChild(table);
      };
      window.document.arrive('.store-items article.item', {existing: true}, arrive);
      return () => {
        window.unbindArrive(arrive);
      };
    },
    [],
  );

  return null;
};

export default StoreItems;
