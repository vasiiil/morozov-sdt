<template>
	<data-grid
		:data-source="store"
		:max-height="490"
		:page-size="15"
		:pager-visible="false"
		:templates="['serial-numbers-cell', 'expiration-cell', 'marks-cell']"
		ref="dataGridRef"
	>
		<template #beforeAddButton>
			<dx-toolbar-item
				location="after"
				widget="dxButton"
				:options="exportAdditionalButtonOptions"
			></dx-toolbar-item>
		</template>
		<dx-column
			data-field="item_id"
			data-type="string"
			caption="Артикул"
			:width="130"
		></dx-column>
		<dx-column
			data-field="item_name"
			data-type="string"
			caption="Наименование"
			:width="250"
		></dx-column>
		<dx-column
			data-field="qty_orig"
			data-type="number"
			caption="Кол-во плановое"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty"
			data-type="number"
			caption="Кол-во (сток А)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty_defect"
			data-type="number"
			caption="Кол-во (Брак)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="qty_b"
			data-type="number"
			caption="Кол-во (сток Б)"
			:format="formatInteger"
			:width="120"
		></dx-column>
		<dx-column
			data-field="serial_numbers"
			data-type="string"
			caption="Серийный номер"
			:width="150"
			cell-template="serial-numbers-cell"
		></dx-column>
		<dx-column
			data-field="expiration"
			data-type="string"
			caption="Дата производства"
			:width="150"
			cell-template="expiration-cell"
		></dx-column>
		<dx-column
			data-field="marks"
			data-type="string"
			caption="Марки"
			:width="150"
			cell-template="marks-cell"
		></dx-column>

		<template #serial-numbers-cell="{ data: { data } }">
			<a
				v-if="!!data.serial_numbers"
				@click.prevent="onSerialNumbersClick(data)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #expiration-cell="{ data: { data } }">
			<a
				v-if="!!data.expiration"
				@click.prevent="onExpirationClick(data)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
		<template #marks-cell="{ data: { data } }">
			<a
				v-if="!!data.marks"
				@click.prevent="onMarksClick(data)"
			>
				Да
			</a>
			<span v-else>Нет</span>
		</template>
	</data-grid>
	<additional-expiration-popup
		ref="expirationPopup"
	></additional-expiration-popup>
	<additional-marks-popup ref="marksPopup"></additional-marks-popup>
	<additional-serial-numbers-popup
		ref="serialNumbersPopup"
	></additional-serial-numbers-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxColumn, DxItem as DxToolbarItem } from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

import { toDate } from '@/shared/lib/utils/date';
import { formatInteger } from '@/shared/lib/utils/formatters';
import { DataGrid } from '@/shared/ui';
import type { IAdditionalListItem, IListItem } from '../config';
import AdditionalExpirationPopup from './AdditionalExpirationPopup.vue';
import AdditionalMarksPopup from './AdditionalMarksPopup.vue';
import AdditionalSerialNumbersPopup from './AdditionalSerialNumbersPopup.vue';

const { items, docId, statusName } = defineProps<{
	items: IAdditionalListItem[];
	docId: IListItem['doc_id'] | undefined;
	statusName: string;
}>();
const dataGridRef = ref<ComponentExposed<typeof DataGrid>>();
const store = new CustomStore({
	key: 'item_id',
	loadMode: 'raw',
	load: () => items,
});
function reloadDataSource() {
	dataGridRef.value?.reloadDataSource();
}
defineExpose({ reloadDataSource });

const serialNumbersPopup =
	ref<ComponentExposed<typeof AdditionalSerialNumbersPopup>>();
function onSerialNumbersClick(row: IAdditionalListItem) {
	if (!row.serial_numbers) {
		return;
	}
	serialNumbersPopup.value?.show(row.item_id, row.serial_numbers);
}

const expirationPopup =
	ref<ComponentExposed<typeof AdditionalExpirationPopup>>();
function onExpirationClick(row: IAdditionalListItem) {
	if (!row.expiration) {
		return;
	}
	expirationPopup.value?.show(row.item_id, row.expiration);
}

const marksPopup = ref<ComponentExposed<typeof AdditionalMarksPopup>>();
function onMarksClick(row: IAdditionalListItem) {
	if (!row.marks) {
		return;
	}
	marksPopup.value?.show(row.item_id, row.marks);
}

const exportAdditionalButtonOptions = {
	text: 'Марки, СН, СГ',
	icon: 'xlsxfile',
	stylingMode: 'outlined',
	onClick: () => {
		const marks = [];
		for (const item of items) {
			if (item.marks) {
				marks.push(
					...item.marks.map((mark) => ({
						item_id: item.item_id,
						item_name: item.item_name,
						mark,
					})),
				);
			}
		}
		const serialNumbers = [];
		for (const item of items) {
			if (item.serial_numbers) {
				serialNumbers.push(
					...item.serial_numbers.map((serial_number) => ({
						item_id: item.item_id,
						item_name: item.item_name,
						serial_number,
					})),
				);
			}
		}
		const expirations = [];
		for (const item of items) {
			if (item.expiration) {
				expirations.push(
					...item.expiration.map((expiration) => {
						const date = toDate(expiration.date);
						if (date) {
							date.setHours(12);
						}
						return {
							item_id: item.item_id,
							item_name: item.item_name,
							...expiration,
							date,
						};
					}),
				);
			}
		}
		const workbook = new Workbook();
		let worksheet = workbook.addWorksheet('Маркировка');
		worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
		worksheet.columns = [
			{ header: 'Артикул', key: 'item_id', width: 15 },
			{ header: 'Наименование', key: 'item_name', width: 55 },
			{ header: 'Маркировка', key: 'mark', width: 35 },
		];
		worksheet.addRows(marks);

		worksheet = workbook.addWorksheet('Серийные номера');
		worksheet.columns = [
			{ header: 'Артикул', key: 'item_id', width: 15 },
			{ header: 'Наименование', key: 'item_name', width: 55 },
			{ header: 'Серийный номер', key: 'serial_number', width: 35 },
		];
		worksheet.addRows(serialNumbers);

		worksheet = workbook.addWorksheet('Сроки годности');
		worksheet.columns = [
			{ header: 'Артикул', key: 'item_id', width: 15 },
			{ header: 'Наименование', key: 'item_name', width: 55 },
			{ header: 'Кол-во', key: 'qty', width: 7 },
			{ header: 'Дата', key: 'date', width: 12 },
			{ header: 'Сток', key: 'stock', width: 5 },
		];
		worksheet.addRows(expirations);

		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(
				new Blob([buffer], { type: 'application/octet-stream' }),
				`Поставка_${docId}_${statusName}_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	},
};
</script>
