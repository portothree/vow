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

		const { resolve, reject } = createResolvingFunctions(this);

		// The executor is executed immediately
		try {
			executor(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}
}

function createResolvingFunctions(vow) {
	const resolve = resolution => {
		vow[VowSymbol.state] = 'fulfilled';
		vow[VowSymbol.result] = resolution;
	};
	const reject = reason => {
		vow[VowSymbol.state] = 'rejected';
		vow[VowSymbol.result] = reason;
	};

	/*
	 * The specification indicates that the `resolve` and `reject`
	 * functions should have properties containing `alreadyResolved`
	 * and the original promise (vow)
	 *
	 * @see {@link https://www.ecma-international.org/ecma-262/11.0/index.html#sec-createresolvingfunctions}
	 */
	const alreadyResolved = { value: false };
	resolve.alreadyResolved = alreadyResolved;
	resolve.vow = vow;
	reject.alreadyResolved = alreadyResolved;
	reject.vow = vow;

	return { resolve, reject };
}
