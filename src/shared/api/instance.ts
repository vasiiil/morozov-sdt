import axios from 'axios';
import { API_URL } from '../config';
import { showError } from '../lib/utils/notifications';

const _instance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json',
	},
});
_instance.interceptors.request.use(
	(config) => {
		// todo set locale from useLocale
		// config.headers['Accept-Language'] = locale;

		return config;
	},
	(error) => {
		Promise.reject(error);
	},
);
_instance.interceptors.response.use(
	(response) => {
		if (response.data.success) {
			return Promise.resolve(response);
		}
		if (response.data.comment) {
			showError(response.data.comment);
		}
		return Promise.reject(response);
	},
	async (error) => {
		if (error.response.status === 401) {
			// const { setLogedOut } = useUser();
			// await setLogedOut();
			return Promise.reject(error);
		}
		if (error.response.status === 403) {
			// const { setLogedOut } = useUser();
			// await setLogedOut('forbidden');
			return Promise.reject(error);
		}
	},
);

export default _instance;
