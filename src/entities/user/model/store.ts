import { computed, ref, shallowReactive } from 'vue';
import { useLoader } from '@/shared/lib/use/useLoader';
import { api } from '../api';
import type { IUser } from './types';

function getDefaultUser(): IUser {
	return {
		name: 'Anonimous',
	};
}

let user = shallowReactive<IUser>(getDefaultUser());
const authenticated = ref<boolean>(false);
export function useUser() {
	function _reset() {
		user = getDefaultUser();
		authenticated.value = false;
	}
	async function _loadUser() {
		try {
			const response = await api.loadUser();
			user = response;
		} catch {
			_reset();
		}
	}

	async function loadUser() {
		const { runWithLoading } = useLoader();
		return await runWithLoading(_loadUser);
	}

	async function logout() {
		api.logout();
		authenticated.value = false;
	}

	const isAuthenticated = computed(() => authenticated.value);

	return {
		user,
		loadUser,
		logout,
		isAuthenticated,
	};
}
