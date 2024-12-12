export function useStack<T = unknown>() {
	const stack: T[] = [];
	function add(value: T) {
		stack.push(value);
	}
	function remove() {
		stack.pop();
	}
	function isLast(value: T) {
		return stack.length > 0 && stack.at(-1) === value;
	}
	function removeIfLast(value: T) {
		if (isLast(value)) {
			remove();
		}
	}

	return { add, isLast, remove, removeIfLast };
}
