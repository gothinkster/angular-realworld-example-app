export const SKIP = {};
const DONE = {
	value: null,
	done: true,
};
const RETURN_DONE = {
	// we allow this one to be mutated
	value: null,
	done: true,
};
if (!Symbol.asyncIterator) {
	Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}
const NO_OPTIONS = {};

export class RangeIterable {
	constructor(sourceArray) {
		if (sourceArray) {
			this.iterate = sourceArray[Symbol.iterator].bind(sourceArray);
		}
	}
	map(func) {
		let source = this;
		let iterable = new RangeIterable();
		iterable.iterate = (options = NO_OPTIONS) => {
			const { async } = options;
			let iterator =
				source[async ? Symbol.asyncIterator : Symbol.iterator](options);
			if (!async) source.isSync = true;
			let i = -1;
			return {
				next(resolvedResult) {
					let result;
					do {
						let iteratorResult;
						try {
							if (resolvedResult) {
								iteratorResult = resolvedResult;
								resolvedResult = null; // don't go in this branch on next iteration
							} else {
								i++;
								iteratorResult = iterator.next();
								if (iteratorResult.then) {
									if (!async) {
										this.throw(
											new Error(
												'Can not synchronously iterate with promises as iterator results',
											),
										);
									}
									return iteratorResult.then(
										(iteratorResult) => this.next(iteratorResult),
										(error) => {
											return this.throw(error);
										},
									);
								}
							}
							if (iteratorResult.done === true) {
								this.done = true;
								if (iterable.onDone) iterable.onDone();
								return iteratorResult;
							}
							try {
								result = func.call(source, iteratorResult.value, i);
								if (result && result.then && async) {
									// if async, wait for promise to resolve before returning iterator result
									return result.then(
										(result) =>
											result === SKIP
												? this.next()
												: {
														value: result,
													},
										(error) => {
											if (options.continueOnRecoverableError)
												error.continueIteration = true;
											return this.throw(error);
										},
									);
								}
							} catch (error) {
								// if the error came from the user function, we can potentially mark it for continuing iteration
								if (options.continueOnRecoverableError)
									error.continueIteration = true;
								throw error; // throw to next catch to handle
							}
						} catch (error) {
							if (iterable.handleError) {
								// if we have handleError, we can use it to further handle errors
								try {
									result = iterable.handleError(error, i);
								} catch (error2) {
									return this.throw(error2);
								}
							} else return this.throw(error);
						}
					} while (result === SKIP);
					if (result === DONE) {
						return this.return();
					}
					return {
						value: result,
					};
				},
				return(value) {
					if (!this.done) {
						RETURN_DONE.value = value;
						this.done = true;
						if (iterable.onDone) iterable.onDone();
						iterator.return?.();
					}
					return RETURN_DONE;
				},
				throw(error) {
					if (error.continueIteration) {
						// if it's a recoverable error, we can return or throw without closing the iterator
						if (iterable.returnRecoverableErrors)
							try {
								return {
									value: iterable.returnRecoverableErrors(error),
								};
							} catch (error) {
								// if this throws, we need to go back to closing the iterator
								this.return();
								throw error;
							}
						if (options.continueOnRecoverableError) throw error; // throw without closing iterator
					}
					// else we are done with the iterator (and can throw)
					this.return();
					throw error;
				},
			};
		};
		return iterable;
	}
	[Symbol.asyncIterator](options) {
		if (options) options = { ...options, async: true };
		else options = { async: true };
		return (this.iterator = this.iterate(options));
	}
	[Symbol.iterator](options) {
		return (this.iterator = this.iterate(options));
	}
	filter(func) {
		let iterable = this.map((element) => {
			let result = func(element);
			// handle promise
			if (result?.then)
				return result.then((result) => (result ? element : SKIP));
			else return result ? element : SKIP;
		});
		let iterate = iterable.iterate;
		iterable.iterate = (options = NO_OPTIONS) => {
			// explicitly prevent continue on recoverable error with filter
			if (options.continueOnRecoverableError)
				options = { ...options, continueOnRecoverableError: false };
			return iterate(options);
		};
		return iterable;
	}

	forEach(callback) {
		let iterator = (this.iterator = this.iterate());
		let result;
		while ((result = iterator.next()).done !== true) {
			callback(result.value);
		}
	}
	concat(secondIterable) {
		let concatIterable = new RangeIterable();
		concatIterable.iterate = (options = NO_OPTIONS) => {
			let iterator = (this.iterator = this.iterate(options));
			let isFirst = true;
			function iteratorDone(result) {
				if (isFirst) {
					try {
						isFirst = false;
						iterator =
							secondIterable[
								options.async ? Symbol.asyncIterator : Symbol.iterator
							]();
						result = iterator.next();
						if (concatIterable.onDone) {
							if (result.then) {
								if (!options.async)
									throw new Error(
										'Can not synchronously iterate with promises as iterator results',
									);
								result.then(
									(result) => {
										if (result.done()) concatIterable.onDone();
									},
									(error) => {
										this.return();
										throw error;
									},
								);
							} else if (result.done) concatIterable.onDone();
						}
					} catch (error) {
						this.throw(error);
					}
				} else {
					if (concatIterable.onDone) concatIterable.onDone();
				}
				return result;
			}
			return {
				next() {
					try {
						let result = iterator.next();
						if (result.then) {
							if (!options.async)
								throw new Error(
									'Can not synchronously iterate with promises as iterator results',
								);
							return result.then((result) => {
								if (result.done) return iteratorDone(result);
								return result;
							});
						}
						if (result.done) return iteratorDone(result);
						return result;
					} catch (error) {
						this.throw(error);
					}
				},
				return(value) {
					if (!this.done) {
						RETURN_DONE.value = value;
						this.done = true;
						if (concatIterable.onDone) concatIterable.onDone();
						iterator.return();
					}
					return RETURN_DONE;
				},
				throw(error) {
					if (options.continueOnRecoverableError) throw error;
					this.return();
					throw error;
				},
			};
		};
		return concatIterable;
	}

