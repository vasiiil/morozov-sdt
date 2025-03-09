<template>
	<dx-popup
		ref="dxPopup"
		title="Добавление товара"
		:width="700"
		:height="400"
	>
		<form @submit="onFormSubmit">
			<dx-form
				v-model:form-data="form"
				:show-validation-summary="true"
				validation-group="product-data"
				ref="dxForm"
			>
				<dx-group-item :col-count="2">
					<dx-simple-item
						data-field="item_id"
						editor-type="dxAutocomplete"
						:editor-options="itemIdEditorOptions"
					>
						<dx-label text="Артикул"></dx-label>
						<dx-required-rule
							message="Не заполнено поле Артикул"
						></dx-required-rule>
					</dx-simple-item>
					<dx-simple-item
						data-field="name"
						editor-type="dxAutocomplete"
						:editor-options="nameEditorOptions"
					>
						<dx-label text="Наименование"></dx-label>
						<dx-required-rule
							message="Не заполнено поле Наименование"
						></dx-required-rule>
					</dx-simple-item>
					<dx-simple-item
						data-field="quantity"
						editor-type="dxNumberBox"
					>
						<dx-label text="Количество"></dx-label>
						<dx-required-rule
							message="Не заполнено поле Количество"
						></dx-required-rule>
						<dx-range-rule
							:min="1"
							message="Количество должно быть больше 0"
						></dx-range-rule>
					</dx-simple-item>
					<dx-simple-item
						data-field="price"
						editor-type="dxNumberBox"
					>
						<dx-label text="Цена"></dx-label>
						<dx-required-rule
							message="Не заполнено поле Цена"
						></dx-required-rule>
						<dx-range-rule
							:min="1"
							message="Цена должна быть больше 0"
						></dx-range-rule>
					</dx-simple-item>
					<dx-simple-item
						data-field="barcode"
						editor-type="dxNumberBox"
					>
						<dx-label text="Штрих код"></dx-label>
					</dx-simple-item>
					<dx-simple-item data-field="vas">
						<dx-label text="VAS код"></dx-label>
					</dx-simple-item>
					<dx-simple-item
						data-field="marks"
						editor-type="dxSwitch"
					>
						<dx-label text="Честный знак"></dx-label>
					</dx-simple-item>
				</dx-group-item>
				<dx-group-item :col-count="4">
					<dx-empty-item :col-span="2"></dx-empty-item>
					<dx-button-item
						:button-options="cancelButtonOptions"
					></dx-button-item>
					<dx-button-item
						:button-options="submitButtonOptions"
					></dx-button-item>
				</dx-group-item>
			</dx-form>
		</form>
	</dx-popup>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import {
	DxForm,
	DxSimpleItem,
	DxButtonItem,
	DxGroupItem,
	DxEmptyItem,
	DxLabel,
	DxRangeRule,
	DxRequiredRule,
} from 'devextreme-vue/form';
import 'devextreme-vue/autocomplete'; // for editor-type=dxAutocomplete
import type { DxAutocompleteTypes } from 'devextreme-vue/autocomplete';
import CustomStore from 'devextreme/data/custom_store';

import { searchProducts } from '@/entities/products';
import { getProductDefaultForm, type ICreateProductListItem } from '../config';

const emit = defineEmits<{
	(event: 'add', value: ICreateProductListItem): void;
}>();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const form = ref<ICreateProductListItem>(getProductDefaultForm());
function show() {
	form.value = getProductDefaultForm();
	formRef.value?.instance.reset(form.value);
	popupRef.value?.instance.show();
}
function hide() {
	popupRef.value?.instance.hide();
}
defineExpose({ show });

const itemIdEditorOptions = {
	dataSource: new CustomStore({
		key: 'item_id',
		load: async (loadOptions) => {
			if (!loadOptions.searchValue) {
				return {
					data: [],
					totalCount: 0,
				};
			}
			return await searchProducts.byId(
				loadOptions.searchValue,
				loadOptions.skip ?? 0,
				loadOptions.take ?? 10,
			);
		},
	}),
	showClearButton: true,
	minSearchLength: 3,
	valueChangeEvent: 'keyup',
	placeholder: 'Введите артикул...',
	valueExpr: 'item_id',
	onSelectionChanged: onItemSelectionChanged,
};
const nameEditorOptions = {
	dataSource: new CustomStore({
		key: 'item_id',
		load: async (loadOptions) => {
			if (!loadOptions.searchValue) {
				return {
					data: [],
					totalCount: 0,
				};
			}
			return await searchProducts.byName(
				loadOptions.searchValue,
				loadOptions.skip ?? 0,
				loadOptions.take ?? 10,
			);
		},
	}),
	showClearButton: true,
	minSearchLength: 3,
	valueChangeEvent: 'keyup',
	placeholder: 'Введите наименование...',
	valueExpr: 'name',
	onSelectionChanged: onItemSelectionChanged,
};

const formRef = useTemplateRef<InstanceType<typeof DxForm>>('dxForm');
function onItemSelectionChanged(
	event: DxAutocompleteTypes.SelectionChangedEvent,
) {
	if (!event.selectedItem) {
		return;
	}

	formRef.value?.instance.updateData({
		item_id: event.selectedItem.item_id,
		name: event.selectedItem.name,
	});
}

const cancelButtonOptions = {
	stylingMode: 'outlined',
	icon: 'revert',
	text: 'Отменить',
	onClick: () => {
		hide();
	},
};
const submitButtonOptions = {
	stylingMode: 'outlined',
	text: 'Сохранить',
	icon: 'save',
	useSubmitBehavior: true,
};
function onFormSubmit(event: Event) {
	event.preventDefault();
	emit('add', {
		...form.value,
		price_nds: form.value.price,
		sum: form.value.price * form.value.quantity,
		sum_nds: form.value.price * form.value.quantity,
	});
	hide();
}
</script>

<style lang="scss" scoped></style>
