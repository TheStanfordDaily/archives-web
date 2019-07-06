# Archives Web

[![Build Status](https://travis-ci.com/TheStanfordDaily/archives-web.svg?branch=master)](https://travis-ci.com/TheStanfordDaily/archives-web)
[![Netlify Status](https://api.netlify.com/api/v1/badges/18b5bb7c-4136-4b00-a7c8-09b80998ba92/deploy-status)](https://app.netlify.com/sites/stanforddaily-archives/deploys)
[![Greenkeeper badge](https://badges.greenkeeper.io/TheStanfordDaily/archives-web.svg)](https://greenkeeper.io/)

Helper functions (and web app) for METS/ALTO archives viewing.

## Usage
```bash
npm install @thestanforddaily/archives-web
```

Use utility functions

```js
const { fetchAllPapers } = require("@thestanforddaily/archives-web/lib/helpers/papers");
```

## Publishing new version
Increment version.
Run `npm publish --access public`

## License
Licensed under an [Apache-2.0](https://github.com/TheStanfordDaily/archives-web/blob/master/LICENSE) license.
