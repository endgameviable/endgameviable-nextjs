export type EnvVar = {
    name: string;
    defaultValue: string | undefined;
}

export type EnvVars = {
    [key: string]: EnvVar
}

export const ENV: EnvVars = {
    MASTODON_TOKEN: { 
        name: 'EGV_USER_MASTODON_API_TOKEN', 
        defaultValue: undefined,
    },
    COMMENTBOX_APPID: {
        name: 'EGV_USER_COMMENTBOX_APPID', 
        defaultValue: "",
    },
    METADATA_TABLE: {
        name: 'EGV_RESOURCE_STATE_TABLE',
        defaultValue: undefined,
    },
    SEARCH_TABLE: {
        name: 'EGV_RESOURCE_SEARCH_TABLE',
        defaultValue: undefined, 
    },
    JSON_BUCKET: {
        name: 'EGV_RESOURCE_JSON_BUCKET',
        defaultValue: undefined,
    },
    CONCURRENCY: {
        name: 'EGV_USER_FILE_CONCURRENCY',
        defaultValue: '100',
    },
}

// Get environment variables in a safer way.
// Throws an error if a variable doesn't exist and there's no default.
export function getEnv(config: EnvVar): string {
    const value = process.env[config.name];
    if (value) return value;

    if (config.defaultValue === undefined) {
        const message = `no value found for variable ${config.name}`;
        console.log(message);
        throw new Error(message); // kill the app
    }
    
    console.log(`using default value for ${config.name}`);
    return config.defaultValue;
}
