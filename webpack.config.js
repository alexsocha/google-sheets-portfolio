const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    plugins: [new GasPlugin()],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        usedExports: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.gs',
        path: path.resolve(__dirname, 'dist'),
    },
};
