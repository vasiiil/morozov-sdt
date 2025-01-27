<template>
	<div class="page-wrapper page">
		<div class="buttons-wrapper">
			<base-button
				text="Создать"
				icon="add"
				styling-mode="text"
				icon-circle-border
			/>
			<base-button
				text="Импорт"
				icon="arrowdown"
				styling-mode="text"
				icon-circle-border
			/>
			<base-button
				text="Экспорт"
				icon="arrowup"
				styling-mode="text"
				icon-circle-border
			/>
			<base-button
				text="Отмена"
				icon="close"
				styling-mode="text"
				icon-circle-border
			/>
		</div>
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
import { BaseButton } from '@/shared/ui';

const cardRef = useTemplateRef<ComponentExposed<typeof PopupCard>>('card');
function onEditClick(orderId: IAnomalyZoneListItem['anomaly_id']) {
	cardRef.value?.show(orderId);
}
</script>

<style lang="scss" scoped>
$buttons-height: 34px;
.page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: $buttons-height calc(100% - $buttons-height - 10px);
	gap: 10px;

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
