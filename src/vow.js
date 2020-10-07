import { isCallable } from './utils.js';

export class Vow {
	constructor(executor) {
		// If the executor is missing then an error is thrown
		if (typeof executor === 'undefined') {
			throw new TypeError('undefined is not a function');
		}

		// If the executor is not a function then an error is thrown
		if (!isCallable(executor)) {
			throw new TypeError('Executor must be a function');
		}
	}
}
