<template>
	<data-grid
		:data-source="store"
		:max-height="490"
		:page-size="15"
		:pager-visible="false"
		:grid-title="`Товары (${items.length})`"
		export-enabled
		ref="dataGridRef"
	>
		<dx-column
			data-field="item_id"
			data-type="string"
			caption="Артикул"
			:width="130"
		></dx-column>
		<dx-column
			data-field="name"
			data-type="string"
			caption="Наименование"
			:width="300"
		></dx-column>
		<dx-column
			data-field="price_nds"
			data-type="number"
			caption="Цена"
			:format="formatCurrency"
			:width="120"
		></dx-column>
		<dx-column
			data-field="quantity"
			data-type="number"
			caption="Кол-во"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="order_id"
			data-type="string"
			caption="Заказ"
			:width="120"
		></dx-column>
	</data-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxColumn } from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

import { formatCurrency, formatInteger } from '@/shared/lib/utils/formatters';
import { DataGrid } from '@/shared/ui';
import type { IProductListItem } from '../config';

const { items } = defineProps<{
	items: IProductListItem[];
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
</script>
