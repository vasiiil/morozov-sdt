// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function parseFilter<T = Record<string, unknown>>(
	filter: unknown,
): T | null {
	if (!filter) {
		return null;
	}
	const result = {};

	function _addFilterValueToResult(field, filterValue) {
		const filterValueIsArray = Array.isArray(filterValue);
		if (field in result) {
			if (Array.isArray(result[field])) {
				if (filterValueIsArray) {
					result[field].push(...filterValue);
				} else {
					result[field].push(filterValue);
				}
			} else {
				if (filterValueIsArray) {
					result[field] = [result[field], ...filterValue];
				} else {
					result[field] = [result[field], filterValue];
				}
			}
		} else {
			result[field] = filterValue;
		}
	}

	function _parseFilter(filter: unknown) {
		if ('filterValue' in filter) {
			filter = [filter];
		}

		for (const filterItem of filter) {
			if (typeof filterItem === 'string') {
				continue;
			}
			if ('filterValue' in filterItem) {
				const field =
					typeof filterItem[0] === 'string' ? filterItem[0] : filterItem[0][0];
				const filterValue = filterItem.filterValue;
				_addFilterValueToResult(field, filterValue);
			} else if (Array.isArray(filterItem)) {
				if (filterItem.length === 3) {
					const field = filterItem[0];
					const filterValue = filterItem[2];
					_addFilterValueToResult(field, filterValue);
				} else {
					_parseFilter(filterItem);
				}
			}
		}
	}

	_parseFilter(filter);
	return result;
}
