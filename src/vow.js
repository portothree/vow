import { VowSymbol } from './vow-symbol';
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

		// Initialize properties
		this[VowSymbol.state] = 'pending';
		this[VowSymbol.result] = undefined;
		this[VowSymbol.isHandled] = false;
		this[VowSymbol.fulfillReactions] = [];
		this[VowSymbol.rejectReactions] = [];

		const { resolve, reject } = createResolvingFunctions(vow);

		// The executor is executed immediately
		try {
			executor(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}
}

function createResolvingFunctions(vow) {
	const resolve = resolution => {};
	const reject = reason => {};

	return { resolve, reject };
}
