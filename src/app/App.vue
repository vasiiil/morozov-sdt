<template>
	<dx-load-panel
		:visible="isLoading"
		:show-indicator="true"
		:show-pane="true"
		:shading="true"
		:hide-on-outside-click="false"
		shading-color="rgba(0,0,0,0.4)"
	></dx-load-panel>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { locale as dxLocale, loadMessages } from 'devextreme/localization';
import ruMessages from 'devextreme/localization/messages/ru.json';
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useLoader } from '@/shared/lib/use/useLoader';

dxLocale('ru');
loadMessages(ruMessages);
const { isLoading } = useLoader();
</script>

<style scoped></style>
