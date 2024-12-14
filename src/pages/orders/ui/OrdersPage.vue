<template>
	<div class="orders-page">
		<h2 class="page-title orders-page-title">Orders Page</h2>
		<div class="orders-page-data-table">
			<dx-data-grid
				:data-source="dataSource"
				:hover-state-enabled="true"
				:allow-column-reordering="true"
				:allow-column-resizing="true"
				:show-borders="true"
				width="100%"
				height="100%"
				:column-min-width="50"
				:remote-operations="{ paging: true, sorting: true, filtering: true }"
				ref="dataGridRef"
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
				<dx-search-panel :visible="true" :width="350"></dx-search-panel>
				<dx-sorting mode="multiple"></dx-sorting>
				<dx-filter-row :visible="true" apply-filter="auto"></dx-filter-row>
				<dx-header-filter
					:visible="true"
					:search="{ enabled: true }"
				></dx-header-filter>
				<dx-export
					:enabled="true"
					:allow-export-selected-data="true"
					:formats="['xlsx']"
				></dx-export>

				<dx-column
					data-field="order_id"
					data-type="string"
					caption="№ Заказа внутренний"
					:width="150"
					:allow-header-filtering="false"
					:filter-operations="[]"
				></dx-column>
				<dx-column
					data-field="id"
					data-type="string"
					caption="№ Заказа"
					:width="150"
					:allow-header-filtering="false"
					:filter-operations="[]"
				></dx-column>
				<dx-column
					data-field="date_create"
					data-type="datetime"
					caption="Дата создания"
					:width="150"
					:allow-header-filtering="false"
					:filter-operations="['=', 'between']"
				></dx-column>
				<dx-column
					data-field="type"
					data-type="number"
					caption="Тип доставки"
					:width="100"
					:allow-sorting="false"
					:allow-filtering="false"
				></dx-column>
				<dx-column
					data-field="status"
					data-type="number"
					caption="Статус"
					:width="150"
					:allow-filtering="false"
					:allow-header-filtering="true"
					:filter-values="[13, 14, 15]"
				>
					<dx-lookup
						:data-source="statusLookupDataSource"
						value-expr="value"
						display-expr="text"
					></dx-lookup>
					<dx-header-filter
						:data-source="statusLookupDataSource"
					></dx-header-filter>
				</dx-column>
				<dx-column
					data-field="date_status"
					data-type="datetime"
					caption="Дата обновления статуса"
					:width="150"
					:allow-header-filtering="false"
					:filter-operations="['=', 'between']"
				></dx-column>
				<dx-column
					data-field="customer_name_full"
					data-type="string"
					caption="ФИО получателя"
					:width="150"
					:allow-header-filtering="false"
					:filter-operations="[]"
					selected-filter-operation="contains"
				></dx-column>
				<dx-column
					data-field="date_ship"
					data-type="date"
					caption="Дата отгрузки (доставки)"
					:width="150"
					:allow-sorting="false"
					:allow-header-filtering="false"
					:filter-operations="[]"
				></dx-column>
				<dx-column
					data-field="summ"
					data-type="number"
					caption="Сумма"
					:width="200"
					:format="formatCurrency"
					:allow-header-filtering="false"
					:filter-operations="['=', 'between']"
				></dx-column>
				<dx-column
					data-field="payment_type"
					data-type="number"
					caption="Тип оплаты"
					:width="100"
					:allow-sorting="false"
					:allow-filtering="false"
				></dx-column>
				<dx-column
					data-field="delivery_code"
					data-type="string"
					caption="Код службы доставки"
					:width="100"
					:allow-filtering="false"
				></dx-column>
			</dx-data-grid>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
	DxSearchPanel,
	DxSorting,
} from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import { formatCurrency } from '@/shared/lib/utils/formatters';
import { parseFilter } from '@/shared/lib/utils/dx-data-source';
import { toFormat } from '@/shared/lib/utils/date';

import { useOrderStatusStore } from '@/entities/order-status';

import { useOrderApi, type OrderTypes } from '@/entities/order';

const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const api = useOrderApi();

const dataSource = new DataSource<OrderTypes.IListItem, 'id'>({
	key: 'id',
	load: async (loadOptions) => {
		let sort: OrderTypes.TSort | null = null;
		if (loadOptions.sort) {
			sort = {};
			const optionsSort = Array.isArray(loadOptions.sort)
				? loadOptions.sort
				: [loadOptions.sort];
			for (const sortItem of optionsSort) {
				// @ts-expect-error typeof sortItem = { selector: keyof OrderTypes.IListItem, desc: boolean }
				sort[sortItem.selector] = sortItem.desc ? 'desc' : 'asc';
			}
		}
		const dataGridFilter = parseFilter<OrderTypes.TDxDataGridFilters>(
			loadOptions.filter,
		);
		const filter: OrderTypes.TFilter = {};
		if (dataGridFilter) {
			for (const _field in dataGridFilter) {
				const field = _field as OrderTypes.TFilterFields;
				if (
					field === 'date_create' ||
					field === 'date_status' ||
					field === 'date_ship'
				) {
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
						const value = toFormat(
							filterValue,
							field === 'date_ship' ? 'DD.MM.YYYY' : 'DD.MM.YYYY hh:mm:ss',
						);
						if (value) {
							filter[field] = value;
						} else {
							delete filter[field];
						}
					}
				} else if (field === 'status') {
					if (Array.isArray(dataGridFilter[field])) {
						filter.status = dataGridFilter[field].join(',');
					} else {
						filter.status = dataGridFilter[field];
					}
				} else {
					filter.status = dataGridFilter[field];
				}
			}
		}
		const result = await api.getList(
			filter ?? {},
			loadOptions.skip ?? 0,
			loadOptions.take ?? 100,
			sort,
		);
		return {
			...result,
		};
	},
});

const { items: statusItems, loadList: loadStatusItems } = useOrderStatusStore();
const statusLookupDataSource = {
	store: new CustomStore({
		key: 'value',
		loadMode: 'raw',
		load: async () => {
			if (statusItems.length === 0) {
				await loadStatusItems();
			}
			return statusItems.map((item) => ({
				text: item.name,
				value: item.id,
			}));
		},
	}),
	sort: 'value',
};
</script>

<style lang="scss" scoped>
.orders-page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px calc(100% - 40px);
	&-toolbar {
		.start-icons-container {
			display: flex;
			gap: 8px;
		}
	}

	&-data-table {
		overflow: hidden;
	}
}
</style>
