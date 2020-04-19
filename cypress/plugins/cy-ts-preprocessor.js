const wp = require('@cypress/webpack-preprocessor')
const path = require('path')

const webpackOptions = {
	resolve: {
		extensions: [ '.ts', '.js' ],
		alias: {
			'@backend': path.resolve(__dirname, '../../src/backend'),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [ /node_modules/ ],
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
}

const options = {
	webpackOptions,
}

module.exports = wp(options)
