module.exports = {
    root: true,
    env: {
        es2020: true,
        node: true,
        browser: false,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['dist', 'lib', '.eslintrc.cjs', 'node_modules', '**/*.md', '**/*.json', '.gitignore'],
    plugins: ['@typescript-eslint', 'import'],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
        },
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single', 'avoid-escape'],
        'quote-props': ['error', 'as-needed'],
        'operator-linebreak': ['error', 'after'],
        'max-len': [
            'error',
            {
                code: 120,
                tabWidth: 2,
                ignoreUrls: true,
                ignoreComments: false,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'object-curly-spacing': ['error', 'always'],
        'arrow-parens': ['error', 'as-needed'],
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
}
