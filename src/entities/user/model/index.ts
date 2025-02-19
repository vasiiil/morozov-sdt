import { computed, ref, shallowReactive } from 'vue';
import { useLoader } from '@/shared/lib/use/useLoader';
import { useApi } from '../api';
import type { IUser, IProfile, IAuthResponse } from '../config';

function getDefaultUser(): IUser {
	return {
		user_name: '',
		profiles: [],
		active_profile: '',
	};
}

let user = shallowReactive<IUser>(getDefaultUser());
const authenticated = ref<boolean>(false);
export function useUser() {
	function _reset() {
		user = getDefaultUser();
		authenticated.value = false;
	}
	function _prepareAuthResponse(response: IAuthResponse) {
		const profiles: IProfile[] = [];
		for (const auth of response.auth) {
			const id = Object.keys(auth)[0];
			profiles.push({
				id,
				...auth[id],
			});
		}
		user = {
			user_name: profiles[0].name,
			profiles,
			active_profile: profiles[0].id,
		};
	}
	async function _loadUser() {
		try {
			const { loadUser } = useApi();
			const response = await loadUser();
			_prepareAuthResponse(response);
		} catch {
			_reset();
		}
	}

	async function loadUser() {
		const { runWithLoading } = useLoader();
		return await runWithLoading(_loadUser);
	}

	async function login(data: { email: string; password: string }) {
		const { login } = useApi();
		const { runWithLoading } = useLoader();
		return await runWithLoading(async () => {
			const response = await login(data);
			_prepareAuthResponse(response);
		});
	}

	async function logout() {
		const { logout } = useApi();
		logout();
		_reset();
	}

	async function changeProfile(profileId: string) {
		const { changeProfile } = useApi();
		try {
			await changeProfile(profileId);
			return true;
		} catch {
			return false;
		}
	}

	const isAuthenticated = computed(() => authenticated.value);

	return {
		user,
		loadUser,
		login,
		logout,
		changeProfile,
		isAuthenticated,
	};
}
