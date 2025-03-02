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
				location="after"
				widget="dxButton"
				:options="addButtonOptions"
			></dx-toolbar-item>
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
	DxToolbar,
	DxItem as DxToolbarItem,
} from 'devextreme-vue/data-grid';
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

const dataSource = new DataSource<IListItem, 'supplier_id'>({
	key: 'supplier_id',
	load: async (loadOptions) => {
		const result = await api.getList(
			loadOptions.skip ?? 0,
			loadOptions.take ?? 100,
		);
		return {
			...result,
		};
	},
});

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
</script>