	flatMap(callback) {
		let mappedIterable = new RangeIterable();
		mappedIterable.iterate = (options = NO_OPTIONS) => {
			let iterator = (this.iterator = this.iterate(options));
			let isFirst = true;
			let currentSubIterator;
			return {
				next(resolvedResult) {
					try {
						do {
							if (currentSubIterator) {
								let result;
								if (resolvedResult) {
									result = resolvedResult;
									resolvedResult = undefined;
								} else result = currentSubIterator.next();
								if (result.then) {
									if (!options.async)
										throw new Error(
											'Can not synchronously iterate with promises as iterator results',
										);
									return result.then((result) => this.next(result));
								}
								if (!result.done) {
									return result;
								}
							}
							let result;
							if (resolvedResult != undefined) {
								result = resolvedResult;
								resolvedResult = undefined;
							} else result = iterator.next();
							if (result.then) {
								if (!options.async)
									throw new Error(
										'Can not synchronously iterate with promises as iterator results',
									);
								currentSubIterator = undefined;
								return result.then((result) => this.next(result));
							}
							if (result.done) {
								if (mappedIterable.onDone) mappedIterable.onDone();
								return result;
							}
							try {
								let value = callback(result.value);
								if (value?.then) {
									if (!options.async)
										throw new Error(
											'Can not synchronously iterate with promises as iterator results',
										);
									return value.then(
										(value) => {
											if (
												Array.isArray(value) ||
												value instanceof RangeIterable
											) {
												currentSubIterator = value[Symbol.iterator]();
												return this.next();
											} else {
												currentSubIterator = null;
												return { value };
											}
										},
										(error) => {
											if (options.continueOnRecoverableError)
												error.continueIteration = true;
											this.throw(error);
										},
									);
								}
								if (Array.isArray(value) || value instanceof RangeIterable)
									currentSubIterator = value[Symbol.iterator]();
								else {
									currentSubIterator = null;
									return { value };
								}
							} catch (error) {
								if (options.continueOnRecoverableError)
									error.continueIteration = true;
								throw error;
							}
						} while (true);
					} catch (error) {
						this.throw(error);
					}
				},
				return() {
					if (mappedIterable.onDone) mappedIterable.onDone();
					if (currentSubIterator) currentSubIterator.return();
					return iterator.return();
				},
				throw(error) {
					if (options.continueOnRecoverableError) throw error;
					if (mappedIterable.onDone) mappedIterable.onDone();
					if (currentSubIterator) currentSubIterator.return();
					this.return();
					throw error;
				},
			};
		};
		return mappedIterable;
	}

	slice(start, end) {
		let iterable = this.map((element, i) => {
			if (i < start) return SKIP;
			if (i >= end) {
				DONE.value = element;
				return DONE;
			}
			return element;
		});
		iterable.handleError = (error, i) => {
			if (i < start) return SKIP;
			if (i >= end) {
				return DONE;
			}
			throw error;
		};
		return iterable;
	}
	mapError(catch_callback) {
		let iterable = this.map((element) => {
			return element;
		});
		let iterate = iterable.iterate;
		iterable.iterate = (options = NO_OPTIONS) => {
			// we need to ensure the whole stack
			// of iterables is set up to handle recoverable errors and continue iteration
			return iterate({ ...options, continueOnRecoverableError: true });
		};
		iterable.returnRecoverableErrors = catch_callback;
		return iterable;
	}
	next() {
		if (!this.iterator) this.iterator = this.iterate();
		return this.iterator.next();
	}
	toJSON() {
		if (this.asArray && this.asArray.forEach) {
			return this.asArray;
		}
		const error = new Error(
			'Can not serialize async iterables without first calling resolving asArray',
		);
		error.resolution = this.asArray;
		throw error;
		//return Array.from(this)
	}
	get asArray() {
		if (this._asArray) return this._asArray;
		let promise = new Promise((resolve, reject) => {
			let iterator = this.iterate(true);
			let array = [];
			let iterable = this;
			Object.defineProperty(array, 'iterable', { value: iterable });
			function next(result) {
				while (result.done !== true) {
					if (result.then) {
						return result.then(next);
					} else {
						array.push(result.value);
					}
					result = iterator.next();
				}
				resolve((iterable._asArray = array));
			}
			next(iterator.next());
		});
		promise.iterable = this;
		return this._asArray || (this._asArray = promise);
	}
	resolveData() {
		return this.asArray;
	}
	at(index) {
		for (let entry of this) {
			if (index-- === 0) return entry;
		}
	}
}
RangeIterable.prototype.DONE = DONE;
