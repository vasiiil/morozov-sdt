<template>
	<div class="page-wrapper page">
		<h2 class="page-title">Anomaly Zones</h2>
		<div class="page-data-table">
			<data-grid @edit-click="onEditClick"></data-grid>
			<popup-card ref="card"></popup-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DataGrid, PopupCard } from '@/entities/anomaly-zones';
import type { IAnomalyZoneListItem } from '@/entities/anomaly-zones';

const cardRef = useTemplateRef<ComponentExposed<typeof PopupCard>>('card');
function onEditClick(orderId: IAnomalyZoneListItem['anomaly_id']) {
	cardRef.value?.show(orderId);
}
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
