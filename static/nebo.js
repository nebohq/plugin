import React from 'react';
import ReactDOM from 'react-dom';
import { configure, fetchComponent } from '@nebohq/nebo';

const accessToken = '[ACCESS_TOKEN]';
const { NeboComponent, NeboHead } = configure({
  directory: {
    // Add your components here
  },
  react: React,
  renderer: ReactDOM,
  accessToken,
});

const fetchSchema = async (idOrSlug) => fetchComponent({ idOrSlug, accessToken });

export default NeboComponent;
export { NeboHead, fetchSchema };

