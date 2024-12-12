import { useEventListener } from './useEventListener';
export function useEscape(callback: () => void) {
	useEventListener(document, 'keydown', (event: KeyboardEvent) => {
		if (event.code === 'Escape') {
			event.preventDefault();
			callback();
		}
	});
}
