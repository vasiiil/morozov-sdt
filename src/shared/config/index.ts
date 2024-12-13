export const isDev = getRequiredEnvVar('DEV');
export const isProd = getRequiredEnvVar('PROD');

export const API_URL = '/api/1056df4ff1b93771e18b562e7edb898a';

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
