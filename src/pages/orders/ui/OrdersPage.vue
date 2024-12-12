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
				:data-source="orders.array"
				:hover-state-enabled="true"
				:allow-column-reordering="true"
				:allow-column-resizing="true"
				:show-borders="true"
				width="100%"
				height="100%"
				:column-min-width="50"
				ref="dataGridRef"
			>
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

				<dx-column data-field="id" caption="ID" :width="80"></dx-column>
				<dx-column
					data-field="executorNumber"
					caption="Номер исполнителя"
					:width="150"
				></dx-column>
				<dx-column
					data-field="customerNumber"
					caption="Номер заказчика"
					:width="150"
				></dx-column>
				<dx-column
					data-field="orderDate"
					data-type="date"
					caption="Дата заказа"
					:width="100"
				></dx-column>
				<dx-column
					data-field="deliveryDate"
					data-type="date"
					caption="Дата доставки"
					:width="100"
				></dx-column>
				<dx-column
					data-field="deliveryType"
					caption="Служба доставки"
					:width="220"
				></dx-column>
				<dx-column
					data-field="amount"
					caption="Сумма"
					:width="200"
					:format="formatCurrency"
				></dx-column>
				<dx-column data-field="fio" caption="ФИО" :width="200"></dx-column>
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
} from 'devextreme-vue/data-grid';
import { DxButton } from 'devextreme-vue';

import { formatCurrency } from '@/shared/lib/utils/formatters';

import { useStore } from '../model';
import OrderCard from './OrderCard.vue';
import { generateData } from '../model/testData';

const { orders } = useStore();
const dataGridRef = ref<InstanceType<typeof DxDataGrid>>();
const cardRef = useTemplateRef<ComponentExposed<typeof OrderCard>>('card');

function reloadGridDataSource() {
	dataGridRef.value.instance.getDataSource().reload();
}
function onCreateButtonClick() {
	cardRef.value?.show();
}
function onImportButtonClick() {
	orders.pushMany(generateData(100));
	reloadGridDataSource();
}
function onCardSaved() {
	reloadGridDataSource();
}
</script>

<style lang="scss" scoped>
.orders-page {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 40px 40px calc(100% - 80px);
	&-toolbar {
		.start-icons-container {
			display: flex;
			gap: 8px;
		}
	}
}
</style>
