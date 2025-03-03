export function generateNumber(min: number = 1, max: number = 99): number {
	return Math.round(Math.random() * (max - min) + min);
}
export function generateString(): string {
	return Math.random().toString(36).substring(2, 15);
}
export function generatePassword(length = 8) {
	const pattern = /[a-zA-Z0-9]/;
	const patterns = [/[a-z]/, /[A-Z]/, /[0-9]/];
	function getRandomByte() {
		// http://caniuse.com/#feat=getrandomvalues
		if (window.crypto && window.crypto.getRandomValues) {
			const result = new Uint8Array(1);
			window.crypto.getRandomValues(result);
			return result[0];
		} else {
			return Math.floor(Math.random() * 256);
		}
	}
	let attempts = 0;
	do {
		attempts++;
		const result = Array.from({ length })
			.map(function () {
				while (true) {
					const result = String.fromCharCode(getRandomByte());
					if (pattern.test(result)) {
						return result;
					}
				}
			})
			.join('');
		if (patterns.every((pattern) => pattern.test(result))) {
			return result;
		}
	} while (attempts < 10000);

	return '';
}
