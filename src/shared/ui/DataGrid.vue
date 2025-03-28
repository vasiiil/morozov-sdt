<template>
	<dx-data-grid
		:data-source="dataSource"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		:sync-lookup-filter-values="false"
		:element-attr="elementAttr"
		width="100%"
		height="100%"
		ref="dataGridRef"
		@context-menu-preparing="onContextMenuPreparing"
		@editor-prepared="onEditorPrepared"
		@exporting="onExporting"
		@row-dbl-click="onRowDblClick"
		@row-removed="onRowRemoved"
		@toolbar-preparing="onToolbarPreparing"
	>
		<dx-state-storing
			:enabled="!!storageKey"
			type="localStorage"
			:storage-key="`${storageKey}-data-grid-state-storage-key`"
		></dx-state-storing>
		<dx-paging :page-size="pageSize"></dx-paging>
		<dx-pager
			:visible="pagerVisible"
			:display-mode="'full'"
			:show-page-size-selector="true"
			:show-info="true"
			:show-navigation-buttons="true"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-sorting :mode="sortingMode"></dx-sorting>
		<dx-filter-row
			:visible="filterRowVisible"
			apply-filter="auto"
		></dx-filter-row>
		<dx-header-filter
			:visible="headerFilterVisible"
			:search="{ enabled: true }"
		></dx-header-filter>
		<dx-editing :allow-deleting="deleteEnabled"></dx-editing>
		<dx-export
			:enabled="exportEnabled"
			:formats="['xlsx']"
		></dx-export>
		<dx-toolbar :visible="toolbarVisible">
			<dx-toolbar-item
				:visible="!!gridTitle"
				location="before"
			>
				<h4 class="page-title">{{ gridTitle }}</h4>
			</dx-toolbar-item>
			<slot name="beforeAddButton"></slot>
			<dx-toolbar-item
				location="after"
				widget="dxButton"
				:visible="addEnabled"
				:options="addButtonOptions"
			></dx-toolbar-item>
			<slot name="afterAddButton"></slot>
			<dx-toolbar-item name="exportButton"></dx-toolbar-item>
		</dx-toolbar>

		<slot></slot>

		<template
			v-for="slot in preparedTemplates"
			v-slot:[slot]="{ data }"
		>
			<slot
				:name="slot"
				v-bind:data="data"
			/>
		</template>
	</dx-data-grid>
</template>

<script lang="ts" setup generic="TListItem, TKey extends keyof TListItem">
import { ref, watch } from 'vue';
import {
	DxDataGrid,
	DxEditing,
	DxExport,
	DxFilterRow,
	DxHeaderFilter,
	DxPaging,
	DxPager,
	DxScrolling,
	DxSorting,
	DxStateStoring,
	DxToolbar,
	DxItem as DxToolbarItem,
	type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import type { DxButtonTypes } from 'devextreme-vue/button';
import type DataSource from 'devextreme/data/data_source';
import type CustomStore from 'devextreme/data/custom_store';
import type { Sorting } from 'devextreme/common/grids';

import { useUser } from '@/entities/user';
import { getHTMLSize } from '../lib/utils/html';
export interface IProps<TListItem, TKey extends keyof TListItem>
	extends /** @vue-ignore */ DxDataGridTypes.Properties {
	dataSource:
		| TListItem[]
		| DataSource<TListItem, TKey>
		| CustomStore<TListItem, TKey>;
	gridTitle?: string;
	addEnabled?: boolean;
	deleteEnabled?: boolean;
	exportEnabled?: boolean;
	filterRowVisible?: boolean;
	headerFilterVisible?: boolean;
	sortingMode?: Sorting['mode'];
	pageSize?: number;
	pagerVisible?: boolean;

	templates?: string | string[];
	exportFilteName?: string;
	maxHeight?: number | string;
	toolbarVisible?: boolean;

	addButtonText?: string;
	storageKey?: string;
}

const emit = defineEmits<{
	(event: 'editClick', value: TListItem[TKey]): void;
	(event: 'addClick'): void;
	(event: 'rowDblClick', value: DxDataGridTypes.RowDblClickEvent): void;
	(event: 'rowRemoved', value: DxDataGridTypes.RowRemovedEvent): void;
	(event: 'editorPrepared', value: DxDataGridTypes.EditorPreparedEvent): void;
	(
		event: 'toolbarPreparing',
		value: DxDataGridTypes.ToolbarPreparingEvent,
	): void;
}>();
const {
	sortingMode = 'none',
	pageSize = 50,
	pagerVisible = true,
	templates,
	exportEnabled,
	exportFilteName = 'DataGrid',
	maxHeight,
	toolbarVisible = true,
	addButtonText = 'Создать',
} = defineProps<IProps<TListItem, TKey>>();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const preparedTemplates =
	templates === undefined
		? []
		: Array.isArray(templates)
			? templates
			: [templates];
const elementAttr: DxDataGridTypes.Properties['elementAttr'] = {};
if (maxHeight) {
	elementAttr.style = `max-height: ${getHTMLSize(maxHeight)};`;
}

function onEditorPrepared(event: DxDataGridTypes.EditorPreparedEvent) {
	emit('editorPrepared', event);
}
function onRowDblClick(event: DxDataGridTypes.RowDblClickEvent<TListItem>) {
	emit('rowDblClick', event);
}
function onRowRemoved(event: DxDataGridTypes.RowRemovedEvent<TListItem, TKey>) {
	emit('rowRemoved', event);
}
const addButtonOptions: DxButtonTypes.Properties = {
	icon: 'add',
	text: addButtonText,
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
	if (exportEnabled) {
		event.toolbarOptions.items?.forEach((item) => {
			if (item.name === 'exportButton') {
				item.options.text = 'Экспорт';
				item.options.stylingMode = 'outlined';
				item.showText = 'always';
			}
		});
	}
	emit('toolbarPreparing', event);
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
				`${exportFilteName}_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}

function onContextMenuPreparing(
	event: DxDataGridTypes.ContextMenuPreparingEvent,
) {
	if (!event.items) {
		event.items = [];
	}
	event.items.push({
		text: 'Отображение по умолчанию',
		icon: 'remove',
		onItemClick: () => {
			event.component.state(null);
		},
	});
}
</script>
