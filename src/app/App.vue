<template>
	<dx-load-panel
		:visible="isLoading"
		:show-indicator="true"
		:show-pane="true"
		:shading="true"
		:hide-on-outside-click="false"
		shading-color="rgba(0,0,0,0.4)"
	></dx-load-panel>
	<component v-if="routerReady" :is="layout">
		<router-view></router-view>
	</component>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { locale as dxLocale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';
import DefaultLayout from './layouts/DefaultLayout.vue';
import SimpleLayout from './layouts/SimpleLayout.vue';
import { useLoader } from '@/shared/lib/use/useLoader';

dxLocale('ru');
loadMessages(ruMessages);
const { isLoading } = useLoader();
const router = useRouter();
const route = useRoute();
const routerReady = ref<boolean>(false);
const layout = computed(() => {
	if (route.meta.layout === 'simple') {
		return SimpleLayout;
	}

	return DefaultLayout;
});
onMounted(async () => {
	await router.isReady();
	routerReady.value = true;
});
</script>

<style scoped></style>
