<template>
	<dx-data-grid
		:data-source="store"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		width="100%"
		height="auto"
		max-height="320px"
		ref="dataGridRef"
	>
		<dx-paging :page-size="5"></dx-paging>
		<dx-pager
			:visible="true"
			:display-mode="'full'"
			:show-page-size-selector="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>

		<dx-column
			data-field="item_id"
			data-type="number"
			caption="Артикул"
			:width="150"
		></dx-column>
		<dx-column
			data-field="barcode"
			data-type="string"
			caption="Штрих-код"
			:width="200"
			:customize-text="barcodeCell"
		></dx-column>
		<dx-column
			data-field="cnt"
			data-type="number"
			caption="Кол-во"
			:format="formatInteger"
			:width="100"
		></dx-column>
		<dx-column
			data-field="photos"
			data-type="string"
			caption="Фото"
			:width="150"
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
				text="Посмотреть"
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
	DxPaging,
	DxPager,
	DxScrolling,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';

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
	dataGridRef.value.instance.getDataSource().reload();
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
</script>
