import cases from 'jest-in-case';

import { Vow } from '../vow';
import { VowSymbol } from '../vow-symbol';

describe('Vow', () => {
	describe('new Vow()', () => {
		test('throw an error if the executor is missing', () => {
			expect(() => new Vow()).toThrowError(/not a function/);
		});

		cases(
			'throw an error if the executor is not a function',
			opts => {
				expect(() => new Vow(opts.executor)).toThrowError(
					/must be a function/
				);
			},
			[
				{ name: 'String', executor: 'random' },
				{ name: 'Number', executor: 1 },
				{ name: 'Array', executor: [] },
				{ name: 'Object', executor: {} },
			]
		);

		test('initialize in pending state', () => {
			const vow = new Vow((resolve, reject) => {});

			expect(vow[VowSymbol.state]).toEqual('pending');
		});

		test('should be in fulfilled state when the executor calls resolve()', () => {
			const state = 'fulfilled';
			const result = 5;

			const vow = new Vow((resolve, reject) => {
				resolve(result);
			});

			expect(vow[VowSymbol.state]).toEqual(state);
			expect(vow[VowSymbol.result]).toEqual(result);
		});

		test('should be in rejected state when when the executor calls reject()', () => {
			const state = 'rejected';
			const result = new Error();

			const vow = new Vow((resolve, reject) => {
				reject(result);
			});

			expect(vow[VowSymbol.state]).toEqual(state);
			expect(vow[VowSymbol.result]).toEqual(result);
		});
	});
});
