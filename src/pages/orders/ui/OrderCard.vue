<template>
	<dx-popup ref="popup" title="Создание заказа" width="90vw" height="70vh">
		<dx-form v-model:form-data="form">
			<dx-tabbed-item>
				<dx-tab title="Товары">
					<div class="products-data-grid">
						<products-data-grid
							:items="productItems"
							ref="productDataGrid"
						></products-data-grid>
					</div>
				</dx-tab>
				<!-- <dx-tab title="Test">
					<div><pre>{{ productItems }}</pre></div>
				</dx-tab> -->
			</dx-tabbed-item>
		</dx-form>
	</dx-popup>
</template>

<script setup lang="ts">
import { provide, ref, useTemplateRef } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { DxPopup } from 'devextreme-vue/popup';
import {
	DxForm,
	// DxLabel,
	// DxSimpleItem,
	DxTabbedItem,
	DxTab,
} from 'devextreme-vue/form';

// import { formatCurrency } from '@/shared/lib/utils/formatters';
// import { toFormat } from '@/shared/lib/utils/date';
// import { generateNumber } from '@/shared/lib/utils/generate';
type IOrderItem = unknown;
import { useLoader } from '@/shared/lib/use/useLoader';
import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import { ProductsDataGrid, type ProductTypes } from '@/entities/products';
import { useOrderApi, type OrderTypes } from '@/entities/order';

const { startLoading, stopLoading } = useLoader();
const api = useOrderApi();
const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const productsRef =
	useTemplateRef<ComponentExposed<typeof ProductsDataGrid>>('productDataGrid');
// const { orders } = useStore();
function getDefaultForm(): IOrderItem {
	return {
		items: [],
	};
}
const form = ref<IOrderItem>(getDefaultForm());
const {
	array: productItems,
	reset: resetProductItems,
	refresh: refreshProductItems,
	push: addProductItem,
} = useReactiveArray<ProductTypes.IListItem>();
provide('addProductItem', addProductItem);

async function show(orderId?: OrderTypes.TOrderId) {
	if (orderId) {
		startLoading();
		const order = await api.getItem(orderId);
		stopLoading();
		if (!order) {
			return;
		}

		refreshProductItems(order.items);
	} else {
		resetProductItems();
	}
	productsRef.value?.reloadDataSource();
	popupRef.value?.instance.show();
}
defineExpose({ show });
</script>

<style lang="scss" scoped>
.products-data-grid {
	padding: 0 !important;
	height: calc(70vh - 145px);
}
</style>
