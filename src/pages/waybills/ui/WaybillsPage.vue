<template>
	<div class="page-container">
		<data-grid
			ref="dataGridRef"
			@edit-click="onEditClick"
			@add-click="onAddClick"
		></data-grid>
		<popup-card
			ref="card"
		></popup-card>
		<create-popup-card
			ref="createCard"
			@hidden="onCardHidden"
		></create-popup-card>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

import { DataGrid, PopupCard, CreatePopupCard, type IListItem } from '@/entities/waybills';

const cardRef = useTemplateRef<ComponentExposed<typeof PopupCard>>('card');
const createCardRef = useTemplateRef<ComponentExposed<typeof CreatePopupCard>>('createCard');
const dataGridRef =
	useTemplateRef<ComponentExposed<typeof DataGrid>>('dataGridRef');
function onEditClick(docId: IListItem['doc_id']) {
	cardRef.value?.show(docId);
}
function onAddClick() {
	createCardRef.value?.show();
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
