const {I18n} = require("i18n")
const path = require("path");

module.exports = dirname => {
	if (!dirname) return null;
	return new I18n({
		locales: ["en", "es"],
		directory: path.join(dirname, "locales"),
	});
};