# BrickLink Helper Chrome Extension (BHCE)

## Features

* Bulk delete and duplicate for Wanted Lists
* Merge wanted lists
* Force page size for Wanted List's detail page

## Development

The `yarn build` command will "compile" the extension for Google Chrome.
Load the `build` directory in Google Chrome as unpacked extension.
To test it, run `yarn build` and the reload the extension in Google Chrome.

Tip: Use `yarn start` in background to fix syntax errors quickly.


### Publish

0) Set version in manifest.json
1) `yarn build`
2) Create zip with the build folder content
3) Go to https://chrome.google.com/webstore/developer/
4) Upload new version
5) Done.
