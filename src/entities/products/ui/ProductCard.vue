<template>
	<dx-popup ref="dxPopup" title="Добавление товара" width="60vw" height="60vh">
		<form @submit="onFormSubmit">
			<dx-form
				v-model:form-data="form"
				:show-validation-summary="true"
				validation-group="product-data"
				ref="dxForm"
			>
				<dx-simple-item
					data-field="item_id"
					editor-type="dxAutocomplete"
					:editor-options="itemIdEditorOptions"
				>
					<dx-label text="Артикул"></dx-label>
					<dx-required-rule message="Ариткул обязателен"></dx-required-rule>
					<dx-string-length-rule
						:min="3"
						message="Ариткул должен содержать хотя бы ? символов"
					></dx-string-length-rule>
				</dx-simple-item>
				<dx-simple-item
					data-field="name"
					editor-type="dxAutocomplete"
					:editor-options="nameEditorOptions"
				>
					<dx-label text="Наименование"></dx-label>
					<dx-required-rule
						message="Наименование обязательно"
					></dx-required-rule>
					<dx-string-length-rule
						:min="3"
						message="Наименование должно содержать хотя бы ? символов"
					></dx-string-length-rule>
				</dx-simple-item>
				<dx-simple-item data-field="quantity" editor-type="dxNumberBox">
					<dx-label text="Количество"></dx-label>
					<dx-required-rule message="Количество обязательно"></dx-required-rule>
					<dx-range-rule
						:min="1"
						message="Количество должно быть больше 0"
					></dx-range-rule>
				</dx-simple-item>
				<dx-simple-item data-field="price" editor-type="dxNumberBox">
					<dx-label text="Цена"></dx-label>
					<dx-required-rule message="Цена обязательна"></dx-required-rule>
					<dx-range-rule
						:min="1"
						message="Цена должна быть больше 0"
					></dx-range-rule>
				</dx-simple-item>
				<dx-simple-item data-field="weight" editor-type="dxNumberBox">
					<dx-label text="Вес"></dx-label>
					<dx-required-rule message="Вес обязателен"></dx-required-rule>
					<dx-range-rule
						:min="1"
						message="Вес должен быть больше 0"
					></dx-range-rule>
				</dx-simple-item>
				<dx-simple-item data-field="cnt" editor-type="dxNumberBox">
					<dx-label text="Свободный остаток"></dx-label>
					<dx-required-rule message="Остаток обязателен"></dx-required-rule>
					<dx-range-rule
						:min="1"
						message="Остаток должен быть больше 0"
					></dx-range-rule>
				</dx-simple-item>
				<dx-button-item :button-options="submitButtonOptions"></dx-button-item>
			</dx-form>
		</form>
	</dx-popup>
</template>

<script lang="ts" setup>
import { inject, ref, useTemplateRef } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import {
	DxForm,
	DxSimpleItem,
	DxButtonItem,
	DxLabel,
	DxRangeRule,
	DxRequiredRule,
	DxStringLengthRule,
} from 'devextreme-vue/form';
import 'devextreme-vue/autocomplete'; // for editor-type=dxAutocomplete
import type { DxAutocompleteTypes } from 'devextreme-vue/autocomplete';
import CustomStore from 'devextreme/data/custom_store';

import type { types } from '../model';
import { useApi } from '../api';
type TForm = Required<types.IListItem>;

const emit = defineEmits<{
	(event: 'added'): void;
}>();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
function show(_form?: TForm) {
	form.value = _form ?? getDefaultForm();
	popupRef.value.instance.show();
}
function hide() {
	popupRef.value.instance.hide();
}
defineExpose({ show });
const form = ref<TForm>(getDefaultForm());
function getDefaultForm(): TForm {
	return {
		item_id: '',
		name: '',
		quantity: 0,
		price: 0,
		cnt: 0,
		weight: 0,
	};
}

const api = useApi();
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
			return await api.searchByItemId(
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
			return await api.searchByItemName(
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
	formRef.value.instance.updateData({
		item_id: event.selectedItem.item_id,
		name: event.selectedItem.name,
		cnt: event.selectedItem.cnt,
		weight: event.selectedItem.weight,
	});
}

const submitButtonOptions = {
	stylingMode: 'outlined',
	text: 'Сохранить',
	icon: 'save',
	useSubmitBehavior: true,
};
function onFormSubmit(event: Event) {
	if (!addProductItem) {
		throw 'Method addProductItem not implemented';
	}
	event.preventDefault();
	addProductItem(form.value);
	emit('added');
	hide();
}
const addProductItem = inject<(item: types.IListItem) => void>('addProductItem');
</script>

<style lang="scss" scoped></style>
