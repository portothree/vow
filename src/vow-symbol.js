/**
 * Internal properties of a promise
 * @see {@link https://www.ecma-international.org/ecma-262/11.0/index.html#sec-properties-of-promise-instances}
 */
export const VowSymbol = Object.freeze({
	state: Symbol('VowState'),
	result: Symbol('VowResult'),
	isHandled: Symbol('VowIsHandled'),
	fulfillReactions: Symbol('VowFulfillReactions'),
	rejectReactions: Symbol('VowRejectReactions'),
});
