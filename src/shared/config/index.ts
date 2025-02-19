export const isDev = getRequiredEnvVar('DEV');
export const isProd = getRequiredEnvVar('PROD');

export const isMaya = document.location.origin === 'wms-maya.ru';
export const API_HOST = isDev
	? getRequiredEnvVar('VITE_API_URL')
	: '';
export const API_URL = `/api`;

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
