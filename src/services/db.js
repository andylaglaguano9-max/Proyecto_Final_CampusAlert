import { openDB } from 'idb';

const DB_NAME = 'CampusAlertDB';
const STORE_NAME = 'offline_incidents';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveOfflineIncident = async (incident) => {
  const db = await initDB();
  return db.add(STORE_NAME, { ...incident, timestamp: Date.now() });
};

export const getOfflineIncidents = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearOfflineIncident = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};
