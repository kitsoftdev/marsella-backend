/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: [
		'.mock.ts',
		'main.ts',
		'server.ts',
		'mongo_wrapper.ts',
		'config_env.ts',
		'google_auth.ts',
		'azblob.ts',
		'load_data_02.ts'
	],
	coverageThreshold: {
		'global': {
			'lines': 80,
			'branches':75,
			'functions':90, 
			'statements':80}}
};