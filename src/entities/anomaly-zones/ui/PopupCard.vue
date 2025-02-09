<template>
	<dx-popup
		ref="popup"
		title="Аномалия"
		width="50vw"
		height="70vh"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
		>
			<base-button
				text="Сохранить"
				styling-mode="outlined"
			></base-button>
		</dx-toolbar-item>
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
					<dx-label text="Номер накладной внутренний" />
					<dx-required-rule
						message="Номер накладной обязателен"
					></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="date_create"
					editor-type="dxDateBox"
				>
					<dx-label text="Дата создания" />
				</dx-simple-item>
				<dx-simple-item
					data-field="status"
					editor-type="dxSelectBox"
					:editor-options="statusEditorOptions"
				>
					<dx-label text="Статус" />
				</dx-simple-item>
				<dx-simple-item
					data-field="date_final_status"
					editor-type="dxDateBox"
				>
					<dx-label text="Дата статуса" />
				</dx-simple-item>
				<dx-simple-item data-field="task_id">
					<dx-label text="Номер тикета" />
				</dx-simple-item>
				<dx-simple-item data-field="purpose">
					<dx-label text="Назначение" />
				</dx-simple-item>
			</dx-group-item>
			<dx-group-item caption="Товары">
				<div class="products-data-grid">
					<card-products-data-grid
						:items="productItems"
						ref="productDataGrid"
					></card-products-data-grid>
				</div>
			</dx-group-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
	DxRequiredRule,
} from 'devextreme-vue/form';

import { BaseButton } from '@/shared/ui';
import { useLoader } from '@/shared/lib/use/useLoader';
import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import CardProductsDataGrid from './CardProductsDataGrid.vue';
import { anomalyStatusItems } from '@/entities/anomaly-statuses';
import { useApi } from '../api';
import type { IItem, ICardProductListItem, IListItem } from '../config';

const { startLoading, stopLoading } = useLoader();
const api = useApi();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const productsRef =
	useTemplateRef<ComponentExposed<typeof CardProductsDataGrid>>(
		'productDataGrid',
	);

const form = ref<IItem>();
const {
	array: productItems,
	reset: resetProductItems,
	refresh: refreshProductItems,
} = useReactiveArray<ICardProductListItem>();

async function show(id: IListItem['anomaly_id']) {
	resetProductItems();
	startLoading();
	const item = await api.getItem(id);
	stopLoading();
	if (!item) {
		return;
	}
	form.value = item;
	refreshProductItems(item.items);
	productsRef.value?.reloadDataSource();
	popupRef.value.instance.show();
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
