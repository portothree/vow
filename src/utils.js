export function isCallable(argument) {
	return typeof argument === 'function';
}

export function isObject(argument) {
	return typeof argument === 'object' && argument !== null;
}
