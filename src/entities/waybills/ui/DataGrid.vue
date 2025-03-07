<template>
	<dx-data-grid
		:data-source="dataSource"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		:sync-lookup-filter-values="false"
		:remote-operations="{ paging: true, sorting: true, filtering: true }"
		width="100%"
		height="100%"
		ref="dataGridRef"
		@editor-prepared="onEditorPrepared"
		@exporting="onExporting"
		@row-dbl-click="onRowDblClick"
		@toolbar-preparing="onToolbarPreparing"
	>
		<dx-paging :page-size="50"></dx-paging>
		<dx-pager
			:visible="true"
			:display-mode="'full'"
			:show-page-size-selector="true"
			:show-info="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-sorting mode="multiple"></dx-sorting>
		<dx-filter-row
			:visible="true"
			apply-filter="auto"
		></dx-filter-row>
		<dx-header-filter
			:visible="true"
			:search="{ enabled: true }"
		></dx-header-filter>
		<dx-export
			:enabled="true"
			:formats="['xlsx']"
		></dx-export>
		<dx-toolbar>
			<dx-toolbar-item location="before">
				<h4 class="page-title">Поставки</h4>
			</dx-toolbar-item>
			<dx-toolbar-item
				location="after"
				widget="dxButton"
				:options="addButtonOptions"
			></dx-toolbar-item>
			<dx-toolbar-item name="exportButton"></dx-toolbar-item>
		</dx-toolbar>

		<dx-column
			data-field="doc_id"
			data-type="number"
			caption="Внутренний № накладной"
			cell-template="doc-id-cell"
			:width="200"
			:allow-header-filtering="false"
			:filter-operations="['=']"
		></dx-column>
		<dx-column
			data-field="id"
			data-type="string"
			caption="№ накладной"
			:width="300"
			:allow-header-filtering="false"
			:allow-sorting="false"
			:filter-operations="['=']"
		></dx-column>
		<dx-column
			data-field="date_create"
			data-type="datetime"
			caption="Дата создания"
			:width="200"
			:allow-header-filtering="false"
			:filter-operations="['=', 'between']"
		></dx-column>
		<dx-column
			data-field="date_status"
			data-type="datetime"
			caption="Дата обновления статуса"
			:width="200"
			:allow-header-filtering="false"
			:filter-operations="['=', 'between']"
		></dx-column>
		<dx-column
			data-field="type_id"
			data-type="number"
			caption="Тип"
			calculate-display-value="type_name"
			:width="200"
			:allow-filtering="true"
			:allow-header-filtering="false"
			:filter-value="12"
		>
			<dx-lookup
				:data-source="typeLookupDataSource"
				value-expr="value"
				display-expr="text"
			></dx-lookup>
		</dx-column>
		<dx-column
			data-field="status"
			data-type="number"
			caption="Статус"
			:width="150"
			:allow-filtering="true"
			:allow-header-filtering="false"
		>
			<dx-lookup
				:data-source="statusLookupDataSource"
				value-expr="value"
				display-expr="text"
			></dx-lookup>
		</dx-column>

		<template #doc-id-cell="{ data: { data } }">
			<a @click.prevent="onDocIdClick(data.doc_id)">
				{{ data.doc_id }}
			</a>
		</template>
	</dx-data-grid>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import {
	DxDataGrid,
	DxColumn,
	DxExport,
	DxFilterRow,
	DxHeaderFilter,
	DxLookup,
	DxPaging,
	DxPager,
	DxScrolling,
	DxSorting,
	DxToolbar,
	DxItem as DxToolbarItem,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import type { DxButtonTypes } from 'devextreme-vue/button';
import SelectBox, {
	type ValueChangedEvent as SelectBoxValueChangedEvent,
} from 'devextreme/ui/select_box';

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import { parseFilter } from '@/shared/lib/utils/dx-data-source';
import { toFormat } from '@/shared/lib/utils/date';
import { useUser } from '@/entities/user';

import { useApi } from '../api';
import {
	types,
	statuses,
	type IListItem,
	type TSort,
	type TDxDataGridFilters,
	type TFilter,
	type TFilterFields,
} from '../config';

const emit = defineEmits<{
	(event: 'editClick', value: IListItem['doc_id']): void;
	(event: 'addClick'): void;
}>();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const api = useApi();

const dataSource = new DataSource<IListItem, 'doc_id'>({
	key: 'doc_id',
	load: async (loadOptions) => {
		let sort: TSort | null = null;
		if (loadOptions.sort) {
			sort = {};
			const optionsSort = Array.isArray(loadOptions.sort)
				? loadOptions.sort
				: [loadOptions.sort];
			for (const sortItem of optionsSort) {
				// @ts-expect-error typeof sortItem = { selector: keyof IListItem, desc: boolean }
				sort[sortItem.selector] = sortItem.desc ? 'desc' : 'asc';
			}
		}
		const dataGridFilter = parseFilter<TDxDataGridFilters>(loadOptions.filter);
		const filter: TFilter = {};
		if (dataGridFilter) {
			for (const _field in dataGridFilter) {
				const field = _field as TFilterFields;
				if (field === 'date_create' || field === 'date_status') {
					const filterValue = dataGridFilter[field];
					if (Array.isArray(filterValue)) {
						const firstValue = toFormat(filterValue[0]);
						const secondValue = toFormat(filterValue[1]);
						if (firstValue && secondValue) {
							filter[field] = `${firstValue} - ${secondValue}`;
						} else if (firstValue) {
							filter[field] = firstValue;
						} else if (secondValue) {
							filter[field] = secondValue;
						} else {
							delete filter[field];
						}
					} else {
						const value = toFormat(filterValue);
						if (value) {
							filter[field] = value;
						} else {
							delete filter[field];
						}
					}
				} else {
					filter[field] = dataGridFilter[field];
				}
			}
		}
		const result = await api.getList(
			filter ?? {},
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.skip ?? 0),
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.take ?? 100),
			sort,
		);
		return {
			...result,
		};
	},
});
function onEditorPrepared(event: DxDataGridTypes.EditorPreparedEvent) {
	if (event.parentType !== 'filterRow') {
		return;
	}
	if (event.dataField === 'type_id') {
		const lookup = SelectBox.getInstance(event.editorElement) as SelectBox;
		lookup.on('valueChanged', function (args: SelectBoxValueChangedEvent) {
			event.setValue(args.value);

			statusLookup.value
				?.getDataSource()
				.filter(args.value ? ['type_id', '=', args.value] : null);
			statusLookup.value?.getDataSource().load();
		});
	}
	if (event.dataField === 'status') {
		statusLookup.value = SelectBox.getInstance(
			event.editorElement,
		) as SelectBox;
		statusLookup.value?.getDataSource().filter(['type_id', '=', 12]);
		statusLookup.value?.getDataSource().load();
	}
}

