export const isTestEnvironment = 
    window.location.hostname !== 'app.tipi.ink' && 
    window.location.hostname !== 'app.hitipi.com' &&
    window.location.hostname !== 'app.oidotipi.com'
export const isLocalEnvironment = window.location.hostname === 'localhost'
