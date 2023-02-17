eleventy-plugin-component-tag
================================================================================

Render basic components from your fractal design library into your eleventy site
using nunjucks. Or create your standalone design library with just eleventy.

The tag can be used with nunjucks without eleventy. Read below for details.

Missing Features
--------------------------------------------------------------------------------

- [ ] Tests and CI setup
- [ ] Remove the yaml dependency and make config loading configurable.


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

Let's say you have your assets in an `assets` folder and or want your design
library from [fractal](https://fractal.build/) there. Well, before you copy your
entire library you might want to test your setup with a simple component like
below:

```
├─ assets/
│  ├─ components/
│  │  └─ my-component/
│  │     ├─ my-component.css
│  │     ├─ my-component.js
│  │     ├─ my-component.config.yml
│  │     ├─ my-component--nestable.njk
│  │     └─ my-component.njk
│  │
│  └─ layouts/
│     └─ page.njk
...
```

Eleventy doesn't have asset pipelines by default (which is a good thing) so
you'd need to handle css/scss and js files separatly and they not covered in
this tutorial.

That `my-component.njk` is the actual component. Let's look at its fairly simple
content:

```nunjucks
<p class="my-component{% if classes %} {{ classes }}{% endif %}">
  {{ content }}
</p>
```

Inside your `page.njk` you could now use that component like this:

```nunjucks
{% component "@my-component" %}
```

That `my-components.config.yml` holds a default configuration and defines
potential variants. 

```yml
handle: "my-component"

context:
  content: "This the default text."

variants:
  - name: "hot"
    classes: "hot-stuff"

  - name: "nestable"
    headline: "This is the default headline."
    content: []
```

The config can change the components `handle` which is the basename of the component
by default. It may have a context object to set defaults. And it may have variants.
Everything else in there is ignored by `findComponents` and the `ComponentTag`.

That default context is injected into the component template by default and would then
render inside the `page.njk` as:

```html
<p class="my-component">This is the default text.</p>
```

The variants can only be defined by the config file, because the may use the
same component template and just manipulate the context (which is the variants
object in the list). The only requirement of a variant in the list is the
`name`.

Let's look at the more complex `nestable` variant example. That may have its own
template file with the variant name appended as `my-component--nestable.njk`:

```nunjucks
<h2>{{ headline }}</h2>
<section class="my-component{% if classes %} {{ classes }}{% endif %}">
  {% for item in content %}
  {% component item.handle, item.context %}
  {% endfor %}
</section>
```

Please note that a component can include other components if needed. And you can
override your components context. Let's look at how it's used in the `page.njk`:

```nunjucks
{% component '@my-component--nestable', {
  headline: "The headline from the layout",
  content: [
    {handle: '@my-component', context: {content: "Check, check. Works!"}},
    {handle: '@my-component', context: {content: "Hello there."}}
  ]
} %}
```

The tags pattern is `{% component <handle>, <contextOverride> %}`. And because of
that the `page.njk` would then render as:

```html
<h2>The headline from the layout.</h2>
<section class="my-component">
  <p class="my-component">Check, check. Works!</p>
  <p class="my-component">Hello there.</p>
</section>
```


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
