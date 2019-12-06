// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        'prettier',
        'prettier/vue'
    ],
    plugins: [,
        "loash-fp",
        "vue"
    ],
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2017
    },
    rules: {
        "no-unused-vars": 'warn'
    }
}
module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint'
    },
    plugins: ['vue'],
    extends: [
    ]
};
/*
    ],
    rules: {
        indent: 'warn',
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            }
        ]
    },
    overrides: [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off",
                "vue/script-indent": ["error", 4, { "baseIndent": 1 }]
            }
        }
*/