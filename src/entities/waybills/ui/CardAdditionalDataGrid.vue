<template>
	<dx-data-grid
		:data-source="store"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		:element-attr="{ style: 'max-height: 490px;' }"
		width="100%"
		height="100%"
		ref="dataGridRef"
	>
		<dx-paging :page-size="15"></dx-paging>
		<dx-pager
			:visible="true"
			:display-mode="'full'"
			:show-info="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>

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
			<a v-if="!!data.serial_numbers" @click.prevent="onSerialNumbersClick(data.serial_numbers)">
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #expiration-cell="{ data: { data } }">
			<a v-if="!!data.expiration" @click.prevent="onExpirationClick(data.expiration)">
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #marks-cell="{ data: { data } }">
			<a v-if="!!data.marks" @click.prevent="onMarksClick(data.marks)">
				Да
			</a>
			<span v-else>Нет</span>
		</template>
	</dx-data-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
	DxDataGrid,
	DxColumn,
	DxPaging,
	DxPager,
	DxScrolling,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

import { formatInteger } from '@/shared/lib/utils/formatters';
import type { IAdditionalListItem, IListItem } from '../config';

const { items } = defineProps<{
	items: IAdditionalListItem[];
	docId: IListItem['doc_id'] | undefined;
}>();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const store = new CustomStore({
	key: 'item_id',
	loadMode: 'raw',
	load: () => items,
});
function reloadDataSource() {
	dataGridRef.value?.instance.getDataSource().reload();
}
defineExpose({ reloadDataSource });

function onSerialNumbersClick(serialNumbers: IAdditionalListItem['serial_numbers']) {
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
