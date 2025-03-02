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
			path: '/login',
			name: 'login',
			component: () => import('@/pages/login'),
			meta: {
				title: 'Логин',
				layout: 'simple',
			},
		},
		{
			path: '/under-construction',
			name: 'underConstruction',
			component: () => import('@/app/layouts/UnderConstruction.vue'),
			meta: {
				title: 'Under Construction',
			},
		},
		{
			path: '/orders',
			name: 'ordersPage',
			component: () => import('@/pages/orders'),
			meta: {
				title: 'Просмотр заказов',
			},
		},
		{
			path: '/anomaly-zones',
			name: 'anomalyZonesPage',
			component: () => import('@/pages/anomaly-zones'),
			meta: {
				title: 'Аномалии',
			},
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: () => import('@/pages/dashboard'),
			meta: {
				title: 'Dashboard',
			},
		},
		{
			path: '/waybills',
			name: 'waybillsPage',
			component: () => import('@/pages/waybills'),
			meta: {
				title: 'Поставки',
			},
		},
		{
			path: '/suppliers',
			name: 'suppliersPage',
			component: () => import('@/pages/suppliers'),
			meta: {
				title: 'Поставщики',
			},
		},
		{
			path: '',
			redirect: '/dashboard',
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
