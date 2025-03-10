<template>
	<dx-popup
		ref="dxPopup"
		:title="`Поставка ${id ?? ''}`"
		:wrapper-attr="{ class: 'waybill-popup-card' }"
		width="60vw"
		:height="675"
		max-height="90vh"
		@showing="onShowing"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="resetButtonOptions"
		></dx-toolbar-item>
		<dx-form
			v-model:form-data="form"
			label-mode="outside"
			label-location="top"
			:read-only="true"
			ref="dxForm"
		>
			<dx-tabbed-item :tab-panel-options="tabPanelOptions">
				<dx-tab
					title="Основная информация"
					:col-count="2"
					css-class="tab-item-padding-0"
				>
					<dx-simple-item data-field="type_name">
						<dx-label text="Тип накладной"></dx-label>
					</dx-simple-item>
					<dx-empty-item></dx-empty-item>
					<dx-simple-item data-field="id">
						<dx-label text="Номер накладной"></dx-label>
					</dx-simple-item>
					<dx-simple-item data-field="date_create">
						<dx-label text="Дата создания"></dx-label>
					</dx-simple-item>
					<dx-simple-item
						data-field="status"
						editor-type="dxSelectBox"
						:editor-options="statusEditorOptions"
					>
						<dx-label text="Статус"></dx-label>
					</dx-simple-item>
					<dx-simple-item data-field="date_status">
						<dx-label text="Дата статуса"></dx-label>
					</dx-simple-item>
					<dx-simple-item data-field="date_arrive">
						<dx-label text="Дата прибытия"></dx-label>
					</dx-simple-item>
					<dx-simple-item data-field="date_reception_begin">
						<dx-label text="Дата начала приемки"></dx-label>
					</dx-simple-item>
					<dx-simple-item :col-span="2">
						<div class="card-data-grid">
							<card-products-data-grid
								:items="productItems"
								:doc-id="id"
								ref="productDataGrid"
							></card-products-data-grid>
						</div>
					</dx-simple-item>
				</dx-tab>
				<dx-tab title="Доп. информация">
					<dx-simple-item>
						<div class="card-data-grid card-data-grid__additional">
							<card-additional-data-grid
								:items="additionalItems"
								:doc-id="id"
								:status-name="statusName"
								ref="additionalDataGrid"
							></card-additional-data-grid>
						</div>
					</dx-simple-item>
				</dx-tab>
			</dx-tabbed-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxTabbedItem,
	DxTab,
	DxEmptyItem,
} from 'devextreme-vue/form';
import type { DxButtonTypes } from 'devextreme-vue/button';
import TabPanel, {
	type InitializedEvent as TabPanelInitializedEvent,
} from 'devextreme/ui/tab_panel';

import { useLoader } from '@/shared/lib/use/useLoader';
import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import CardProductsDataGrid from './CardProductsDataGrid.vue';
import CardAdditionalDataGrid from './CardAdditionalDataGrid.vue';
import { useModel } from '../model';
import {
	statuses,
	type IAdditionalListItem,
	type IItem,
	type IListItem,
	type IProductListItem,
} from '../config';

const { getItem } = useModel();
const { startLoading, stopLoading } = useLoader();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const productsRef =
	useTemplateRef<ComponentExposed<typeof CardProductsDataGrid>>(
		'productDataGrid',
	);
const additionalRef =
	useTemplateRef<ComponentExposed<typeof CardAdditionalDataGrid>>(
		'additionalDataGrid',
	);

const id = ref<IListItem['doc_id'] | undefined>();
const form = ref<IItem>();
const { array: productItems, refresh: refreshProductItems } =
	useReactiveArray<IProductListItem>();
const { array: additionalItems, refresh: refreshAdditionalItems } =
	useReactiveArray<IAdditionalListItem>();

async function loadItem() {
	if (!id.value) {
		return;
	}
	startLoading();
	const response = await getItem(id.value!);
	if (response) {
		form.value = response.data;
		refreshAdditionalItems(response.additional);
		refreshProductItems(response.data.items);
	}
	stopLoading();
}
function reloadProductsDataSource() {
	productsRef.value?.reloadDataSource();
}
function reloadAdditionalDataSource() {
	additionalRef.value?.reloadDataSource();
}
async function show(_id: IListItem['doc_id']) {
	id.value = _id;
	await loadItem();
	popupRef.value?.instance.show();
}
function onShowing() {
	reloadProductsDataSource();
	reloadAdditionalDataSource();
	tabPanel.value?.option('selectedIndex', 0);
}
defineExpose({ show });

const resetButtonOptions: DxButtonTypes.Properties = {
	text: 'Обновить',
	stylingMode: 'outlined',
	onClick: async () => {
		if (!id.value) {
			return;
		}
		await loadItem();
		reloadProductsDataSource();
		reloadAdditionalDataSource();
	},
};
const statusEditorOptions = {
	items: statuses,
	displayExpr: 'text',
	valueExpr: 'value',
	value: form.value?.status,
};
const statusName = computed(() => {
	return (
		statuses.find((status) => status.value === form.value?.status)?.text ?? ''
	);
});

const tabPanel = ref<TabPanel>();
const tabPanelOptions = {
	onInitialized: (event: TabPanelInitializedEvent) => {
		tabPanel.value = event.component;
	},
};
</script>

<style lang="scss" scoped>
.card-data-grid {
	padding: 0;
	&__additional {
		padding-top: 8px;
	}
}
</style>
<style lang="scss">
.waybill-popup-card {
	.dx-popup-content {
		padding-bottom: 0;
		.dx-tabpanel-container {
			.dx-item {
				.dx-item-content {
					padding-left: 0;
					padding-right: 0;
				}
				&:not(:first-child) {
					.dx-item-content {
						padding: 0;
					}
				}
			}
		}
	}
}
</style>
