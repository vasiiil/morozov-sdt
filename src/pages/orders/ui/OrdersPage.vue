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

				<dx-data-grid-toolbar>
					<dx-data-grid-toolbar-item
						widget="dxButton"
						location="before"
						:options="refreshButtonOptions"
					></dx-data-grid-toolbar-item>
					<dx-data-grid-toolbar-item location="before">
						<order-status-tag-box v-model="statusIds"></order-status-tag-box>
					</dx-data-grid-toolbar-item>
					<dx-data-grid-toolbar-item
						name="exportButton"
					></dx-data-grid-toolbar-item>
					<dx-data-grid-toolbar-item
						name="searchPanel"
					></dx-data-grid-toolbar-item>
				</dx-data-grid-toolbar>

				<dx-column
					data-field="order_id"
					caption="№ Заказа внутренний"
					:width="150"
				></dx-column>
				<dx-column data-field="id" caption="№ Заказа" :width="150"></dx-column>
				<dx-column
					data-field="date_create"
					data-type="datetime"
					caption="Дата создания"
					:width="150"
				></dx-column>
				<dx-column
					data-field="type"
					caption="Тип доставки"
					:width="100"
					:allow-sorting="false"
				></dx-column>
				<dx-column
					data-field="status"
					caption="Статус"
					calculate-display-value="status_name"
					:width="150"
				>
					<dx-lookup
						:data-source="statusLookupDatwaSource"
						value-expr="id"
						display-expr="name"
					></dx-lookup>
				</dx-column>
				<dx-column
					data-field="date_status"
					data-type="datetime"
					caption="Дата обновления статуса"
					:width="150"
				></dx-column>
				<dx-column
					data-field="customer_name_full"
					caption="ФИО получателя"
					:width="150"
				></dx-column>
				<dx-column
					data-field="date_ship"
					data-type="datetime"
					caption="Дата отгрузки (доставки)"
					:width="150"
					:allow-sorting="false"
				></dx-column>
				<dx-column
					data-field="summ"
					caption="Сумма"
					:width="200"
					:format="formatCurrency"
				></dx-column>
				<dx-column
					data-field="payment_type"
					caption="Тип оплаты"
					:width="100"
					:allow-sorting="false"
				></dx-column>
				<dx-column
					data-field="delivery_code"
					caption="Код службы доставки"
					:width="100"
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
	DxToolbar as DxDataGridToolbar,
	DxItem as DxDataGridToolbarItem,
} from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

import { formatCurrency } from '@/shared/lib/utils/formatters';

import {
	useOrderStatusStore,
	type OrderStatusTypes,
} from '@/entities/order-status';

import { OrderStatusTagBox } from '@/widgets/order-status';
import { useOrderApi, type OrderTypes } from '@/entities/order';

const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const api = useOrderApi();

function reloadGridDataSource() {
	dataGridRef.value.instance.getDataSource().reload();
}
async function onRefreshButtonClick() {
	reloadGridDataSource();
}

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
		const result = await api.getList(
			{
				status: statusIds.value.join(','),
			},
			loadOptions.skip ?? 0,
			loadOptions.take ?? 100,
			sort,
		);
		return {
			...result,
		};
	},
});

const refreshButtonOptions = {
	text: 'Обновить',
	icon: 'refresh',
	stylingMode: 'outlined',
	onClick: onRefreshButtonClick,
};

const statusIds = ref<OrderStatusTypes.TId[]>([13, 14, 15]);
const { items: statusItems } = useOrderStatusStore();
const statusLookupDatwaSource = new ArrayStore({
	data: statusItems,
	key: 'id',
});
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
