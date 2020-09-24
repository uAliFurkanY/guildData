/**
 * Wrapper for FormData-like structures.
 * @param {FormData} formDataLike
 * @example ```js
 * let fd = new FormData();
 * fd.set("foo", "bar");
 * fd.set("123", 456);
 *
 * let wrapper = fdWrapper(fd);
 *
 * console.log(wrapper.foo); // bar
 * console.log(wrapper["123"]); // 456
 *
 * wrapper.foo = "baz";
 * console.log(fd.get("foo")); // baz
 * ```
 * @returns
 */
function fdWrapper(formDataLike) {
	return new Proxy(formDataLike, {
		get(target, prop, receiver) {
			// no key
			if (!prop) return Reflect.get(...arguments);
			else if (target.has(prop)) {
				// db has key/value
				// return value
				return target.get(prop);
			} else {
				// no key/value
				return undefined;
			}
		},
		set(target, prop, value, receiver) {
			// no key
			if (!prop) return Reflect.set(...arguments);
			else {
				// set
				return target.set(prop, value);
			}
		},
	});
}

module.exports = fdWrapper;
