import { useApi as _useApi } from '@/shared/api';
import type { IAuthResponse, IProfile } from '../config';

export function useApi() {
	const api = _useApi();
	async function loadUser() {
		return api.get<IAuthResponse>('/auth');
	}
	async function login(data: { email: string; password: string }) {
		return await api.post<IAuthResponse>('/auth', data);
	}
	async function changeProfile(profileId: IProfile['id']) {
		return api.post('/changeauth', { id: profileId });
	}
	async function logout() {
		// await _api.post('/logout');
	}

	return {
		loadUser,
		login,
		logout,
		changeProfile,
	};
}
