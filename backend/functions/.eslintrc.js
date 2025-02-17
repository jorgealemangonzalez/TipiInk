module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'google',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
    },
    ignorePatterns: [
        '/lib/**/*', // Ignore built files.
        '/generated/**/*', // Ignore generated files.
    ],
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    rules: {
        'quotes': ['error', 'single'],
        'import/no-unresolved': 0,
        'indent': ['error', 4],
        'semi': ['error', 'never'],
        'require-jsdoc': 0,
        'max-len': ['error', {
            'code': 120,
            'tabWidth': 2,
            'ignoreUrls': true,
            'ignoreComments': false,
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
        }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
}
