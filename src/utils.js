/* eslint-env node */
const YAML = require("yaml");
const glob = require("glob");

const fs = require("fs");
const path = require("path");

const lib = {};
module.exports = lib;

/**
 * Find files by a glob pattern.
 * 
 * This is the asynchronous version of the glob libraries function.
 * 
 * @param {string} pattern The glob pattern for the requested files.
 * @param {object} options An object of settings for the glob library:
 * @returns 
 */
lib.asyncGlob = async function (pattern, options) {
	return new Promise((resolve, reject) => {
		glob(pattern, options, (error, files) => {
			if (error) { return reject(error); }
			resolve(files);
		});
	});
};

lib.asyncReadFile = async function (path, encoding) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, encoding, (error, data) => {
			if (error) { return reject(error); }
			resolve(data);
		});
	});
};

lib.makeComponent = function (model) {
	return {
		handle: `${model.handlePrefix}${model.handle}`, 
		component: {path: model.filename, ctx: model.context}
	};
};

lib.findVariantTemplate = async function (variant, extensions) {
	const template = await lib.asyncGlob(
		`${variant.dirname}/${variant.handle}.{${extensions}}`,
		{cwd: variant.cwd}
	);
	return (template.length > 0) ? template[0] : variant.filename;
};

lib.loadComponentConfig = async function (model) {
	// Find the config file for the given template.
	const configFile = await lib.asyncGlob(
		`${model.dirname}/${model.handle}.config.{yml,yaml}`, 
		{cwd: model.cwd}
	);
	if (configFile.length === 0) {
		return {};
	}

	const rawData = await lib.asyncReadFile(
		path.posix.join(model.cwd, configFile[0]), "utf-8");
	let config = YAML.parse(rawData);
	return config || {};	// Empty config files are null after yaml parsing
};
