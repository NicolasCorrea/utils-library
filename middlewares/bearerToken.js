module.exports = (req, res, next) => {
	if (req.get("Authorization")) {
		let token = req.get("Authorization").split(" ");
		if (token[0] === "Bearer") {
			req.token = token[1];
		}
	} else if (req.query.access_token) {
		req.token = req.query.access_token;
	} else if (req.body.access_token) {
		req.token = req.body.access_token;
	}
	next();
};
