/* eslint-env node */
// nodejs min 17.0

const findComponents = require("./src/findComponents");
const ComponentTag = require("./src/ComponentTag");

/**
 * The component plugin.
 * 
 * @param {object} api The eleventy config object.
 * @param {object} settings The configuration options for this plugin.
 */
async function _plugin(api, settings) {
	const opts = Object.assign({
		tagName: "component",
		componentsFile: false,
		handlePrefix: "@",
		contextName: "components",
		includesDir: "./assets",
		ignorePatterns: [],
		templateExtensions: "njk,html"
	}, settings);

	// Add the found components to the global data set.
	api.addGlobalData(opts.contextName, async () => {
		return await findComponents({
			includesDir: opts.includesDir,
			ignorePatterns: opts.ignorePatterns,
			templateExtensions: opts.templateExtensions,
			handlePrefix: opts.handlePrefix
		});
	});

	api.addNunjucksTag(opts.tagName, function (engine) {
		return new ComponentTag(engine, {
			tagName: opts.tagName,
			fromFile: opts.componentsFile,
			fromContext: opts.contextName
		});
	});
}
_plugin.findComponents = findComponents;
_plugin.ComponentTag = ComponentTag;
module.exports = _plugin;