const statusLookup = ref<SelectBox>();
const statusLookupDataSource = {
	store: new CustomStore({
		key: 'value',
		loadMode: 'raw',
		load: () => statuses,
	}),
	sort: { selector: 'value', desc: true },
};

const typeLookupDataSource = {
	store: new CustomStore({
		key: 'value',
		loadMode: 'raw',
		load: () =>
			Object.entries(types).map((item) => ({ value: +item[0], text: item[1] })),
	}),
	sort: { selector: 'value', desc: true },
};

function onDocIdClick(docId: IListItem['doc_id']) {
	emit('editClick', docId);
}
function onRowDblClick(event: DxDataGridTypes.RowDblClickEvent<IListItem>) {
	onDocIdClick(event.data.doc_id);
}
const addButtonOptions: DxButtonTypes.Properties = {
	icon: 'add',
	text: 'Создать',
	stylingMode: 'outlined',
	onClick: () => {
		emit('addClick');
	},
};

const { user } = useUser();
watch(
	() => user.value.active_profile,
	() => {
		dataGridRef.value?.instance.refresh();
	},
);

function reloadDataSource() {
	dataGridRef.value?.instance.getDataSource().reload();
}

defineExpose({ reloadDataSource });
function onToolbarPreparing(event: DxDataGridTypes.ToolbarPreparingEvent) {
	event.toolbarOptions.items?.forEach((item) => {
		if (item.name === 'exportButton') {
			item.options.text = 'Экспорт';
			item.options.stylingMode = 'outlined';
			item.showText = 'always';
		}
	});
}
function onExporting(event: DxDataGridTypes.ExportingEvent) {
	const workbook = new Workbook();
	const worksheet = workbook.addWorksheet('Sheet 1');

	exportDataGrid({
		component: event.component,
		worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(
				new Blob([buffer], { type: 'application/octet-stream' }),
				`Waybills_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}
</script>
