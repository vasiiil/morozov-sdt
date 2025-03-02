<template>
	<div class="page-container">
		<data-grid @edit-click="onEditClick"></data-grid>
		<!-- <order-card ref="card"></order-card> -->
	</div>
</template>

<script setup lang="ts">
// import { useTemplateRef } from 'vue';
// import type { ComponentExposed } from 'vue-component-type-helpers';

import { DataGrid, type IListItem } from '@/entities/waybills';
// import OrderCard from './OrderCard.vue';

// const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');
function onEditClick(docId: IListItem['id']) {
	console.log('wqqeqwe', docId);
	// cardRef.value?.show(orderId);
}
</script>

<style lang="scss" scoped>
.page-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>
