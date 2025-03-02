<template>
	<dx-data-grid
		:data-source="dataSource"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:hover-state-enabled="true"
		:show-borders="true"
		:column-min-width="50"
		:sync-lookup-filter-values="false"
		:remote-operations="{ paging: true, filtering: true }"
		:show-row-lines="false"
		width="100%"
		height="100%"
		ref="dataGridRef"
		@context-menu-preparing="onContextMenuPreparing"
		@exporting="onExporting"
	>
		<dx-paging :page-size="50"></dx-paging>
		<dx-pager
			:visible="true"
			:show-page-size-selector="true"
			:show-navigation-buttons="true"
			:show-info="true"
			display-mode="full"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-filter-row
			:visible="true"
			apply-filter="auto"
		></dx-filter-row>
		<dx-state-storing
			:enabled="true"
			type="localStorage"
			storage-key="anomaly-zones-data-grid"
		></dx-state-storing>
		<dx-export
			:enabled="true"
			:formats="['xlsx']"
		></dx-export>
		<dx-toolbar>
			<dx-toolbar-item location="before">
				<h4 class="page-title">Аномалии</h4>
			</dx-toolbar-item>
			<dx-toolbar-item name="exportButton"></dx-toolbar-item>
		</dx-toolbar>
		<dx-sorting mode="none"></dx-sorting>

		<dx-column
			data-field="anomaly_id"
			data-type="number"
			caption="Номер аномалии"
			:width="100"
			:filter-operations="['=']"
			cell-template="anomaly-id-cell"
		></dx-column>
		<dx-column
			data-field="doc_id"
			data-type="number"
			caption="Внутренний номер накладной"
			:width="150"
			:filter-operations="['=']"
		></dx-column>
		<dx-column
			data-field="date_create"
			data-type="date"
			caption="Дата создания"
			:width="180"
			:allow-filtering="false"
		></dx-column>
		<dx-column
			data-field="waybill_id"
			data-type="string"
			caption="Номер накладной"
			:width="250"
			:filter-operations="['=']"
		></dx-column>
		<dx-column
			data-field="task_id"
			data-type="number"
			caption="Номер тикета"
			:width="100"
			:filter-operations="['=']"
			cell-template="task-id-cell"
		></dx-column>
		<dx-column
			data-field="status"
			data-type="number"
			caption="Статус"
			:width="150"
			:filter-value="10"
		>
			<dx-lookup
				:data-source="statusLookupDataSource"
				value-expr="id"
				display-expr="name"
			></dx-lookup>
		</dx-column>
		<dx-column
			data-field="date_final_status"
			data-type="date"
			caption="Дата статуса"
			:width="150"
			:allow-filtering="false"
		></dx-column>
		<dx-column
			data-field="purpose"
			data-type="number"
			caption="Документ назначения"
			:width="150"
			:allow-filtering="false"
		></dx-column>

		<template #anomaly-id-cell="{ data: { data } }">
			<a @click.prevent="onAnomalyIdClick(data.anomaly_id)">
				{{ data.anomaly_id }}
			</a>
		</template>
		<template #task-id-cell="{ data: { data } }">
			<template v-if="isMaya">{{ data.task_id }}</template>
			<a
				v-else
				:href="`https://helpdesk.zao-sdt.com/issues/${data.task_id}`"
				target="_blank"
			>
				{{ data.task_id }}
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
	DxLookup,
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

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import { isMaya } from '@/shared/config';
import { parseFilter } from '@/shared/lib/utils/dx-data-source';
import { anomalyStatusItems } from '@/entities/anomaly-statuses';
import { useUser } from '@/entities/user';
import { useApi } from '../api';
import type { IListItem, TDxDataGridFilters } from '../config';

const emit = defineEmits<{
	(event: 'editClick', value: IListItem['anomaly_id']): void;
}>();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const api = useApi();

const dataSource = new DataSource<IListItem, 'anomaly_id'>({
	key: 'anomaly_id',
	load: async (loadOptions) => {
		const filter = parseFilter<TDxDataGridFilters>(loadOptions.filter) ?? {};
		const result = await api.getList(
			filter ?? {},
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.skip ?? 0),
			// @ts-expect-error typeof loadOptions = { isLoadingAll:  boolean }
			loadOptions.isLoadingAll ? 0 : (loadOptions.take ?? 100),
		);
		if (loadOptions.requireTotalCount) {
			dataGridRef.value?.instance.pageIndex(0);
		}
		return {
			...result,
		};
	},
});

const statusLookupDataSource = {
	store: new CustomStore({
		key: 'id',
		loadMode: 'raw',
		load: () => anomalyStatusItems,
	}),
	sort: 'id',
};

function onAnomalyIdClick(anomalyId: IListItem['anomaly_id']) {
	emit('editClick', anomalyId);
}
const { user } = useUser();
watch(
	() => user.value.active_profile,
	() => {
		dataGridRef.value?.instance.refresh();
	},
);

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
				`AnomalyZones_${new Date().toLocaleDateString()}.xlsx`,
			);
		});
	});

	event.cancel = true;
}
</script>

<style lang="scss" scoped></style>
