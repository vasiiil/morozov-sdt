<template>
	<dx-popup
		ref="dxPopup"
		:title="`Аномалия ${id}`"
		width="60vw"
		:height="620"
		max-height="80vh"
		@hidden="onHidden"
	>
		<dx-form
			v-model:form-data="form"
			:read-only="true"
			label-mode="outside"
			label-location="top"
		>
			<dx-group-item
				caption="Основная информация"
				:col-count="2"
			>
				<dx-simple-item data-field="doc_id">
					<dx-label text="Номер накладной внутренний"></dx-label>
				</dx-simple-item>
				<dx-simple-item
					data-field="date_create"
					editor-type="dxDateBox"
				>
					<dx-label text="Дата создания"></dx-label>
				</dx-simple-item>
				<dx-simple-item
					data-field="status"
					editor-type="dxSelectBox"
					:editor-options="statusEditorOptions"
				>
					<dx-label text="Статус"></dx-label>
				</dx-simple-item>
				<dx-simple-item
					data-field="date_final_status"
					editor-type="dxDateBox"
				>
					<dx-label text="Дата статуса"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="task_id">
					<dx-label text="Номер тикета"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="purpose">
					<dx-label text="Назначение"></dx-label>
				</dx-simple-item>
				<dx-simple-item :col-span="2">
					<div class="products-data-grid">
						<card-products-data-grid
							:items="productItems"
							:anomaly-id="id"
							ref="productDataGrid"
						></card-products-data-grid>
					</div>
				</dx-simple-item>
			</dx-group-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup } from 'devextreme-vue/popup';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
} from 'devextreme-vue/form';

import { useLoader } from '@/shared/lib/use/useLoader';
import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import CardProductsDataGrid from './CardProductsDataGrid.vue';
import { anomalyStatusItems } from '@/entities/anomaly-statuses';
import { useApi } from '../api';
import type { IItem, ICardProductListItem, IListItem } from '../config';

const { startLoading, stopLoading } = useLoader();
const api = useApi();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const productsRef =
	useTemplateRef<ComponentExposed<typeof CardProductsDataGrid>>(
		'productDataGrid',
	);

const id = ref<IListItem['anomaly_id'] | null>(null);
const form = ref<IItem>();
const {
	array: productItems,
	reset: resetProductItems,
	refresh: refreshProductItems,
} = useReactiveArray<ICardProductListItem>();

async function show(_id: IListItem['anomaly_id']) {
	id.value = _id;
	startLoading();
	const item = await api.getItem(id.value!);
	stopLoading();
	if (item) {
		form.value = item;
		refreshProductItems(item.items);
		productsRef.value?.reloadDataSource();
	}
	popupRef.value?.instance.show();
}
function onHidden() {
	resetProductItems();
	productsRef.value?.reloadDataSource();
	form.value = {
		doc_id: null,
		date_create: null,
		date_final_status: null,
		task_id: null,
		status: null,
		purpose: null,
		wb_box: null,
		items: [],
	};
}
defineExpose({ show });

const statusEditorOptions = {
	items: anomalyStatusItems,
	displayExpr: 'name',
	valueExpr: 'id',
	value: form.value?.status,
};
</script>

<style lang="scss" scoped>
.products-data-grid {
	padding: 0 !important;
}
</style>
