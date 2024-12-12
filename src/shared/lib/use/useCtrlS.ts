import { useEventListener } from './useEventListener';
export function useCtrlS(callback: () => void) {
	useEventListener(document, 'keydown', (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS') {
			event.preventDefault();
			callback();
		}
	});
}
