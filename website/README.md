# GoodData Ruby SDK Documentation

## About this repository

This repository contains source code for the Documentation of the Ruby SDK for GoodData.

The code itself is in the `master` branch, while there is a unrelated `gd-pages` branch that contains the build website for github pages.

## Running the documentation locally

1. Make sure all the dependencies for the website are installed:

```sh
# Install dependencies
$ yarn
```
2. Run your dev server:

```sh
# Start the site
$ yarn start
```

3. Open  the dev server:

[http://localhost:3000/gooddata-ruby-doc/](http://localhost:3000/gooddata-ruby-doc/)

## Directory Structure

The file structure of the documentation looks like this

```
docs/
  doc-1.md
  doc-2.md
  doc-3.md
website/
  core/
  node_modules/
  pages/
  static/
    css/
    img/
  package.json
  sidebar.json
  siteConfig.js
```

## Deployment

To deploy the website to the github pages, please use following commands:

```sh
GIT_USER=<GIT_USER> \
  CURRENT_BRANCH=master \
  USE_SSH=true \
  yarn run publish-gh-pages # or `npm run publish-gh-pages`
```

## Editing Content

### Editing an existing docs page

Edit docs by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

## Adding Content

### Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

1. Refer to that doc's ID in an existing sidebar in `website/sidebar.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
{
  "docs": {
    "Getting Started": [
      "quick-start",
      "newly-created-doc" // new doc here
    ],
    ...
  },
  ...
}
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)
