export const isDev = getRequiredEnvVar('DEV');
export const isProd = getRequiredEnvVar('PROD');

export const API_TOKEN = '1056df4ff1b93771e18b562e7edb898a';
export const API_URL = `/api/${API_TOKEN}`;
export const HOST = isDev
	? getRequiredEnvVar('VITE_API_REAL_URL')
	: document.location.origin;

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
