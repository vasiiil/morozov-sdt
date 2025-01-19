<template>
	<dx-data-grid
		:data-source="dataSource"
		:hover-state-enabled="true"
		:allow-column-reordering="true"
		:allow-column-resizing="true"
		:show-borders="true"
		:column-min-width="50"
		:sync-lookup-filter-values="false"
		:remote-operations="{ paging: true, filtering: true }"
		width="100%"
		height="100%"
		ref="dataGridRef"
	>
		<dx-paging :page-size="50"></dx-paging>
		<dx-pager
			:visible="true"
			:show-page-size-selector="true"
			:show-info="true"
			:show-navigation-buttons="true"
			display-mode="full"
		></dx-pager>
		<dx-scrolling mode="virtual"></dx-scrolling>
		<dx-filter-row :visible="true" apply-filter="auto"></dx-filter-row>

		<dx-column
			data-field="anomaly_id"
			data-type="number"
			caption="Номер аномалии"
			:width="150"
			:filter-operations="[]"
			cell-template="anomaly-id-cell"
		></dx-column>
		<dx-column
			data-field="doc_id"
			data-type="number"
			caption="Внутренний номер накладной"
			:width="150"
			:filter-operations="[]"
		></dx-column>
		<dx-column
			data-field="date_create"
			data-type="datetime"
			caption="Дата создания"
			:width="180"
			:allow-filtering="false"
		></dx-column>
		<dx-column
			data-field="waybill_id"
			data-type="string"
			caption="Номер накладной"
			:width="200"
			:filter-operations="[]"
		></dx-column>
		<dx-column
			data-field="task_id"
			data-type="number"
			caption="Номер тикета"
			:width="200"
			:filter-operations="[]"
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
			data-type="datetime"
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
			<a
				class="anomaly-id-cell"
				@click.prevent="onAnomalyIdClick(data.anomaly_id)"
				>{{ data.anomaly_id }}</a
			>
		</template>
	</dx-data-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
	DxDataGrid,
	DxColumn,
	DxFilterRow,
	DxLookup,
	DxPaging,
	DxPager,
	DxScrolling,
} from 'devextreme-vue/data-grid';

import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import { parseFilter } from '@/shared/lib/utils/dx-data-source';
import { anomalyStatusItems } from '@/entities/anomaly-statuses';
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
			loadOptions.skip ?? 0,
			loadOptions.take ?? 100,
		);
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
</script>

<style lang="scss" scoped>
.anomaly-id-cell {
	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>
