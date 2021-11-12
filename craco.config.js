const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
    // webpack: {
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    //     }
    // },
    // mode: 'development',
    // devServer: {
    //     proxy: { "/api/**": { target: 'http://sms.brilliant.com.bd:6005', secure: false }  }
    // },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#1DA57A' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
        {
            plugin: new AntdDayjsWebpackPlugin()
        }
    ],
};