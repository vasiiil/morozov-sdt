import { toFormat } from '@/shared/lib/utils/date';
import { generateNumber, generateString } from '@/shared/lib/utils/generate';
import type { IOrderListItem } from './types';

let s = 123456789;
function random() {
	s = (1103515245 * s + 12345) % 2147483647;
	return s % (10 - 1);
}

export function generateData(count: number): IOrderListItem[] {
	let i;
	const surnames = [
		'Smith',
		'Johnson',
		'Brown',
		'Taylor',
		'Anderson',
		'Harris',
		'Clark',
		'Allen',
		'Scott',
		'Carter',
	];
	const names = [
		'James',
		'John',
		'Robert',
		'Christopher',
		'George',
		'Mary',
		'Nancy',
		'Sandra',
		'Michelle',
		'Betty',
	];
	const items: IOrderListItem[] = [];
	const startDate = Date.parse('2022-01-01');
	const endDate = Date.parse('2025-02-22');
	const deliveryTypes = ['Post', '5Post', 'Boxberry', 'Avito', 'Courier'];

	for (i = 0; i < count; i += 1) {
		const nameIndex = random();
		const item: IOrderListItem = {
			id: i + 1,
			amount: generateNumber(10000, 100000) + generateNumber(0, 100) / 100,
			fio: `${names[nameIndex]} ${surnames[random()]}`,
			deliveryType: deliveryTypes[Math.floor(nameIndex / 2)],
			orderDate: toFormat(
				new Date(
					startDate + Math.floor((random() * (endDate - startDate)) / 10),
				),
			),
			deliveryDate: toFormat(
				new Date(
					startDate + Math.floor((random() * (endDate - startDate)) / 10),
				),
			),
			executorNumber: generateString(),
			customerNumber: generateNumber(100000, 999999),
		};
		items.push(item);
	}

	return items;
}
