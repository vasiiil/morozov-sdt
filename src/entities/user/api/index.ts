// import { useApi } from '@/shared/api';
import type { IUser } from '../model';

// const API_URL = '/user';
// const _api = useApi();

async function loadUser(): Promise<IUser> {
	// return _api.get(API_URL);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ name: 'Nikitin Vasya' });
		}, 3000);
	});
}
async function logout() {
	// await _api.post('/logout');
}

export const api = {
	loadUser,
	logout,
};
