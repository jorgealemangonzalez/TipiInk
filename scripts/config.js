const config = {
    prod: false,
    ORGANIZATION_FILE_NAME: '.local/organization.json',
    ENV_FILE_NAME: '.env.local',
}

const getConfig = () => config
const setConfig = (key, value) => (config[key] = value)

module.exports = {
    getConfig,
    setConfig,
}
