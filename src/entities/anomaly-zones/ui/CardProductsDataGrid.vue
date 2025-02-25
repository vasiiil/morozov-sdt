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
		<dx-toolbar>
			<dx-toolbar-item location="before">
				<div class="dx-form-group-caption">Товары</div>
			</dx-toolbar-item>
			<dx-toolbar-item name="exportButton"></dx-toolbar-item>
		</dx-toolbar>

		<dx-column
			data-field="item_id"
			data-type="number"
			caption="Артикул"
			:width="100"
		></dx-column>
		<dx-column
			data-field="barcode"
			data-type="string"
			caption="Штрих-код"
			:width="150"
			:customize-text="barcodeCell"
		></dx-column>
		<dx-column
			data-field="cnt"
			data-type="number"
			caption="Кол-во"
			:format="formatInteger"
			:width="80"
		></dx-column>
		<dx-column
			data-field="photos"
			data-type="string"
			caption="Фото"
			:width="50"
			cell-template="photo-cell"
		></dx-column>
		<dx-column
			data-field="prod_name"
			data-type="string"
			caption="Предполагаемое наименование"
			:width="250"
		></dx-column>
		<dx-column
			data-field="comment"
			data-type="string"
			caption="Комментарий"
			:width="150"
		></dx-column>

		<template #photo-cell="{ data: { data } }">
			<base-button
				styling-mode="outlined"
				icon="image"
				:visible="data.photos.length > 0"
				@click="onPhotoButtonClick(data)"
			></base-button>
		</template>
	</dx-data-grid>
	<product-photos-popup ref="photos"></product-photos-popup>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import {
	DxDataGrid,
	DxColumn,
	DxExport,
	DxPaging,
	DxPager,
	DxScrolling,
	DxToolbar,
	DxItem as DxToolbarItem,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

import { BaseButton } from '@/shared/ui';
import { formatInteger } from '@/shared/lib/utils/formatters';
import type { ICardProductListItem, IListItem } from '../config';
import ProductPhotosPopup from './ProductPhotosPopup.vue';

const { items, anomalyId } = defineProps<{
	items: ICardProductListItem[];
	anomalyId: IListItem['anomaly_id'] | null;
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

function barcodeCell(event: DxDataGridTypes.ColumnCustomizeTextArg) {
	return event.value?.join(', ') ?? event.valueText;
}

const photosRef =
	useTemplateRef<ComponentExposed<typeof ProductPhotosPopup>>('photos');
function onPhotoButtonClick(item: ICardProductListItem) {
	if (anomalyId === null) {
		return;
	}
	photosRef.value?.open(anomalyId, item.photos);
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
				`Anomaly_${anomalyId}_Products_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}
</script>
