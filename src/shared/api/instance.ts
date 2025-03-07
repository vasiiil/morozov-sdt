import axios from 'axios';
import { API_URL } from '../config';
import { showError } from '../lib/utils/notifications';
import { globalRouter } from '@/app/providers';

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
	async (response) => {
		if (response.data.success) {
			return Promise.resolve(response);
		}
		if (response.data.code === 440) {
			await globalRouter.router?.push({
				name: 'login',
				query: { redirect: globalRouter.route?.fullPath },
			});
			return Promise.reject(response);
		}
		if (response.config.url === '/auth') {
			switch (response.data.code) {
				case 400:
					response.data.comment = 'Некорректные данные авторизации';
					break;
				case 401:
					response.data.comment = 'Пользователь не активен';
					break;
				case 402:
					response.data.comment = 'Нет данных о партнере';
					break;
			}
		}
		if (response.config.responseType === 'blob') {
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
