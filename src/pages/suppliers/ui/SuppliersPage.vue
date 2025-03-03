<template>
	<div class="page-container">
		<data-grid
			v-model:items="items"
			ref="dataGridRef"
			@edit-click="onEditClick"
			@add-click="onAddClick"
		></data-grid>
		<popup-card
			:items="items"
			ref="card"
			@hidden="onCardHidden"
		></popup-card>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

import { DataGrid, PopupCard, type IListItem } from '@/entities/suppliers';

const items = ref<IListItem[]>([]);
const cardRef = useTemplateRef<ComponentExposed<typeof PopupCard>>('card');
const dataGridRef =
	useTemplateRef<ComponentExposed<typeof DataGrid>>('dataGridRef');
function onEditClick(id: IListItem['supplier_id']) {
	cardRef.value?.show(id);
}
function onAddClick() {
	cardRef.value?.show();
}
function onCardHidden(afterSave: boolean) {
	if (afterSave) {
		dataGridRef.value?.reloadDataSource();
	}
}
</script>

<style lang="scss" scoped>
.page-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
