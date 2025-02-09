<template>
	<dx-button
		:element-attr="elementAttr"
		v-bind="props"
	/>
</template>

<script setup lang="ts">
import { DxButton } from 'devextreme-vue';
import type { DxButtonTypes } from 'devextreme-vue/cjs/button';
interface IProps extends /** @vue-ignore */ DxButtonTypes.Properties {
	iconCircleBorder?: boolean;
}
const {
	iconCircleBorder,
	elementAttr: _elementAttr,
	...props
} = defineProps<IProps>();
const classes = ['sdt-button'];
if (_elementAttr?.class) {
	classes.push(_elementAttr.class);
}
if (iconCircleBorder) {
	classes.push('icon-circle-border');
}
const elementAttr = {
	...(_elementAttr ?? {}),
	class: classes.join(' '),
};
</script>

<style lang="scss" scoped>
.sdt-button {
	color: var(--color-text);
	border-color: var(--color-text);
	border-radius: 4px;
	&.icon-circle-border {
		::v-deep(.dx-icon) {
			font-size: 14px;
			border: 1px solid var(--color-text);
			border-radius: 50%;
		}
	}
	&.dx-button-mode-outlined {
		border-top-width: .5px;
		border-right-width: 1.5px;
		border-bottom-width: 1.5px;
		border-left-width: .5px;
	}
}
</style>
