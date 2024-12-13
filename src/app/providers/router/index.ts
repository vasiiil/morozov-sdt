import {
	createRouter,
	createWebHistory,
	useRouter,
	useRoute,
} from 'vue-router';

const _router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('@/pages/orders'),
			meta: {
				title: 'SDT Orders',
			},
		},
	],
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_router.afterEach((to, _from) => {
	if (to.meta.title && typeof to.meta.title === 'string') {
		document.title = to.meta.title;
	} else {
		document.title = 'ООО СОЛФЕРИНО (WMS СДТ К2)';
	}
});
_router.beforeEach((to, from, next) => {
	function isAuthenticated() {
		return true;
	}
	const guestDisabled = to.matched.some(
		(record) => record.meta.guestEnabled !== true,
	);
	if (guestDisabled) {
		if (!isAuthenticated()) {
			next({
				name: 'signIn',
				query: { redirectTo: to.fullPath },
			});
			return;
		}
	}
	next();
	return;
});
export const router = _router;
export const globalRouter = {
	router: null,
	route: null,
} as {
	router: null | ReturnType<typeof useRouter>;
	route: null | ReturnType<typeof useRoute>;
};
