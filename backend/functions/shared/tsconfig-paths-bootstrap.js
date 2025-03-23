/* eslint-disable @typescript-eslint/no-var-requires */

const tsConfigPaths = require('tsconfig-paths')
const { readFileSync } = require('fs')
const { resolve } = require('path')

// Load tsconfig.json
const tsConfig = JSON.parse(readFileSync(resolve(__dirname, './tsconfig.json')).toString())

// Setup the path mapping from tsconfig
const { paths, baseUrl } = tsConfig.compilerOptions

// Registers the path aliases
tsConfigPaths.register({
    baseUrl: resolve(__dirname, baseUrl),
    paths,
})
