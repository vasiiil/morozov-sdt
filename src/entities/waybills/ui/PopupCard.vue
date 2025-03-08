<template>
	<dx-popup
		ref="dxPopup"
		:title="`Поставка ${id ?? ''}`"
		:wrapper-attr="{ class: 'waybill-popup-card' }"
		width="60vw"
		:height="675"
		max-height="90vh"
		@hidden="onHidden"
		@showing="onShowing"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="resetButtonOptions"
		></dx-toolbar-item>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
			widget="dxButton"
			:options="saveButtonOptions"
		></dx-toolbar-item>
		<dx-form
			v-model:form-data="form"
			label-mode="outside"
			label-location="top"
			ref="dxForm"
		>
			<dx-tabbed-item :tab-panel-options="tabPanelOptions">
				<dx-tab
					title="Основная информация"
					:col-count="2"
					css-class="tab-item-padding-0"
				>
					<dx-simple-item
						data-field="type_id"
						editor-type="dxSelectBox"
						:editor-options="typeIdEditorOptions"
					>
						<dx-label text="Тип накладной"></dx-label>
					</dx-simple-item>
					<dx-empty-item></dx-empty-item>
					<dx-simple-item data-field="id">
						<dx-label text="Номер накладной"></dx-label>
					</dx-simple-item>
					<dx-simple-item
						data-field="date_create"
						editor-type="dxDateBox"
						:editor-options="dateEditorOptions"
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
						data-field="date_status"
						editor-type="dxDateBox"
						:editor-options="dateEditorOptions"
					>
						<dx-label text="Дата статуса"></dx-label>
					</dx-simple-item>
					<dx-simple-item
						data-field="date_arrive"
						editor-type="dxDateBox"
						:editor-options="dateEditorOptions"
					>
						<dx-label text="Дата прибытия"></dx-label>
					</dx-simple-item>
					<dx-simple-item
						data-field="date_reception_begin"
						editor-type="dxDateBox"
						:editor-options="dateEditorOptions"
					>
						<dx-label text="Дата начала приемки"></dx-label>
					</dx-simple-item>
				</dx-tab>
				<dx-tab title="Товары">
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
import { ref, useTemplateRef } from 'vue';
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
import type { DxButton, DxButtonTypes } from 'devextreme-vue/button';
import type { DxSelectBoxTypes } from 'devextreme-vue/select-box';
import TabPanel, {
	type InitializedEvent as TabPanelInitializedEvent,
} from 'devextreme/ui/tab_panel';

import { useLoader } from '@/shared/lib/use/useLoader';
import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import { showSuccess } from '@/shared/lib/utils/notifications';
import CardProductsDataGrid from './CardProductsDataGrid.vue';
import CardAdditionalDataGrid from './CardAdditionalDataGrid.vue';
import { useModel } from '../model';
import {
	getDefaultForm,
	statuses,
	types,
	type IAdditionalListItem,
	type IItem,
	type IListItem,
	type IProductListItem,
	type TType,
} from '../config';

const emit = defineEmits<{
	(event: 'hidden', afterSave: boolean): void;
}>();

const { getItem } = useModel();
const {
	value: saved,
	setTrue: setSaved,
	setFalse: clearSaved,
} = useBoolean(false);
const { startLoading, stopLoading } = useLoader();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const formRef = useTemplateRef<InstanceType<typeof DxForm>>('dxForm');
const productsRef =
	useTemplateRef<ComponentExposed<typeof CardProductsDataGrid>>(
		'productDataGrid',
	);
const additionalRef =
	useTemplateRef<ComponentExposed<typeof CardAdditionalDataGrid>>(
		'additionalDataGrid',
	);

const id = ref<IListItem['doc_id'] | undefined>();
const form = ref<IItem>(getDefaultForm());
const {
	array: productItems,
	reset: resetProductItems,
	refresh: refreshProductItems,
} = useReactiveArray<IProductListItem>();
const {
	array: additionalItems,
	reset: resetAdditionalItems,
	refresh: refreshAdditionalItems,
} = useReactiveArray<IAdditionalListItem>();

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
async function show(_id?: IListItem['doc_id']) {
	id.value = _id;
	clearSaved();
	await loadItem();
	popupRef.value?.instance.show();
}
function onShowing() {
	setResetButtonText();
	reloadProductsDataSource();
	reloadAdditionalDataSource();
	tabPanel.value?.option('selectedIndex', 0);
}
function onHidden() {
	emit('hidden', saved.value);
	if (saved.value || !!id.value) {
		form.value = getDefaultForm();
		resetProductItems();
		resetAdditionalItems();
	}
	resetForm();
}
async function resetForm() {
	formRef.value?.instance.reset(form.value);
}
defineExpose({ show });

const saveButtonOptions = {
	text: 'Сохранить',
	stylingMode: 'outlined',
	onClick: async () => {
		const validation = formRef.value?.instance.validate();
		if (!validation?.isValid) {
			return;
		}

		// const body: Record<string, string | number> = {
		// name: form.value.name,
		// password: form.value.password,
		// doc_supplier: form.value.doc_supplier,
		// print_torg2: form.value.print_torg2 ? 1 : 0,
		// send_emails: form.value.send_emails.join(','),
		// };
		// const result = await saveItem(body, id.value);
		const result = false;
		if (result) {
			setSaved();
			id.value = result;
			showSuccess('Сохранено');
			close();
		}
	},
};

const resetButtonInstance = ref<InstanceType<(typeof DxButton)['instance']>>();
function setResetButtonText() {
	resetButtonInstance.value?.option('text', id.value ? 'Обновить' : 'Сбросить');
}
const resetButtonOptions: DxButtonTypes.Properties = {
	text: 'Сбросить',
	stylingMode: 'outlined',
	onInitialized: (event: DxButtonTypes.InitializedEvent) => {
		if (event.component) {
			resetButtonInstance.value = event.component;
			setResetButtonText();
		}
	},
	onClick: async () => {
		if (id.value) {
			await loadItem();
		} else {
			form.value = getDefaultForm();
			resetProductItems();
			resetAdditionalItems();
		}
		reloadProductsDataSource();
		reloadAdditionalDataSource();
		resetForm();
	},
};

const dateEditorOptions = {
	type: 'datetime',
};
function getStatusesByTypeId(typeId: TType) {
	return statuses.filter((item) => item.type_id === typeId);
}
const statusEditorOptions = {
	items: getStatusesByTypeId(form.value.type_id),
	displayExpr: 'text',
	valueExpr: 'value',
	value: form.value.status,
};

const typeIdEditorOptions = {
	items: Object.entries(types).map((item) => ({
		value: +item[0],
		text: item[1],
	})),
	displayExpr: 'text',
	valueExpr: 'value',
	value: form.value.type_id,
	onValueChanged: (event: DxSelectBoxTypes.ValueChangedEvent) => {
		formRef.value?.instance.updateData('status', null);
		formRef.value?.instance
			.getEditor('status')
			?.option('items', getStatusesByTypeId(event.value));
	},
};

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
