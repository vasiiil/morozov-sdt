<template>
	<dx-popup
		:title="title"
		ref="popup"
		min-width="600px"
		max-width="50vw"
		width="auto"
		max-height="30vh"
		height="auto"
	>
		<dx-toolbar-item
			toolbar="bottom"
			location="before"
		>
			<base-button
				:text="cancelText"
				:icon="cancelIcon"
				styling-mode="outlined"
				@click="onCancelClick"
			></base-button>
		</dx-toolbar-item>
		<dx-toolbar-item
			toolbar="bottom"
			location="after"
		>
			<base-button
				:text="confirmText"
				:icon="confirmIcon"
				styling-mode="outlined"
				@click="onConfirmClick"
			></base-button>
		</dx-toolbar-item>
		<div class="message">{{ message }}</div>
	</dx-popup>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';

import { BaseButton } from '@/shared/ui';

const popupRef = useTemplateRef<InstanceType<typeof DxPopup>>('popup');
const resolve = ref<(value: boolean) => void>();
const defaultTitle = 'ВНИМАНИЕ!';
const defaultMessage = '';
const defaultConfirmText = 'Ок';
const defaultCancelText = 'Отмена';
const title = ref<string>();
const message = ref<string>();
const confirmText = ref<string>();
const confirmIcon = ref<string>();
const cancelText = ref<string>();
const cancelIcon = ref<string>();
function open(
	options: {
		title?: string;
		message?: string;
		confirmText?: string;
		confirmIcon?: string;
		cancelText?: string;
		cancelIcon?: string;
	},
	_resolve: (value: boolean) => void,
) {
	title.value = options.title ?? defaultTitle;
	message.value = options.message ?? defaultMessage;
	confirmText.value = options.confirmText ?? defaultConfirmText;
	confirmIcon.value = options.confirmIcon;
	cancelText.value = options.cancelText ?? defaultCancelText;
	cancelIcon.value = options.cancelIcon;

	resolve.value = _resolve;
	popupRef.value?.instance.show();
}
async function onButtonClick(value: boolean) {
	if (!resolve.value) {
		return;
	}
	popupRef.value?.instance.hide();
	await nextTick();
	resolve.value(value);
}
function onConfirmClick() {
	onButtonClick(true);
}
function onCancelClick() {
	onButtonClick(false);
}
defineExpose({ open });
</script>

<style lang="scss" scoped>
.message {
	font-size: 18px;
}
</style>
