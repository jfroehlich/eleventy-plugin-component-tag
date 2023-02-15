/* eslint-env node */

class ComponentTag {
	constructor(engine, settings) {
		this.config = Object.assign({
			tagName: "component",		// name of the nunjucks tag.
			fromFile: false,			// string with relative path to json file cwd or false
			fromContext: "components"	// the variable name inside the context or false
		}, settings);

		this.engine = engine;
		this.tags = [this.config.tagName];
		this._components = {};

		if (this.config.fromFile) {
			const filename = path.resolve(process.cwd(), this.config.fromFile);
			try {
				// I'm using sync methods here because the async ones don't work
				// well in the constructor...
				if (fs.existsSync(filename)) {
					this._components = JSON.parse(fs.readFileSync(filename));
				}
			} catch (error) {
				console.error(`Couldn't load components from '${filename}'.`, error);
			}
		}
	}

	parse(parser, nodes) {
		let tok = parser.nextToken();
		let args = parser.parseSignature(null, true);

		parser.advanceAfterBlockEnd(tok.value);
		return new nodes.CallExtension(this, "run", args);
	}

	/**
	 * Renders a component like from a fractal component library.
	 * 
	 * This requires a map of components in form of `components.json` file to be placed
	 * in the root directory of the project.
	 * 
	 * When everything is fine you can use `{% render '@myHandle', {name: "schnick"}, true %}`
	 * in your templates – like you are used to from fractal.
	 * 
	 * @param {object} context - The current context from nunjucks
	 * @param {string} handle - The handle of the component you want to use e.g `@my-component--best-variant`
	 * @param {object} data - The data you want to put into this component
	 * @param {boolean} partial - Whether that data is the full set or just some parts (default: false)
	 */
	run(context, handle, data={}, partial=true) {
		let result = "";
		let component = {};

		// Load the component from the file cache or the nunjucks context
		if (handle in this._components) {
			component = this._components[handle];
		} else if (!!this.config.fromContext && handle in context.ctx[this.config.fromContext]) {
			component = context.ctx[this.config.fromContext][handle];
		} else {
			console.error(`[ComponentTag] Component with handle '${handle}' not found for '${context.ctx.page.inputPath}'.`);
			return result;
		}
		
		let ctx = Object.assign({}, context.ctx, structuredClone(data));
		if (partial) {
			ctx = Object.assign({}, structuredClone(component.ctx), ctx);
		}

		try {
			result = context.env.render(component.path, ctx);
		} catch (error) {
			console.error(`Failed to render component '${handle}'!`);
			throw error;
		}

		return new this.engine.runtime.SafeString(result);
	}
}
module.exports = ComponentTag;
