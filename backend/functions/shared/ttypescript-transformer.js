/* eslint-disable @typescript-eslint/no-var-requires */
const transformer = require('ts-transform-paths').default

module.exports = transformer({
    afterDeclarations: true,
})
