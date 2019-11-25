module.exports = function (api) {
    api.cache(true);

    const presets = ['@vue/app'];
    const plugins = [
        'lodash'
        // '@babel/plugin-proposal-optional-chaining'
    ];

    return {
        presets,
        plugins
    };
};
