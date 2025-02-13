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
console.log({ classes, _elementAttr, elementAttr });
const borderRadius = getHTMLSize(_borderRadius, '4px');
</script>

<style lang="scss" scoped>
.sdt-button {
	color: var(--color-text);
	border-color: var(--color-text);
	border-radius: v-bind(borderRadius);
	&.icon-circle-border {
		::v-deep(.dx-icon) {
			font-size: 14px;
			border: 1px solid var(--color-text);
			border-radius: 50%;
		}
		&.dx-state-hover {
			::v-deep(.dx-icon) {
				border-color: var(--sdt-c-white);
			}
		}
	}
	&.dx-button-mode-outlined {
		border-top-width: 0.5px;
		border-right-width: 1.5px;
		border-bottom-width: 1.5px;
		border-left-width: 0.5px;
	}
	&.dx-state-hover {
		background-color: var(--color-background-hover);
		&,
		::v-deep(.dx-icon) {
			color: var(--sdt-c-white);
		}
	}
}
</style>
