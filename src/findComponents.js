/* eslint-env node */
const path = require("path");
const lib = require("./src/utils");

/**
 * Find all components.
 * 
 * Finds all components in predefined locations and makes them includeable by
 * the component tag. The returned object can be dumped as JSON as static cache
 * or used directly to process components directly with the nunjucks tag.
 * 
 * Settings:
 * 
 * **includeDir**	
 * List with directories to include in the search for components.
 * 
 * **ignorePatterns**	
 * List with directories to exclude in the search for components.
 *  
 * **templateExtensions**	
 * The file extensions for component templates in the search locations.
 * default: "njk,html"
 * 
 * @param {object} settings Configuration options for the search.
 */
 async function findComponents(settings={}) {
	const components = {};
	const config = Object.assign({
		includesDir: "./assets",	// Relative to the project root
		ignorePatterns: [],
		templateExtensions: "njk,html",
		handlePrefix: "@"
	}, settings);

	// We want the templates to be found in parallel in case there are multiple
	// locations. The variants exclusion pattern is hardcoded since this pattern
	// can't be when fetching the variant template.
	const templateFiles = await lib.asyncGlob(`**/*.{${config.templateExtensions}}`, {
		cwd: config.includesDir,
		ignore: config.ignorePatterns.concat("**/*--*.*")
	});
	await Promise.all(templateFiles.map(async filename => {
		const model = {
			filename: `${filename}`,
			dirname: `${path.dirname(filename)}`,
			handle: path.basename(filename, path.extname(filename)),
			handlePrefix: `${config.handlePrefix}`,
			cwd: `${config.includesDir}`,
			context: {}
		};
		const results = [];

		// Fetch the context from the configuration. To have a predefined
		// context is why we do all this.
		const componentConfig = await lib.loadComponentConfig(model);
		model.context = Object.assign(model.context, componentConfig.context || {});
		model.handle = componentConfig.handle || model.handle;

		const variantList = componentConfig.variants || [];
		for (const variantConfig of variantList) {
			if (!!variantConfig.name === false) {
				continue;
			}
			
			// Clone the parents context and merge the variants context if it
			// exists. This `structuredClone` requires min nodejs 17.0, but does
			// an actual deep clone.
			const variant = structuredClone(model);
			Object.assign(variant.context, variantConfig.context || {});
			variant.handle = `${variant.handle}--${variantConfig.name}`;
			variant.filename = await lib.findVariantTemplate(variant, config.templateExtensions);
			results.push(lib.makeComponent(variant));
		}

		results.push(lib.makeComponent(model));
		return results;
	})).then(results => {
		// FIXME This is ugly. Let's refactor this.
		results.forEach(list => {
			list.forEach(item => {
				components[item.handle] = item.component;
			});
		});
	});
	return components;
};

module.exports = findComponents;
