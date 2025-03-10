<template>
	<dx-popup
		ref="dxPopup"
		title="Поставка"
		:wrapper-attr="{ class: 'waybill-popup-card' }"
		width="60vw"
		:height="625"
		max-height="80vh"
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
			:show-validation-summary="true"
			label-mode="outside"
			label-location="top"
			ref="dxForm"
		>
			<dx-group-item
				caption="Основная информация"
				:col-count="2"
			>
				<dx-simple-item data-field="id">
					<dx-label text="Номер накладной"></dx-label>
					<dx-required-rule
						message="Не заполнено поле Номер накладной"
					></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="date"
					:editor-options="dateEditorOptions"
				>
					<dx-label text="Плановая дата поставки"></dx-label>
					<dx-required-rule
						message="Не заполнено поле Плановая дата поставки"
					></dx-required-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="supplier_id"
					editor-type="dxNumberBox"
				>
					<dx-label text="Поставщик"></dx-label>
				</dx-simple-item>
				<dx-simple-item data-field="comment">
					<dx-label text="Комментарий"></dx-label>
				</dx-simple-item>
				<dx-simple-item :col-span="2">
					<div class="products-data-grid">
						<data-grid
							:data-source="form.items"
							grid-title="Товары"
							add-button-text="Добавить"
							add-enabled
							delete-enabled
							ref="productsDataGrid"
							@add-click="onAddProductClick"
						>
							<dx-column
								data-field="item_id"
								data-type="string"
								caption="Артикул"
								:width="200"
							></dx-column>
							<dx-column
								data-field="name"
								data-type="string"
								caption="Наименование"
								:width="300"
							></dx-column>
							<dx-column
								data-field="price"
								data-type="number"
								caption="Цена"
								:format="formatCurrency"
								:width="120"
							></dx-column>
							<dx-column
								data-field="quantity"
								data-type="number"
								caption="Кол-во"
								:format="formatInteger"
								:width="120"
							></dx-column>
							<dx-column
								data-field="sum"
								data-type="number"
								caption="Сумма"
								:format="formatCurrency"
								:width="120"
							></dx-column>
						</data-grid>
						<product-popup-card
							ref="productCard"
							@add="onAddProduct"
						></product-popup-card>
					</div>
				</dx-simple-item>
			</dx-group-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import { DxColumn } from 'devextreme-vue/data-grid';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
	DxRequiredRule,
} from 'devextreme-vue/form';
import type { DxButtonTypes } from 'devextreme-vue/button';

import type { TPrimitiveRecord } from '@/shared/lib/types/object';
import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { formatCurrency, formatInteger } from '@/shared/lib/utils/formatters';
import { showSuccess } from '@/shared/lib/utils/notifications';
import { DataGrid } from '@/shared/ui';

import ProductPopupCard from './ProductPopupCard.vue';
import { useModel } from '../model';
import {
	getDefaultForm,
	type ICreateItem,
	type ICreateProductListItem,
} from '../config';
import { toFormat } from '@/shared/lib/utils/date';

const emit = defineEmits<{
	(event: 'hidden', afterSave: boolean): void;
}>();
const { saveItem } = useModel();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const formRef = useTemplateRef<InstanceType<typeof DxForm>>('dxForm');
const productsDataGridRef =
	useTemplateRef<ComponentExposed<typeof DataGrid>>('productsDataGrid');
const productCardRef =
	useTemplateRef<ComponentExposed<typeof ProductPopupCard>>('productCard');

const {
	value: saved,
	setTrue: setSaved,
	setFalse: clearSaved,
} = useBoolean(false);
const form = ref<ICreateItem>(getDefaultForm());

function show() {
	clearSaved();
	popupRef.value?.instance.show();
}
function onShowing() {
	reloadProducts();
}
function onHidden() {
	emit('hidden', saved.value);
	if (saved.value) {
		form.value = getDefaultForm();
	}
	resetForm();
}
defineExpose({ show });
async function resetForm() {
	reloadProducts();
	await nextTick();
	formRef.value?.instance.reset(form.value);
}
function hide() {
	popupRef.value?.instance.hide();
}
function reloadProducts() {
	productsDataGridRef.value?.reloadDataSource();
}
function onAddProductClick() {
	productCardRef.value?.show();
}

const resetButtonOptions: DxButtonTypes.Properties = {
	text: 'Сбросить',
	stylingMode: 'outlined',
	onClick: () => {
		form.value = getDefaultForm();
		resetForm();
	},
};
const saveButtonOptions = {
	text: 'Сохранить',
	stylingMode: 'outlined',
	onClick: async () => {
		const validation = formRef.value?.instance.validate();
		if (!validation?.isValid) {
			return;
		}

		const waybill: TPrimitiveRecord = {
			id: form.value.id,
			date: toFormat(form.value.date, 'YYYY-MM-DD HH:mm'),
			without_marks: 1,
		};
		if (form.value.comment) {
			waybill.comment = form.value.comment;
		}
		if (form.value.supplier_id) {
			waybill.supplier_id = form.value.supplier_id;
		}
		const items: TPrimitiveRecord[] = form.value.items.map((item) => {
			const result: TPrimitiveRecord = {
				item_id: item.item_id,
				name: item.name,
				quantity: item.quantity,
				price: item.price,
				sum: item.sum,
				price_nds: item.price_nds,
				sum_nds: item.sum_nds,
				nds_sum: item.nds_sum,
				nds: item.nds,
				marks: item.marks,
			};
			if (item.barcode) {
				result.barcode = item.barcode;
			}
			if (item.vas) {
				result.vas = item.vas;
			}
			return result;
		});
		const result = await saveItem(waybill, items);
		if (result) {
			setSaved();
			showSuccess('Сохранено');
			hide();
		}
	},
};

function onAddProduct(item: ICreateProductListItem) {
	form.value.items.push(item);
	reloadProducts();
}

const dateEditorOptions = { type: 'datetime' };
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.waybill-popup-card {
	.dx-popup-content {
		padding-bottom: 0;

		.products-data-grid {
			padding: 0;
		}
	}
}
</style>
