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
					editor-type="dxSelectBox"
					:editor-options="supplierEditorOptions"
				>
					<dx-label text="Поставщик"></dx-label>
				</dx-simple-item>
				<dx-empty-item></dx-empty-item>
				<dx-simple-item :col-span="2">
					<div class="products-data-grid">
						<data-grid
							:data-source="form.items"
							:grid-title="`Товары (${form.items.length})`"
							:pager-visible="false"
							add-button-text="Добавить"
							add-enabled
							delete-enabled
							ref="productsDataGrid"
							@add-click="onAddProductClick"
						>
							<template #beforeAddButton>
								<dx-data-grid-toolbar-item
									location="after"
									widget="dxButton"
									:visible="!!fileUploaderElement"
									:options="importButtonOptions"
								>
								</dx-data-grid-toolbar-item>
							</template>
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
		<dx-file-uploader
			:accept="allowedFileMimes.join(',')"
			:allowed-file-extensions="allowedFileExtensions"
			:multiple="false"
			:visible="false"
			upload-mode="useButtons"
			ref="dxFileUploader"
			@initialized="onFileUploaderInitialized"
			@value-changed="onFileUploaderValueChanged"
		></dx-file-uploader>
	</dx-popup>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import {
	DxColumn,
	DxItem as DxDataGridToolbarItem,
} from 'devextreme-vue/data-grid';
import {
	DxFileUploader,
	type DxFileUploaderTypes,
} from 'devextreme-vue/file-uploader';
import {
	DxForm,
	DxLabel,
	DxSimpleItem,
	DxGroupItem,
	DxEmptyItem,
	DxRequiredRule,
} from 'devextreme-vue/form';
import type { DxButtonTypes } from 'devextreme-vue/button';
import DataSource from 'devextreme/data/data_source';
// import { Workbook } from 'exceljs';
import csv from 'papaparse';

import type { TPrimitiveRecord } from '@/shared/lib/types/object';
import { useBoolean } from '@/shared/lib/use/base/useBoolean';
import { formatCurrency, formatInteger } from '@/shared/lib/utils/formatters';
import { showError, showSuccess } from '@/shared/lib/utils/notifications';
import { DataGrid } from '@/shared/ui';

import {
	getSuppliers,
	type IListItem as ISupplierListItem,
} from '@/entities/suppliers';

