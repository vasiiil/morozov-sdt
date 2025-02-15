import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { BaseConfirm } from '@/shared/ui';

const component = ref<ComponentExposed<typeof BaseConfirm>>();

export function setComponent(_component: ComponentExposed<typeof BaseConfirm>) {
	component.value = _component;
}

export function confirm(options: {
	title?: string;
	message?: string;
	confirmText?: string;
	confirmIcon?: string;
	cancelText?: string;
	cancelIcon?: string;
}) {
	const { promise, resolve } = Promise.withResolvers<boolean>();
	component.value?.open(options, resolve);
	return promise;
}
