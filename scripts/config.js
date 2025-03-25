const config = {
    prod: false,
    ORGANIZATION_FILE_NAME: 'organization.json',
    GOOGLE_REVIEWS_FILE_NAME: 'Google Maps Reviews.xlsx',
    CSV_REVIEWS_FILE_NAME: 'reviews.csv',
    ENV_FILE_NAME: '.env.local',
}

const getConfig = () => config
const setConfig = (key, value) => (config[key] = value)

module.exports = {
    getConfig,
    setConfig,
}
