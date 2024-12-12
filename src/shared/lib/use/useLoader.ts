import { computed, reactive, type ComputedRef } from 'vue';
import { generateString } from '../utils/generate';

export interface IUseLoader {
	isLoading: ComputedRef<boolean>;
	startLoading: () => void;
	stopLoading: () => void;
	runWithLoading: <T = unknown>(handler: () => Promise<T>) => Promise<T>;
}

const runningLoaders = reactive<Set<string>>(new Set());
const isLoading = computed(() => runningLoaders.size > 0);

export function useLoader(): IUseLoader {
	const id = generateString();

	function startLoading() {
		runningLoaders.add(id);
	}
	function stopLoading() {
		runningLoaders.delete(id);
	}
	async function runWithLoading<T = unknown>(
		handler: () => Promise<T>,
	): Promise<T> {
		try {
			startLoading();
			return await handler();
		} catch (error) {
			throw error;
		} finally {
			stopLoading();
		}
	}

	return { isLoading, startLoading, stopLoading, runWithLoading };
}
