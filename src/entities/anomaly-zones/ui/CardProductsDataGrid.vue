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
			:width="300"
			:customize-text="barcodeCell"
		></dx-column>
		<dx-column
			data-field="cnt"
			data-type="number"
			caption="Кол-во"
			:format="formatInteger"
			:width="150"
		></dx-column>
		<dx-column
			data-field="prod_name"
			data-type="string"
			caption="Предполагаемое наименование"
			:width="150"
		></dx-column>
		<dx-column
			data-field="comment"
			data-type="string"
			caption="Комментарий"
			:width="150"
		></dx-column>
		<dx-column
			data-field="photos"
			data-type="string"
			caption="Фото"
			:width="300"
			cell-template="photo-cell"
		></dx-column>

		<template #photo-cell="{ data: { data } }">
			<dx-button
				styling-mode="outlined"
				text="Посмотреть"
				@click="onPhotoButtonClick(data.item_id)"
			/>
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
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { DxButton } from 'devextreme-vue/button';

import { formatInteger } from '@/shared/lib/utils/formatters';
import type { ICardProductListItem } from '../config';

const { items } = defineProps<{
	items: ICardProductListItem[];
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

function onPhotoButtonClick(itemId: ICardProductListItem['item_id']) {
	console.log('onPhotoButtonClick', itemId);

}
</script>
