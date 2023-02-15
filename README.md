eleventy-plugin-component-tag
================================================================================

Render basic components from your fractal design library into your eleventy site
using nunjucks. Or create your standalone design library with just eleventy.

The tag can be used with nunjucks without eleventy. Read below for details.

Installation
--------------------------------------------------------------------------------

- Tested with eleventy 2.0.0 but should work with 1.0, too. 
- Should have at least nodejs v17.

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

        // The name of the tag used in the templates
        tagName: "component",

        // A path to a json file with component definitions relative to the
        // project root. Or `false` if this should not be used.
        componentsFile: false,

        // The prefix of the components. Fractal uses `@` but you can use what
        // ever floats your boat (I guess).
        handlePrefix: "@",

        // The name of the component lookup object inside the nunjucks context.
        // When this is false the tag expects a components json file.
        contextName: "components",

        // This is where the components are located relative to a nunjucks
        // template lookup directory.
        includesDir: "./assets",

        // Files matching the glob in this list are ignored.
        ignorePatterns: [],

        // These extension are components. This is a nunjucks tag -- you could
        // use "liquid" or "hbs" as well but it may not work that well.
        templateExtensions: "njk,html"
    });
};
```

Example
--------------------------------------------------------------------------------



Using the tag standalone
--------------------------------------------------------------------------------

