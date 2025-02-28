const DB_NAME = "MyReactDatabase";
let DB_VERSION = 1; // Increment this if you need to modify object stores
const PARTICIPANT_STORE = "participants";
const WINNER_STORE = "winners";

export const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            reject("Error opening IndexedDB:", event.target.error);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(PARTICIPANT_STORE)) {
                const store = db.createObjectStore(PARTICIPANT_STORE, { keyPath: "id", autoIncrement: true });
                store.createIndex("name", "name", { unique: true });
                store.createIndex("is_hidden", "is_hidden", { unique: false });
            }

            if (!db.objectStoreNames.contains(WINNER_STORE)) {
                const store = db.createObjectStore(WINNER_STORE, { keyPath: "id", autoIncrement: true });
                store.createIndex("name", "name", { unique: false });
                store.createIndex("participant_id", "participant_id", { unique: false });
                store.createIndex("win_date", "win_date", { unique: true });
            }
        };
    });
};

// Add item to IndexedDB

export const addParticipant = (name: string) => {
    return addItem({ name: name, is_hidden: false }, PARTICIPANT_STORE);
}

export const hideParticipant = (id: number) => {
    return putItem(id, 'is_hidden', true, PARTICIPANT_STORE);
}

export const returnParticipantToPool = (id: number) => {
    return putItem(id, 'is_hidden', false, PARTICIPANT_STORE);
}

export const addWinner = (participant: { name: string, id: number, date: string }) => {
    return addItem({ name: participant.name, participant_id: participant.id, win_date: participant.date }, WINNER_STORE);
}

export const removeWinner = (id: string) => {
    return removeItem(id, WINNER_STORE);
}

export const removeParticipant = (participant: { name: string, id: number }) => {
    return removeItem(participant.id, PARTICIPANT_STORE);
}

const putItem = async (key: any, property: string, newValue: any, storeName: string) => {
    try {
        const db = await openDB();
        const tx = db.transaction([storeName], "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = (event) => {
            console.log(`Item got successfully:`, event.target.result);
            const data = event.target.result;

            if (!data) return 'Not Found'

            data[property] = newValue;

            const requestUpdate = store.put(data);
            requestUpdate.onerror = (event) => {
                console.error('failed update', event)
            };
            requestUpdate.onsuccess = (event) => {
                console.log('success update', event)
            };
        };
        request.onerror = (event) => {
            console.error(`Add failed:`, event.target.error);
        };

        // Ensure transaction completion logging
        tx.oncomplete = () => console.log('Put Item Transaction complete.');
        tx.onerror = (event) => console.error(`Put Item Transaction error:`, event.target.error);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => reject(event.target.error);
        });

    } catch (error) {
        console.error('Unexpected error in putItem:', error);
    }
};


const addItem = async (item: {}, storeName: string) => {

    try {
        const db = await openDB();
        const tx = db.transaction([storeName], "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = (event) => {
            console.log(`Item added successfully:`, event.target.result);
        };

        request.onerror = (event) => {
            console.error(`Add failed:`, event.target.error);
        };

        // Ensure transaction completion logging
        tx.oncomplete = () => console.log('Transaction complete.');
        tx.onerror = (event) => console.error(`Transaction error:`, event.target.error);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => reject(event.target.error);
        });

    } catch (error) {
        console.error('Unexpected error in addItem:', error);
    }

};

const removeItem = async (key: any, storeName: string) => {
    try {
        const db = await openDB();
        const tx = db.transaction([storeName], "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = (event) => {
            console.log(`Item removed successfully:`, event.target.result);
        };

        request.onerror = (event) => {
            console.error(`Remove failed:`, event.target.error);
        };

        // Ensure transaction completion logging
        tx.oncomplete = () => console.log('Remove Transaction complete.');
        tx.onerror = (event) => console.error(`Remove Transaction error:`, event.target.error);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (event) => reject(event.target.error);
        });

    } catch (error) {
        console.error('Unexpected error in Remove:', error);
    }

};

// Get all items from IndexedDB
export const getAllParticipants = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(PARTICIPANT_STORE, "readonly");
        const store = tx.objectStore(PARTICIPANT_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};


export const getAllWinners = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(WINNER_STORE, "readonly");
        const store = tx.objectStore(WINNER_STORE);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};
