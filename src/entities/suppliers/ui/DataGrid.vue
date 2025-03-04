<template>
	<dx-data-grid
		:data-source="dataSource"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		:sync-lookup-filter-values="false"
		:remote-operations="{ paging: true }"
		width="100%"
		height="100%"
		ref="dataGridRef"
		@exporting="onExporting"
		@row-dbl-click="onRowDblClick"
		@toolbar-preparing="onToolbarPreparing"
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
		<dx-sorting mode="none"></dx-sorting>
		<dx-export
			:enabled="true"
			:formats="['xlsx']"
		></dx-export>
		<dx-toolbar>
			<dx-toolbar-item location="before">
				<h4 class="page-title">Поставщики</h4>
			</dx-toolbar-item>
			<dx-toolbar-item
				location="after"
				widget="dxButton"
				:options="addButtonOptions"
			></dx-toolbar-item>
			<dx-toolbar-item name="exportButton"></dx-toolbar-item>
		</dx-toolbar>

		<dx-column
			data-field="supplier_id"
			data-type="number"
			caption="Номер поставщика"
			cell-template="supplier-id-cell"
			:width="200"
		></dx-column>
		<dx-column
			data-field="name"
			data-type="string"
			caption="Наименование"
			:width="300"
		></dx-column>
		<dx-column
			data-field="doc_supplier"
			data-type="string"
			caption="Наименование на документах"
			:width="200"
		></dx-column>
		<dx-column
			data-field="inn"
			data-type="string"
			caption="ИНН"
			:width="200"
		></dx-column>
		<dx-column
			data-field="email"
			data-type="string"
			caption="E-mail"
			:width="200"
		></dx-column>
		<dx-column
			data-field="send_emails"
			data-type="string"
			caption="Доп. email"
			cell-template="send-emails-cell"
			:width="150"
		></dx-column>
		<dx-column
			data-field="print_torg2"
			data-type="boolean"
			caption="Использовать данные для документов"
			:width="150"
		></dx-column>

		<template #supplier-id-cell="{ data: { data } }">
			<a @click.prevent="onSupplierIdClick(data.supplier_id)">
				{{ data.supplier_id }}
			</a>
		</template>
		<template #send-emails-cell="{ data: { data } }">
			<template v-if="data.send_emails">
				<div
					v-for="(email, index) of data.send_emails.split(',')"
					:key="`supplier-${data.supplier_id}-send-email-${index}`"
				>
					{{ email }}
				</div>
			</template>
		</template>
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
	DxSorting,
	DxToolbar,
	DxItem as DxToolbarItem,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import type { DxButtonTypes } from 'devextreme-vue/button';

import DataSource from 'devextreme/data/data_source';

import { useApi } from '../api';
import type { IListItem } from '../config';

const emit = defineEmits<{
	(event: 'editClick', value: IListItem['supplier_id']): void;
	(event: 'addClick'): void;
}>();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const api = useApi();

const items = defineModel<IListItem[]>('items', { required: true });
const dataSource = new DataSource<IListItem, 'supplier_id'>({
	key: 'supplier_id',
	load: async (loadOptions) => {
		const result = await api.getList(
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.skip ?? 0),
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.take ?? 100),
		);
		items.value = result.data;
		return {
			...result,
		};
	},
});

function onRowDblClick(event: DxDataGridTypes.RowDblClickEvent<IListItem>) {
	onSupplierIdClick(event.data.supplier_id);
}
function onSupplierIdClick(supplierId: IListItem['supplier_id']) {
	emit('editClick', supplierId);
}
const addButtonOptions: DxButtonTypes.Properties = {
	icon: 'add',
	text: 'Создать',
	stylingMode: 'outlined',
	onClick: () => {
		emit('addClick');
	},
};

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
				`Suppliers_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}
</script>
