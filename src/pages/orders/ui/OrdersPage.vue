<template>
	<div class="orders-page">
		<h2 class="page-title orders-page-title">Orders Page</h2>
		<dx-toolbar :element-attr="{ class: 'orders-page-toolbar' }">
			<dx-toolbar-item location="before">
				<i class="dx-icon dx-icon-filter"></i>
			</dx-toolbar-item>
			<dx-toolbar-item location="before">
				<i class="dx-icon dx-icon-refresh"></i>
			</dx-toolbar-item>
			<dx-toolbar-item location="before">
				<i class="dx-icon dx-icon-menu"></i>
			</dx-toolbar-item>
			<dx-toolbar-item location="before">
				<i class="dx-icon dx-icon-preferences"></i>
			</dx-toolbar-item>
			<dx-toolbar-item location="before">
				<i class="dx-icon dx-icon-xlsxfile"></i>
			</dx-toolbar-item>

			<dx-toolbar-item location="after">
				<dx-button
					text="Импорт"
					icon="chevrondown"
					@click="onImportButtonClick"
				/>
				<dx-button text="Создать" icon="plus" @click="onCreateButtonClick" />
			</dx-toolbar-item>
		</dx-toolbar>
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
				:remote-operations="{ paging: true }"
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
				<dx-search-panel :visible="true"></dx-search-panel>
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
				></dx-column>
				<dx-column
					data-field="delivery_code"
					caption="Код службы доставки"
					:width="100"
				></dx-column>
			</dx-data-grid>
			<order-card ref="card" @saved="onCardSaved"></order-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxToolbar, DxItem as DxToolbarItem } from 'devextreme-vue/toolbar';
import {
	DxDataGrid,
	DxColumn,
	DxScrolling,
	DxSearchPanel,
	DxFilterRow,
	DxHeaderFilter,
	DxExport,
	DxToolbar as DxDataGridToolbar,
	DxItem as DxDataGridToolbarItem,
	DxLookup,
	DxPaging,
	DxPager,
} from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { DxButton } from 'devextreme-vue';

import { formatCurrency } from '@/shared/lib/utils/formatters';

import {
	useOrderStatusStore,
	type OrderStatusTypes,
} from '@/entities/order-status';

import { OrderStatusTagBox } from '@/widgets/order-status';
import OrderCard from './OrderCard.vue';
import  { useOrderApi, type OrderTypes } from '@/entities/order';

const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');
const api = useOrderApi();

function reloadGridDataSource() {
	dataGridRef.value.instance.getDataSource().reload();
}
function onCreateButtonClick() {
	cardRef.value?.show();
}
function onImportButtonClick() {
	// orders.pushMany(generateData(100));
	reloadGridDataSource();
}
function onCardSaved() {
	reloadGridDataSource();
}
async function onRefreshButtonClick() {
	reloadGridDataSource();
}

let isFirstLoad = true;
const dataSource = new DataSource<OrderTypes.IListItem, 'id'>({
	key: 'id',
	load: (loadOptions) => {
		if (isFirstLoad) {
			isFirstLoad = false;
			return Promise.resolve({
				data: [],
				totalCount: 0,
			});
		}
		return api.getList(
			{
				status: statusIds.value.join(','),
			},
			loadOptions.skip ?? 0,
			loadOptions.take ?? 100,
		);
	},
});

const refreshButtonOptions = {
	text: 'Обновить',
	icon: 'refresh',
	stylingMode: 'outlined',
	onClick: onRefreshButtonClick,
};

const statusIds = ref<OrderStatusTypes.TId[]>([]);
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
	grid-template-rows: 40px 48px calc(100% - 88px);
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
