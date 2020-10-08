import cases from 'jest-in-case';

import { Vow } from '../vow';

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
	});
});
