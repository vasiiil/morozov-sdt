<template>
	<dx-load-panel
		:visible="isLoading"
		:show-indicator="true"
		:show-pane="true"
		:shading="true"
		:hide-on-outside-click="false"
		shading-color="rgba(0,0,0,0.4)"
	></dx-load-panel>
	<base-confirm ref="confirm"></base-confirm>
	<component
		v-if="userLoaded"
		:is="layout"
	>
		<router-view></router-view>
	</component>
</template>

<script setup lang="ts">
import {
	computed,
	onBeforeMount,
	onMounted,
	ref,
	useTemplateRef,
	type Ref,
} from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { locale as dxLocale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';

import { BaseConfirm } from '@/shared/ui';
import { setComponent } from '@/shared/lib/utils/confirm';
import { useLoader } from '@/shared/lib/use/useLoader';
import { isMaya } from '@/shared/config';
import { useUser } from '@/entities/user';

import DefaultLayout from './layouts/DefaultLayout.vue';
import SimpleLayout from './layouts/SimpleLayout.vue';
import { globalRouter } from './providers';

dxLocale('ru');
loadMessages(ruMessages);
const { isLoading } = useLoader();
const router = useRouter();
const route = useRoute();
const userLoaded = ref<boolean>(false);
const confirmRef = useTemplateRef<ComponentExposed<typeof BaseConfirm>>(
	'confirm',
) as Ref<ComponentExposed<typeof BaseConfirm>>;
const layout = computed(() => {
	if (!userLoaded.value || route.meta.layout === 'simple') {
		return SimpleLayout;
	}

	return DefaultLayout;
});
async function loadUser() {
	const { loadUser } = useUser();
	await loadUser();
}
onBeforeMount(async () => {
	await router.isReady();
	globalRouter.router = router;
	globalRouter.route = route;
	if (route.name !== 'login') {
		await loadUser();
	}
	userLoaded.value = true;
});
onMounted(async () => {
	setComponent(confirmRef.value);

	if (isMaya) {
		const mayaFavicon = '/favicon-maya.ico';
		let link =
			document?.head.querySelector<HTMLLinkElement>(`link[rel*="icon"]`);
		if (!link) {
			link = document?.createElement('link');
			if (link) {
				link.rel = 'icon';
				link.href = mayaFavicon;
				link.type = `image/ico`;
				document?.head.append(link);
			}
		} else {
			link.href = mayaFavicon;
		}
	}

	document.addEventListener('click', function (event: MouseEvent) {
		const target = event.target as HTMLSpanElement;
		if (!target || !target.classList.contains('copy-to-clipboard')) {
			return;
		}
		if (!document.createRange || !window.getSelection) {
			return;
		}
		const range = document.createRange();
		range.selectNode(target);
		const selection = window.getSelection();
		if (!selection) {
			return;
		}
		selection.removeAllRanges();
		selection.addRange(range);
	});
});
</script>

<style scoped></style>
