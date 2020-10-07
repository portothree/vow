module.exports = {
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
};
