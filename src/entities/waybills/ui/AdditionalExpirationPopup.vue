<template>
	<dx-popup
		ref="dxPopup"
		:title="`Дата производства ${itemId}`"
		:width="500"
		:height="500"
		max-height="90vh"
	>
		<data-grid
			:data-source="items"
			:toolbar-visible="false"
			ref="dataGrid"
		>
			<dx-column
				data-field="qty"
				data-type="number"
				caption="Кол-во товара"
				:format="formatInteger"
				:width="200"
			></dx-column>
			<dx-column
				data-field="date"
				data-type="string"
				caption="Дата"
				:width="150"
			></dx-column>
			<dx-column
				data-field="stock"
				data-type="string"
				caption="Сток"
				:width="100"
			></dx-column>
		</data-grid>
	</dx-popup>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup } from 'devextreme-vue/popup';
import { DxColumn } from 'devextreme-vue/data-grid';

import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import { formatInteger } from '@/shared/lib/utils/formatters';
import { DataGrid } from '@/shared/ui';
import {
	type IAdditionalExpirationListItem,
	type IAdditionalListItem,
} from '../config';

const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const itemId = ref<IAdditionalListItem['item_id']>();
const { array: items, refresh: refreshItems } =
	useReactiveArray<IAdditionalExpirationListItem>();
const dataGridRef =
	useTemplateRef<ComponentExposed<typeof DataGrid>>('dataGrid');

function show(
	_itemId: IAdditionalListItem['item_id'],
	expiration: IAdditionalExpirationListItem[],
) {
	itemId.value = _itemId;
	refreshItems(expiration);
	dataGridRef.value?.reloadDataSource();
	popupRef.value?.instance.show();
}
defineExpose({ show });
</script>

<style lang="scss" scoped></style>
