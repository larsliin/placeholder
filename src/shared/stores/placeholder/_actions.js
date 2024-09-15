export default {
    async set_syncStorage(storageObj) {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line no-undef
                chrome.storage.sync.set(storageObj).then((event) => {
                    resolve(event);
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
};
