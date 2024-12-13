<template>
	<dx-select-box
		v-model:value="model"
		:items="items"
		display-expr="name"
		value-expr="id"
		:width="350"
	/>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { DxSelectBox } from 'devextreme-vue/select-box';

import {
	useOrderStatusStore,
	type OrderStatusTypes,
} from '@/entities/order-status';
const store = useOrderStatusStore();
onMounted(() => {
	if (items.value.length === 0) {
		store.loadList();
	}
});
const items = computed(() => store.items);
const model = defineModel<OrderStatusTypes.TId | null>({ required: true });
</script>

<style lang="scss" scoped></style>
