# @nebohq/plugin

Plugin used in the Nebo ecosystem that:
- Initializes Nebo in your repository.
- Watches for changes as you are developing with Nebo.
- Builds Nebo files for use in production.

This works in the following way:
1. Start off by initializing Nebo with this plugin. See the [`init` command](#init) description below.
2. (Optional) If you have complex webpack needs, set up the `configure` option in `nebo.webpack.js`. See [Webpack Configuration File](#webpack-configuration-file) below.
3. Compile `nebo.config.js` and `nebo.config.css` (these are called Nebo assets) to use in the Nebo app. See the [`build` command](#build) below.
4. Deploy the Nebo assets to production and configure your production URLs in the Nebo app.

If you are developing, you can also watch your file changes to produce local Nebo assets.
1. Start the Nebo watcher with this plug in. See the [`watch` command](#watch) description below.
2. Then, as you are developing components or style for use inside of Nebo, you'll add them to your Nebo library config file (usually `nebo.config.js`). They will automatically be compiled into your static assets folder as `nebo.config.js` and `nebo.config.css`.
3. You can use these two built files to configure your settings on the Nebo app.

# Installation
Run the following commands in the shell of your choice:
```shell
# with npm
npm install @nebohq/plugin
# with yarn
yarn add @nebohq/plugin
```

# Usage
To run the plugin, use the following commands:

```shell
# with npm
npx nebo [command] [...options] 

# with yarn
yarn run nebo [command] [...options]
```

## Commands

### `init`
Initializes the repository for Nebo.

The command takes the following options:
- `access-token` - Supplies the Nebo access token.
- `config-path` - (default: `./nebo.config.js`) - Provides the path to the Nebo directory configuration.
- `public-path` - (default: `./public`) - Path to where your static files are served
- `global-styles-path` - (default: `null`) - Path to additional styles outside of those included in the `config-path`

```shell
# with npm
npx nebo init --access-token=your-access-token-here --global-styles-path=./styles/globals.css

# with yarn
yarn run nebo init --access-token=your-access-token-here --global-styles-path=./styles/globals.css
```

This will generate two files:
- `nebo.webpack.js` - allows you to configure your Nebo webpack configuration. If you provide your access token, it will automatically be filled in here.
- `nebo.config.js` - (or the value of `config-path`) - allows you to add components and styles for use in Nebo.

### `build`
Builds Nebo assets for use on `nebohq.com`. 
This is the default command.

It will re-use the options found in `nebo.webpack.js`, but if you want to override them, the following options are available:
- `config-path` - (default: `./nebo.config.js`) - Provides the path to the Nebo directory configuration.
- `public-path` - (default: `./public`) - Path to where your static asset files are served.
- `global-styles-path` - (default: `null`) - Path to additional styles outside of those included in the `config-path`

```shell
# with npm
npx nebo # runs with options from nebo.webpack.js
npx nebo build --global-styles-path=./styles/other-styles.css

# with yarn
yarn run nebo # runs with options from nebo.webpack.js
yarn run nebo build --global-styles-path=./styles/other-styles.css
```

### `watch`
Keeps track of file changes and builds a development version of assets for `nebohq.com`.

It will re-use the options found in `nebo.webpack.js`, but if you want to override them, the following options are available:
- `config-path` - (default: `./nebo.config.js`) - Provides the path to the Nebo directory configuration.
- `public-path` - (default: `./public`) - Path to where your static asset files are served.
- `global-styles-path` - (default: `null`) - Path to additional styles outside of those included in the `config-path`

```shell
# with npm
npx nebo watch # runs with options from nebo.webpack.js

# with yarn
yarn run nebo watch # runs with options from nebo.webpack.js
```

## Webpack Configuration File
This file is generated at `nebo.webpack.js`. It has the following options:
- `configPath` - (default: `./nebo.config.js`) - Provides the path to the Nebo directory configuration.
- `publicPath` - (default: `./public`) - Path to where your static asset files are served.
- `globalStylesPath` - (default: `null`) - Path to additional styles outside of those included in the `config-path`. This can also be an array.
- `configure` - (default: `(config) => config`) - Allows you to change the Webpack configuration that Nebo uses to generate its asset files. 

```js
// nebo.webpack.js
module.exports = {
  configPath: "./nebo.config.js",
  publicPath: "./public",
  globalStylesPath: ["./src/stylesheets/application.scss", "./src/stylesheets/globals.css"],
  configure: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: 'svg-inline-loader'
    });
    return config;
  },
};
```

## Nebo Directory Configuration
Allows you to add components for use in the Nebo app. **If your component is not imported here, it will not be available in the Nebo app.**

```js
// nebo.config.js (can be changed via the configPath option in nebo.webpack.js)
import React from 'react';
import ReactDOM from 'react-dom';
import Component, { configure, fetchComponent } from '@nebohq/nebo';
import Badge from './src/components/Badge'; // importing the Badge component

const accessToken = '[ACCESS_TOKEN]';
const directory = configure({
  directory: {
    // Add your components here
    Badge // adding the Badge component to Nebo
  },
  react: React,
  renderer: ReactDOM,
  accessToken,
});

const fetchSchema = async (idOrSlug) => fetchComponent({ idOrSlug, accessToken });

const NeboComponent = Component;
export default NeboComponent;
export { directory, fetchSchema };
```

