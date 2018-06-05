// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    extends: [
        'plugin:vue/essential',
        '@vue/prettier'
    ],
    parserOptions: {
        ecmaVersion: 2017
    },
    rules: {
        "no-unused-vars": 'warn'
    }
}
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