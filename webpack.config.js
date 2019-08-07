//require and include path
const path = require('path');

//require and include html-webpack-plugin
const HTMLWebpackPlugin = require('html-webpack-plugin');

//In webpack, there are 4 core concepts: 
//entry point, output, loaders, plugins
//webpack是负责直接处理代码的
module.exports = {
    //We can specify more than one entry file
    entry: ['babel-polyfill', './src/js/index.js'],   //where webpack start the bundling - the point to start looking for all dependencies which should be bundled together
    output: {   //webpack 如何输出结果的相关选项
        path: path.resolve(__dirname, './dist'),  //__dirname means current path，'dist' 是所有输出文件的目标路径(不仅仅是bundle.js)
        filename: 'js/bundle.js'  // 「入口分块(entry chunk)」的文件名模板。这个模块就是打包的时候会被添加到index.html里的script tag里的JS文件。
    },
    devServer: {
        contentBase: './dist',  //specify the folder that webpack will serve our files - since we bundle all files from src to dist，then dist is the folder we use here

    },
    //plugins receives an array
    plugins: [   //plug-ins allows complex processing of input files, in this case, HTML files, so we use html-webpack-plugin
        new HTMLWebpackPlugin(  //HTMLWebpackPlugin本质上是个class constructor，所以用new关键词
            {
                filename: 'index.html',  //复制到index.html。因为之前的path: path.resolve(__dirname, './dist')已经注明了总的目标路径是./dist，所以这里就是复制到./dist/index.html
                template: './src/index.html'  //Our starting HTML file
            }
        )
    ],
    //loaders 检验和加载JS文件，然后传递给babel，从而convert到ES5
    module: {
        rules: [   //rules receive an array containing all loaders we want to use
            {
                test: /\.js$/,  //test all JavaScript files end with .js - using regular expression starting with / /
                exclude: /node_modules/,  //exclude everything in a node modules folder. If we don't do this, then babel will also apply to node_modules folder, rather than JS file of the application alone
                use: {   //use babel loader
                    loader: 'babel-loader'
                }
            }
        ]
    }
};