import { onMounted, onUnmounted } from 'vue';
export function useEventListener<T extends keyof GlobalEventHandlersEventMap>(
	target: EventTarget,
    event: T,
	callback: (event: GlobalEventHandlersEventMap[T]) => void,
) {
	function listener(evt: Event) {
		callback(evt as GlobalEventHandlersEventMap[T]);
	}

	onMounted(() => target.addEventListener(event, listener));
	onUnmounted(() => target.removeEventListener(event, listener));
}
