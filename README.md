eleventy-plugin-component-tag
================================================================================

Render basic components from your fractal design library into your eleventy site
using nunjucks. Or create your standalone design library with just eleventy.

The tag can be used with nunjucks without eleventy. Read below for details.

Installation
--------------------------------------------------------------------------------

- Tested with eleventy 2.0.0 but should work with 1.0, too. - Should have at
least nodejs v17.

```bash
npm install --save-dev eleventy-plugin-component-tag
```

Then open your Eleventy config file (probably `.eleventy.js`) and use
`addPlugin`:

```javascript
const pluginComponentTag = require("eleventy-plugin-component-tag");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginComponentTag);
};
```

You’re only allowed one `module.exports` in your configuration file, so make sure
you only copy the require and the `addPlugin` lines above!


Options
--------------------------------------------------------------------------------

There are a number of options to customize the tag and how the components are
loaded. To get an overview here are all settings at once:

```javascript
const pluginComponentTag = require("eleventy-plugin-component-tag");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginComponentTag, {

  });
};
```

Components and templates
--------------------------------------------------------------------------------

Using the tag standalone
--------------------------------------------------------------------------------

