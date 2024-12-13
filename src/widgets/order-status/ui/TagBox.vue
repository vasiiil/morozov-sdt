<template>
	<dx-tag-box
		v-model:value="model"
		:items="items"
		display-expr="name"
		value-expr="id"
		:width="350"
		:search-enabled="true"
		:show-selection-controls="true"
		:multiline="false"
		:max-displayed-tags="3"
		select-all-mode="allPages"
		apply-value-mode="useButtons"
	/>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { DxTagBox } from 'devextreme-vue/tag-box';

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
const model = defineModel<OrderStatusTypes.TId[]>({ required: true });
</script>

<style lang="scss" scoped></style>
