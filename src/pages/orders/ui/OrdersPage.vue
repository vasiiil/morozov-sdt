<template>
	<div class="orders-page">
		<div class="buttons-wrapper">
			<base-button
				text="Создать"
				icon="add"
				styling-mode="text"
				icon-circle-border
				:border-radius="0"
			></base-button>
			<base-button
				text="Импорт"
				icon="arrowdown"
				styling-mode="text"
				icon-circle-border
				:border-radius="0"
			></base-button>
			<base-button
				text="Экспорт"
				icon="arrowup"
				styling-mode="text"
				icon-circle-border
				:border-radius="0"
			></base-button>
			<base-button
				text="Отмена"
				icon="close"
				styling-mode="text"
				icon-circle-border
				:border-radius="0"
			></base-button>
		</div>
		<div class="orders-page-data-table">
			<data-grid @edit-click="onEditClick"></data-grid>
			<order-card ref="card"></order-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import type { OrderTypes } from '@/entities/order';
import { BaseButton } from '@/shared/ui';
import { DataGrid, OrderCard } from './';

const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');
function onEditClick(orderId: OrderTypes.TOrderId) {
	cardRef.value?.show(orderId);
}
</script>

<style lang="scss" scoped>
$buttons-height: 34px;
.orders-page {
	width: 100%;
	height: 100%;
	display: grid;
	gap: 10px;
	grid-template-rows: $buttons-height calc(100% - $buttons-height - 10px);

	&-data-table {
		overflow: hidden;
	}
	.buttons-wrapper {
		justify-self: center;
		border: 1px solid var(--color-text);
		border-radius: calc($buttons-height / 2);
		overflow: hidden;
	}
}
</style>
