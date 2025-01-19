<template>
	<div class="page-wrapper page">
		<h2 class="page-title">Anomaly Zones</h2>
		<div class="page-data-table">
			<data-grid></data-grid>
		</div>
	</div>
</template>

<script setup lang="ts">
// import { useTemplateRef } from 'vue';
// import type { ComponentExposed } from 'vue-component-type-helpers';
import { DataGrid } from '@/entities/anomaly-zones';

// const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');
// function onEditClick(orderId: OrderTypes.TOrderId) {
// 	cardRef.value?.show(orderId);
// }
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px calc(100% - 40px - 10px);
	gap: 10px;

	&-data-table {
		overflow: hidden;
	}
}
</style>
