<template>
	<dx-data-grid
		:data-source="store"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		width="100%"
		height="100%"
		ref="dataGridRef"
	>
		<dx-paging :page-size="50"></dx-paging>
		<dx-pager
			:visible="true"
			:display-mode="'full'"
			:show-page-size-selector="true"
			:show-info="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-toolbar>
			<dx-toolbar-item
				location="before"
				widget="dxButton"
				:options="createButtonOptions"
			></dx-toolbar-item>
		</dx-toolbar>

		<dx-column
			data-field="item_id"
			data-type="string"
			caption="Артикул"
			:width="150"
		></dx-column>
		<dx-column
			data-field="name"
			data-type="string"
			caption="Наименование"
			:width="300"
		></dx-column>
		<dx-column
			data-field="quantity"
			data-type="number"
			caption="Кол-во"
			:format="formatInteger"
			:width="150"
		></dx-column>
		<dx-column
			data-field="price"
			data-type="number"
			caption="Цена"
			:format="formatCurrency"
			:width="150"
		></dx-column>
		<dx-column
			data-type="number"
			caption="Сумма"
			:format="formatCurrency"
			:calculate-cell-value="calculateSumCellValue"
			:width="150"
		></dx-column>
		<dx-column
			data-field="weight"
			data-type="number"
			caption="Вес"
			:format="formatInteger"
			:width="150"
		></dx-column>
	</dx-data-grid>
	<product-card ref="card" @added="onItemAdded"></product-card>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import {
	DxDataGrid,
	DxColumn,
	DxPaging,
	DxPager,
	DxScrolling,
	DxToolbar,
	DxItem as DxToolbarItem,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

import { formatCurrency, formatInteger } from '@/shared/lib/utils/formatters';

import type { types } from '../model';
import { ProductCard } from './';
const { items } = defineProps<{
	items: types.IListItem[];
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

function calculateSumCellValue(row: types.IListItem) {
	return row.price * row.quantity;
}

const cardRef = useTemplateRef<ComponentExposed<typeof ProductCard>>('card');
const createButtonOptions = {
	icon: 'plus',
	text: 'Добавить',
	stylingMode: 'outined',
	onClick: () => {
		cardRef.value?.show();
	},
};

function onItemAdded() {
	reloadDataSource();
}
</script>
