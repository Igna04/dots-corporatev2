module.exports = {
    env: {
        'jest/globals': true,
    },
    root: true,
    extends: [
        '@react-native',
        'airbnb',
        'eslint:recommended',
        'airbnb/hooks',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
    ],
    parser: '@babel/eslint-parser',
    ignorePatterns: ['plugins/**/*', 'metro.config.js'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Make sure this line is removed
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx'],
            },
        },
        react: {
            version: '18.x',
        },
    },
    rules: {
        'no-unsafe-argument': 'off',
        'no-unsafe-assignment': 'off',
        'no-unsafe-member-access': 'off',
        'no-unsafe-call': 'off',
        'no-unused-vars': 'error',
        'global-require': 0,
        'react-hooks/exhaustive-deps': 'off',
        quotes: ['error', 'single'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'react/require-default-props': [
            'error',
            {
                functions: 'defaultArguments',
            },
        ],
        'react/default-props-match-prop-types': ['error'],
        'react/sort-prop-types': ['error'],
        'react/no-array-index-key': 'off',
        'no-tabs': 'off',
        'no-void': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'react/display-name': 'off',
        'prettier/prettier': 'off',
        'no-console': ['error', { allow: ['error'] }],
    },
};
