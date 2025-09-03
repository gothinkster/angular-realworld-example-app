import { EventEmitter } from 'events';
import { setExternals, setNativeFunctions, Dbi, version } from './native.js';
import { arch, tmpdir, platform, endianness } from 'os';
import fs from 'fs';
import { Encoder as MsgpackrEncoder } from 'msgpackr';
import { WeakLRUCache } from 'weak-lru-cache';
import * as orderedBinary from 'ordered-binary';


orderedBinary.enableNullTermination();
setExternals({
	arch, fs, tmpdir, MsgpackrEncoder, WeakLRUCache, orderedBinary,
	EventEmitter, os: platform(), onExit(callback) {
		if (process.getMaxListeners() < process.listenerCount('exit') + 8)
			process.setMaxListeners(process.listenerCount('exit') + 8);
		process.on('exit', callback);
	}, isLittleEndian: endianness() == 'LE'
});
export { toBufferKey as keyValueToBuffer, compareKeys, compareKeys as compareKey, fromBufferKey as bufferToKeyValue } from 'ordered-binary';
export { ABORT, IF_EXISTS, asBinary } from './write.js';
import { ABORT, IF_EXISTS, asBinary } from './write.js';
export { levelup } from './level.js';
export { SKIP } from './util/RangeIterable.js';
import { levelup } from './level.js';
export { clearKeptObjects, version } from './native.js';
import { nativeAddon } from './native.js';
export let { noop } = nativeAddon;
export const TIMESTAMP_PLACEHOLDER = (() => {
	if (endianness() == 'BE') {
		return new Uint8Array([0,0,0,0,1,1,1,1]);
	} else {
		return new Uint8Array([1,1,1,1,0,0,0,0]);
	}
})();
export const DIRECT_WRITE_PLACEHOLDER = (() => {
	if (endianness() == 'BE') {
		return new Uint8Array([0,0,0,0,2,1,1,1]);
	} else {
		return new Uint8Array([1,1,1,2,0,0,0,0]);
	}
})();
export function setSpecialWriteValue(destArray, placeholder, uint32Value) {
	destArray.set(placeholder);
	let uint32 = new Uint32Array(destArray.buffer, 0, 2);
	endianness() == 'BE' ? uint32[0] = uint32Value : uint32[1] = uint32Value;
}
export { open, openAsClass, getLastVersion, allDbs, getLastTxnId } from './open.js';
import { toBufferKey as keyValueToBuffer, compareKeys as compareKey, fromBufferKey as bufferToKeyValue } from 'ordered-binary';
import { open, openAsClass, getLastVersion } from './open.js';
export const TransactionFlags = {
	ABORTABLE: 1,
	SYNCHRONOUS_COMMIT: 2,

	NO_SYNC_FLUSH: 0x10000,
};
export default {
	open, openAsClass, getLastVersion, compareKey, keyValueToBuffer, bufferToKeyValue, ABORT, IF_EXISTS, asBinary, levelup, TransactionFlags, version
};
