import { Vow } from '../vow';

describe('Vow', () => {
	describe('new Vow()', () => {
		test('throw an error if the executor is missing', () => {
			expect(() => new Vow()).toThrowError(/not a function/);
		});
	});
});
