<template>
	<dx-popup
		ref="dxPopup"
		:title="`Марки ${itemId}`"
		:width="900"
		:height="500"
		max-height="90vh"
	>
		<dx-list
			:data-source="items"
			:height="400"
			:search-enabled="true"
			ref="dxList"
		></dx-list>
	</dx-popup>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { DxPopup } from 'devextreme-vue/popup';
import { DxList } from 'devextreme-vue/list';

import { useReactiveArray } from '@/shared/lib/use/base/useReactiveArray';
import { type IAdditionalListItem } from '../config';

const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('dxPopup');
const listRef = useTemplateRef<InstanceType<typeof DxList>>('dxList');
const itemId = ref<IAdditionalListItem['item_id']>();
const { array: items, refresh: refreshItems } = useReactiveArray<string>();

function show(_itemId: IAdditionalListItem['item_id'], marks: string[]) {
	itemId.value = _itemId;
	refreshItems(marks);
	listRef.value?.instance.reload();
	popupRef.value?.instance.show();
}
defineExpose({ show });
</script>

<style lang="scss" scoped></style>
