import React from 'react';
import ReactDOM from 'react-dom';
import Component, { configure, fetchComponent } from '@nebohq/nebo';

const accessToken = '[ACCESS_TOKEN]';
const directory = configure({
  directory: {
    // Add your components here
  },
  react: React,
  renderer: ReactDOM,
  accessToken,
});

const fetchSchema = async (idOrSlug) => fetchComponent({ idOrSlug, accessToken });

const NeboComponent = Component;
export default NeboComponent;
export { directory, fetchSchema };
