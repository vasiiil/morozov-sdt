<template>
	<div class="page-container">
		<data-grid @edit-click="onEditClick" @add-click="onAddClick"></data-grid>
		<popup-card ref="card"></popup-card>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

import { DataGrid, PopupCard, type IListItem } from '@/entities/suppliers';

const cardRef = useTemplateRef<ComponentExposed<typeof PopupCard>>('card');
function onEditClick(id: IListItem['supplier_id']) {
	cardRef.value?.show(id);
}
function onAddClick() {
	cardRef.value?.show();
}
</script>

<style lang="scss" scoped>
.page-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
