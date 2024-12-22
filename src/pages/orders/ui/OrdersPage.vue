<template>
	<div class="orders-page">
		<h2 class="page-title orders-page-title">Orders Page</h2>
		<div class="orders-page-data-table">
			<data-grid @edit-click="onEditClick"></data-grid>
			<order-card ref="card"></order-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DataGrid, OrderCard } from './';
import type { OrderTypes } from '@/entities/order';

const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');
function onEditClick(orderId: OrderTypes.TOrderId) {
	cardRef.value?.show(orderId);
}
</script>

<style lang="scss" scoped>
.orders-page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px calc(100% - 40px);
	&-toolbar {
		.start-icons-container {
			display: flex;
			gap: 8px;
		}
	}

	&-data-table {
		overflow: hidden;
	}
}
</style>
