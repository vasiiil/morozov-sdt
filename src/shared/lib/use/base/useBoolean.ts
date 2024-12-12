import { ref, type Ref } from 'vue';

export interface IUseBoolean {
	value: Ref<boolean>;
	set: (value: boolean) => void;
	setTrue: () => void;
	setFalse: () => void;
	toggle: () => void;
}
export function useBoolean(init: boolean = false): IUseBoolean {
	const value = ref<boolean>(init);

	function set(_value: boolean) {
		value.value = _value;
	}
	function setTrue() {
		value.value = true;
	}
	function setFalse() {
		value.value = false;
	}
	function toggle() {
		value.value = !value.value;
	}

	return {
		value,
		set,
		setTrue,
		setFalse,
		toggle,
	};
}
