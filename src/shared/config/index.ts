export const isDev = getRequiredEnvVar('DEV');
export const isProd = getRequiredEnvVar('PROD');

export const API_URL = '';

function getRequiredEnvVar(key: string) {
	const envVar = getEnvVar(key);
	if (envVar === undefined) {
		throw new Error(`Env variable ${key} is required`);
	}

	return envVar;
}
function getEnvVar(key: string) {
	return import.meta.env[key];
}
