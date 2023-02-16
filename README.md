eleventy-plugin-component-tag
================================================================================

Render basic components from your fractal design library into your eleventy site
using nunjucks. Or create your standalone design library with just eleventy.

The tag can be used with nunjucks without eleventy. Read below for details.

Installation
--------------------------------------------------------------------------------

- Tested with eleventy 2.0.0 but should work with 1.0, too. 
- Should have at least nodejs v17.
- And you should be using nunjucks since it's a nunjucks tag …

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
        // views directory.
        includesDir: "./assets",

        // Files matching the glob in this list are ignored.
        ignorePatterns: [],

        // These extension are components. This is a nunjucks tag -- you could
        // use "liquid" or "hbs" but it may propably not work that well.
        templateExtensions: "njk,html"
    });
};
```

Example
--------------------------------------------------------------------------------



Using the tag standalone
--------------------------------------------------------------------------------

Consider this a more advanced topic: In case you'd like to use this tag outside
of eleventy or with a custom nunjucks environment, it's possible to import the
necessary parts seperately.

```javascript

const {findComponents, ComponentsTag} = require("eleventy-plugin-component-tag");

// ... Setup the nunjucks env to your liking here...

env.addExtension("ComponentsTag", new ComponentsTag(env, {
    // name of the nunjucks tag.
    tagName: "component",

    // string with relative path to json file cwd or false
    fromFile: false,

    // the variable name inside the context or false
    fromContext: "components"	
}));


const context = {};
context.components = findComponents({
    // Where the components live inside a views directory
		includesDir: "./assets",

    // These globs should be ignored
		ignorePatterns: [],

    // Those file extensions are used for templates
		templateExtensions: "njk,html",

    // Thats the prefix for components inside the views.
		handlePrefix: "@"
});

env.render(context, ...);
```
