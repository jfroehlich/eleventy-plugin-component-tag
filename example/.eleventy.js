const ComponentTagPlugin = require("../");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(ComponentTagPlugin);

	return {
		dataTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "./content",
			output: "./public",
			includes: "../assets",		// things I don't like about 11ty
			layouts: "../assets",		// things I don't like about 11ty
			data: "../data/"			// things I don't like about 11ty
		}
	};
};
