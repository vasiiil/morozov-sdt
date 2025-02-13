<template>
	<dx-button
		:element-attr="elementAttr"
		v-bind="props"
	></dx-button>
</template>

<script setup lang="ts">
import { DxButton } from 'devextreme-vue';
import type { DxButtonTypes } from 'devextreme-vue/cjs/button';
import { getHTMLSize } from '../lib/utils/html';
interface IProps extends /** @vue-ignore */ DxButtonTypes.Properties {
	iconCircleBorder?: boolean;
	borderRadius?: string | number;
	elementClass?: string | string[];
}
const {
	iconCircleBorder,
	elementAttr: _elementAttr,
	borderRadius: _borderRadius,
	elementClass,
	...props
} = defineProps<IProps>();
const classes = ['sdt-button'];
if (elementClass) {
	if (Array.isArray(elementClass)) classes.push(...elementClass);
	else {
		classes.push(elementClass);
	}
}
if (iconCircleBorder) {
	classes.push('icon-circle-border');
}

const elementAttr = {
	...(_elementAttr ?? {}),
	class: classes.join(' '),
};
const borderRadius = getHTMLSize(_borderRadius, '4px');
</script>

<style lang="scss" scoped>
.sdt-button {
	border-radius: v-bind(borderRadius);
}
</style>
