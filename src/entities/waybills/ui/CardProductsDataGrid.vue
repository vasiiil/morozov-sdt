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
		@exporting="onExporting"
		@toolbar-preparing="onToolbarPreparing"
	>
		<dx-paging :page-size="15"></dx-paging>
		<dx-pager
			:visible="true"
			:display-mode="'full'"
			:show-info="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-export
			:enabled="true"
			:formats="['xlsx']"
		></dx-export>

		<dx-column
			data-field="item_id"
			data-type="number"
			caption="Артикул"
			:width="200"
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
			:width="150"
		></dx-column>
	</dx-data-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
	DxDataGrid,
	DxColumn,
	DxExport,
	DxPaging,
	DxPager,
	DxScrolling,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

import { formatCurrency, formatInteger } from '@/shared/lib/utils/formatters';
import type { IProductListItem, IListItem } from '../config';

const { items, docId } = defineProps<{
	items: IProductListItem[];
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

function onToolbarPreparing(event: DxDataGridTypes.ToolbarPreparingEvent) {
	event.toolbarOptions.items?.forEach((item) => {
		if (item.name === 'exportButton') {
			item.options.text = 'Экспорт';
			item.options.stylingMode = 'outlined';
			item.showText = 'always';
		}
	});
}
function onExporting(event: DxDataGridTypes.ExportingEvent) {
	const workbook = new Workbook();
	const worksheet = workbook.addWorksheet('Sheet 1');

	exportDataGrid({
		component: event.component,
		worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(
				new Blob([buffer], { type: 'application/octet-stream' }),
				`Waybill_${docId}_Products_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}
</script>
