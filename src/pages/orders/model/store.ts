import { useReactiveIdentifiedArray } from '@/shared/lib/use/base/useReactiveIdentifiedArray';
import type { IOrderListItem } from './types';

const orders = useReactiveIdentifiedArray<IOrderListItem>();
export function useStore() {
	return {
		orders,
	};
}