import ProductPopupCard from './ProductPopupCard.vue';
import { useModel } from '../model';
type TCSVRow = [string, string, string, string, string, string];
import {
	getDefaultForm,
	getProductDefaultForm,
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

const suppliersDataSource = new DataSource<ISupplierListItem, 'supplier_id'>({
	key: 'supplier_id',
	load: async () => {
		return await getSuppliers(0, 0);
	},
	paginate: false,
});
const supplierEditorOptions = {
	dataSource: suppliersDataSource,
	value: form.value.supplier_id,
	displayExpr: 'name',
	valueExpr: 'supplier_id',
};

const fileUploaderElement = ref<HTMLElement>();
const importButtonOptions = {
	icon: 'upload',
	text: 'Импорт',
	stylingMode: 'outlined',
	onClick: () => {
		const btn = fileUploaderElement.value?.querySelector<HTMLButtonElement>(
			'.dx-fileuploader-button',
		);
		if (!btn) {
			return;
		}
		btn.click();
	},
};
function onFileUploaderInitialized(
	event: DxFileUploaderTypes.InitializedEvent,
) {
	if (!event.element) {
		return;
	}
	fileUploaderElement.value = event.element;
}
async function onFileUploaderValueChanged(
	event: DxFileUploaderTypes.ValueChangedEvent,
) {
	if (!event.value) {
		return;
	}
	const file = event.value[0];
	const ext = file.name.split('.').pop();
	if (ext === 'csv' || ext === 'txt') {
		parseCsv(file);
		return;
	}

	const buffer = await readFile(file);
	if (!buffer) {
		showError('Не удалось открыть файл');
		return;
	}
}
function readFile(file: File): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			resolve(reader.result);
		};
	});
}
async function parseCsv(file: File) {
	csv.parse<TCSVRow>(file, {
		complete: (results) => {
			const products: ICreateProductListItem[] = [];
			let rowIndex;
			try {
				for (rowIndex = 1; rowIndex < results.data.length; rowIndex++) {
					const row = trimRow(results.data[rowIndex]);
					if (row.every((item) => item === '')) {
						continue;
					}

					const itemId = validateItemId(row[0]);
					const name = validateName(row[1]);
					const price = validatePrice(row[2]);
					const quantity = validateQuantity(row[3]);
					const marks = validateMarks(row[4]);
					const vas = validateVas(row[5]);
					const product = getProductDefaultForm();
					product.item_id = itemId;
					product.name = name;
					product.price = price;
					product.price_nds = price;
					product.quantity = quantity;
					product.sum = quantity * price;
					product.sum_nds = quantity * price;
					product.marks = marks;
					product.vas = vas;

					products.push(product);
				}
			} catch (error) {
				showError(
					`Ошибка в ${rowIndex} строке. ${typeof error === 'string' ? error : ''}`,
				);
				products.length = 0;
			}

			if (products.length > 0) {
				for (const product of products) {
					form.value.items.push(product);
				}
				reloadProducts();
			}
		},
		error: () => {
			showError('Не удалось открыть файл');
		},
	});
	// const workbook = new Workbook();
	// const sheet = await workbook.csv.read(buffer);
	// sheet.eachRow(function (row, rowNumber) {
	// 	console.log({rowNumber, row});
	// });
}
function trimRow(row: TCSVRow): TCSVRow {
	for (let i = 0; i < 6; i++) {
		row[i] = row[i]?.trim() ?? '';
	}
	return row;
}
function validateOnEmpty(value: string, errorMessage: string): string {
	if (value.length === 0) {
		throw errorMessage;
	}
	return value;
}
function validateItemId(value: string): ICreateProductListItem['item_id'] {
	value = validateOnEmpty(value, 'Не заполнен Артикул');
	const pattern = /^[0-9a-zа-яА-ЯA-Z\.,\\\/\(\)\[\]\-=_\s]+$/;
	if (!pattern.test(value)) {
		throw 'Артикул содержит недопустимые символы';
	}
	return value;
}
function validateName(value: string): ICreateProductListItem['name'] {
	value = validateOnEmpty(value, 'Не заполнено Наименование');
	return value;
}
function validateQuantity(value: string): ICreateProductListItem['quantity'] {
	value = validateOnEmpty(value, 'Не заполнено Количество');
	value = value.replaceAll(' ', '');
	const pattern = /^\d+$/;
	if (!pattern.test(value)) {
		throw 'Количество должно быть целым числом';
	}
	const intValue = parseInt(value);
	if (intValue === 0) {
		throw 'Количество должно быть больше 0';
	}
	return intValue;
}
function validatePrice(value: string): ICreateProductListItem['price'] {
	value = validateOnEmpty(value, 'Не заполнена Цена');
	value = value.replaceAll(' ', '').replaceAll(',', '.');
	const pattern = /^\d+(\.\d\d?)?$/;
	if (!pattern.test(value)) {
		throw 'Цена должна быть положительным числом';
	}
	return parseFloat(value);
}
function validateMarks(value: string): ICreateProductListItem['marks'] {
	if (value === '') {
		return false;
	}
	if (value === '0') {
		return false;
	}
	if (value === '1') {
		return true;
	}
	throw 'Честный знак заполнен некорректно';
}
function validateVas(value: string): ICreateProductListItem['vas'] {
	const pattern = /^(\d{2,3})?$/;
	if (!pattern.test(value)) {
		throw new Error('VAS код заполнен некорректно');
	}
	return value;
}
const allowedFileMimes = [
	'text/csv',
	'text/plain',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
	'application/vnd.ms-excel.sheet.macroEnabled.12',
	'application/vnd.ms-excel.template.macroEnabled.12',
	'application/vnd.ms-excel.addin.macroEnabled.12',
	'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
];
const allowedFileExtensions = ['.xlsx', '.csv', '.txt'];
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
