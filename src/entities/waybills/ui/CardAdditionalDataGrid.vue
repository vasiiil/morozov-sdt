<template>
	<data-grid
		:data-source="store"
		:max-height="490"
		:page-size="15"
		:templates="['serial-numbers-cell', 'expiration-cell', 'marks-cell']"
		ref="dataGridRef"
	>
		<dx-column
			data-field="item_id"
			data-type="number"
			caption="Артикул"
			:width="200"
		></dx-column>
		<dx-column
			data-field="qty_orig"
			data-type="number"
			caption="Кол-во плановое"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty"
			data-type="number"
			caption="Кол-во (сток А)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty_defect"
			data-type="number"
			caption="Кол-во (Брак)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty_b"
			data-type="number"
			caption="Кол-во (сток Б)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="serial_numbers"
			data-type="string"
			caption="Серийный номер"
			:width="150"
			cell-template="serial-numbers-cell"
		></dx-column>
		<dx-column
			data-field="expiration"
			data-type="string"
			caption="Дата производства"
			:width="150"
			cell-template="expiration-cell"
		></dx-column>
		<dx-column
			data-field="marks"
			data-type="string"
			caption="Марки"
			:width="150"
			cell-template="marks-cell"
		></dx-column>

		<template #serial-numbers-cell="{ data: { data } }">
			<a
				v-if="!!data.serial_numbers"
				@click.prevent="onSerialNumbersClick(data.serial_numbers)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #expiration-cell="{ data: { data } }">
			<a
				v-if="!!data.expiration"
				@click.prevent="onExpirationClick(data.expiration)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #marks-cell="{ data: { data } }">
			<a
				v-if="!!data.marks"
				@click.prevent="onMarksClick(data.marks)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
	</data-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxColumn } from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

import { formatInteger } from '@/shared/lib/utils/formatters';
import { DataGrid } from '@/shared/ui';
import type { IAdditionalListItem, IListItem } from '../config';

const { items } = defineProps<{
	items: IAdditionalListItem[];
	docId: IListItem['doc_id'] | undefined;
}>();
const dataGridRef = ref<ComponentExposed<typeof DataGrid>>();
const store = new CustomStore({
	key: 'item_id',
	loadMode: 'raw',
	load: () => items,
});
function reloadDataSource() {
	dataGridRef.value?.reloadDataSource();
}
defineExpose({ reloadDataSource });

function onSerialNumbersClick(
	serialNumbers: IAdditionalListItem['serial_numbers'],
) {
	if (!serialNumbers) {
		return;
	}
	console.log('onSerialNumbersClick', serialNumbers);
}
function onExpirationClick(expiration: IAdditionalListItem['expiration']) {
	if (!expiration) {
		return;
	}
	console.log('onExpirationClick', expiration);
}
function onMarksClick(marks: IAdditionalListItem['marks']) {
	if (!marks) {
		return;
	}
	console.log('onMarksClick', marks);
}
</script>
