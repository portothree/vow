import { VowSymbol } from './vow-symbol';
import { isCallable, isObject } from './utils.js';

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

/**
 * spec 25.6.1.3 CreateResolvingFunctions
 *
 * @see {@link https://www.ecma-international.org/ecma-262/11.0/index.html#sec-createresolvingfunctions}
 */
function createResolvingFunctions(vow) {
	/**
	 * alreadyResolved Record { [[Value]]: false }
	 * in a object so ensures the same value is being read
	 * and modified regardless of location
	 *
	 */
	const alreadyResolved = { value: false };

	const resolve = resolution => {
		if (alreadyResolved.value) {
			return;
		}

		alreadyResolved.value = true;

		// can't resolve to the same vow
		if (Object.is(resolution, vow)) {
			return rejectVow(vow, new TypeError('Cannot resolve to self.'));
		}

		// Non object values auto fulfill the vow with the resolution value
		if (!isObject(resolution)) {
			return fulfillVow(vow, resolution);
		}
	};
	const reject = reason => {
		if (alreadyResolved.value) {
			return;
		}

		alreadyResolved.value = true;

		return rejectVow(vow, reason);
	};

	/**
	 * The specification indicates that the `resolve` and `reject`
	 * functions should have properties containing `alreadyResolved`
	 * and the original promise (vow)
	 *
	 */
	resolve.alreadyResolved = alreadyResolved;
	resolve.vow = vow;
	reject.alreadyResolved = alreadyResolved;
	reject.vow = vow;

	return { resolve, reject };
}

/**
 * Based on specification 25.6.1.7 RejectPromise
 *
 * @see {@link https://www.ecma-international.org/ecma-262/11.0/index.html#sec-rejectpromise}
 */
function rejectVow(vow, reason) {
	// Assert the value of [[VowState]] is pending
	if (vow[VowSymbol.state] !== 'pending') {
		throw new Error('Vow is already settled.');
	}

	vow[VowSymbol.result] = reason;
	vow[VowSymbol.fulfillReactions] = undefined;
	vow[VowSymbol.rejectReactions] = undefined;
	vow[VowSymbol.state] = 'rejected';
}

/**
 * Based on specification 25.6.1.4 FulfillPromise
 *
 * @see {@link https://www.ecma-international.org/ecma-262/11.0/index.html#sec-fulfillpromise}
 */
function fulfillVow(vow, value) {
	// Assert the value of [[VowState]] is pending
	if (vow[VowSymbol.state] !== 'pending') {
		throw new Error('Vow is already settled.');
	}

	vow[VowSymbol.result] = value;
	vow[VowSymbol.fulfillReactions] = undefined;
	vow[VowSymbol.rejectReactions] = undefined;
	vow[VowSymbol.state] = 'fulfilled';
}
