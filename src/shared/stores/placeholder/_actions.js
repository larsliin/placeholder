export default {
    async set_syncStorage(storageObj) {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-undef
                chrome.storage.sync.set(storageObj, () => {
                    // eslint-disable-next-line no-undef
                    if (chrome.runtime.lastError) {
                        // eslint-disable-next-line no-undef
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async get_syncStorage(id) {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-undef
                chrome.storage.sync.get(id.toString()).then((event) => {
                    resolve(event[id]);
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async delete_syncStorageItem(id) {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-undef
                chrome.storage.sync.remove([id], () => {
                    // eslint-disable-next-line no-undef
                    const error = chrome.runtime.lastError;
                    if (error) {
                        throw (error);
                    }
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    async get_getBytesInUse() {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-undef
                chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
                    // eslint-disable-next-line no-undef
                    if (chrome.runtime.lastError) {
                        // Handle the error if it occurred
                        // eslint-disable-next-line no-undef
                        reject(new Error(chrome.runtime.lastError));
                    } else {
                        const totalLimit = 102 * 1024; // 102 KB in bytes
                        const remainingSpace = totalLimit - bytesInUse;

                        // Calculate the maximum size for the next item
                        const maxItemSize = Math.min(remainingSpace, 8 * 1024);

                        resolve(maxItemSize);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

};
