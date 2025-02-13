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
		ref="tagBox"
	></dx-tag-box>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { DxTagBox } from 'devextreme-vue/tag-box';

import {
	useOrderStatusStore,
	type OrderStatusTypes,
} from '@/entities/order-status';
const store = useOrderStatusStore();
const tagBox = ref<InstanceType<typeof DxTagBox>>();
onMounted(() => {
	if (items.value.length === 0) {
		store.loadList().then(() => {
			tagBox.value.instance.repaint();
		});
	}
});
const items = computed(() => store.items);
const model = defineModel<OrderStatusTypes.TId[]>({ required: true });
</script>

<style lang="scss" scoped></style>
