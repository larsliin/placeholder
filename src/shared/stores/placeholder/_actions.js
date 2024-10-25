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
};
