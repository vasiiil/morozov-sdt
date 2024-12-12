import { isDev } from '@/shared/config';

export function traceOnCatch(info: string, error: unknown, addInfo?: unknown) {
	if (!isDev) {
		return;
	}

	console.error('traceOnCatch', { info, error, addInfo });
	console.trace();
}
