# Archives Web

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## npm package

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