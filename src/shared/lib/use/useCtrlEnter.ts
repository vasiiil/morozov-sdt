import { useEventListener } from './useEventListener';
export function useCtrlEnter(callback: () => void) {
	useEventListener(document, 'keydown', (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.code === 'Enter') {
			event.preventDefault();
			callback();
		}
	});
}
