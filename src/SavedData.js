/**
 * The SavedData functions use localStorage and sessionStorage, with a cookie fallback.
 *
 * @class SavedData
 */
export class SavedData {

  /**
   * 
   */
  constructor(dbName = '') {
    this.db = null;
    this.dbName = dbName;

  }
  /**
   * Remove a saved variable by name.
   * @method remove
   * @static
   * @param {String} name The name of the value to remove
   */
  static remove(name) {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  }

  /**
   * Save a variable.
   * @method write
   * @static
   * @param {String} name The name of the value to save
   * @param {*} value The value to save. This will be run through JSON.stringify().
   * @param {Boolean} [tempOnly=false] If the value should be saved only in the current browser session.
   */
  static write(name, value, tempOnly = false) {

    return tempOnly
      ? sessionStorage.setItem(
        name,
        JSON.stringify('function' === typeof value ? value() : value)
      )
      : localStorage.setItem(
        name,
        JSON.stringify('function' === typeof value ? value() : value)
      );
  }

  /**
   * Read the value of a saved variable
   * @method read
   * @static
   * @param {String} name The name of the variable
   * @return {*} The value (run through `JSON.parse()`) or null if it doesn't exist
   */
  static read(name) { 
    const value = localStorage.getItem(name) || sessionStorage.getItem(name);

    if ('string' === typeof value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return value;
      }
    } else {
      return value;
    }
  }

  /**
   * Open a connection with the IDB Database and optionally add or delete
   * Indexes and stores
   * 
   * @param {string} dbName The name of your IndexedDB database
   * @param {string} dbVersion The version number of the database. Additions and deletions will be ignored if lower than current version number
   * @param {JSON} additions Any additions to the structure of the database
   * @param {array} additions.stores Any stores to be added into the database syntax: {storeName: '[name]', options: {[optionally add options]}}
   * @param {array} additions.indexes Any Indexes to be added to the database syntax: {storeName: '[name]', options: {[optionally add options]}}
   */
  IDBOpen( dbName, dbVersion = null, additions = {}, deletions = {}, callback ) {
    const request = dbVersion ? indexedDB.open(dbName, dbVersion): indexedDB.open(dbName);

    request.onsuccess = e => {

      this.db = e.target.result;

      if (this.db.version == dbVersion) {
        callback('Success: IDBOpen');
      }
    };

    request.onerror = () => {
      callback({result: this.db.error.toString(), success: false});

    };

    // on upgrade needed fires only if the dbVersion is higher than the current version number
    request.onupgradeneeded = e => {
      this.db = e.target.result;

      if (additions != null) {
        if (additions.stores) {
          additions.stores.forEach(store => {
            this.db.createObjectStore(store.storeName, store.options);
            
          });
        }
        if (additions.indexes) {
          additions.indexes.forEach(index => {
            // Open a transaction returning a store object
            const storeObject = request.transaction.objectStore(index.storeName);
            storeObject.createIndex(index.indexName, index.keyPath, index.options);
          });
        }
      }

      if (deletions != null) {
        if (deletions.stores) {
          deletions.stores.forEach((store) => {
            this.db.deleteObjectStore(store.storeName);
          });
        }
        if (deletions.indexes) {
          deletions.indexes.forEach((index) => {
            // Open a transaction returning a store object
            const storeObject = request.transaction.objectStore(index.storeName);
            storeObject.deleteIndex(index.indexName);
          });
        }
      }
      callback({result: 'Success: IDBOpen', success: true});


    };

    request.onerror = () => {
      callback({result: this.db.error.toString(), success: false});
    };
  }

  /**
   * Add a record to a given store
   * @param {string} storeName The name of the store from which the record will be updated
   * @param {string} key the key of the record to be updated 
   * @param {*} value The value for the record with the given key to be updated
   */
  IDBAdd(storeName, value, key, callback) {
    
    if ( !this.db && this.dbName != '') {
      this.IDBOpen(this.dbName);
    }
    
    const tx = this.db.transaction(storeName, 'readwrite');
    tx.onerror = callback({result: tx.error != null ? tx.error.toString() : 'Aborted: No error given, was the record already added?', success: false});
    tx.onabort = callback({result: tx.error != null ? tx.error.toString() : 'Aborted: No error given, was the record already added?', success: false});

    
    tx.oncomplete = () => callback({result: 'Success: Record Added', success: true});
    const store = tx.objectStore(storeName);
    console.log('here');
    store.add(value, key);

    
  }

  /**
   * Update a record in a given store
   * @param {string} storeName 
   * @param {string} key the key of the record to be updated 
   * @param {string | object} value The altered object to be updated from the given store
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBUpdate (storeName, key, value, callback) {
    const tx = this.db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    const updateRequest = store.put(key, value);

    updateRequest.onsuccess = () => {
      callback({result: 'Success: Record Updated', success: true});
    };
  }

  /**
   * Delete a given record within a given store
   * @param {*} storeName 
   * @param {*} key 
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBRemove(storeName, key, callback) {
    if ( !this.db && this.dbName != '') {
      this.IDBOpen(this.dbName);
    }

    const tx = this.db.transaction(storeName, 'readwrite');
    tx.onerror = () => callback({result: this.db.error.toString(), success: false});
    const store = tx.objectStore(storeName);
    store.delete(key);

    tx.oncomplete = () => callback({result: 'Removed Successfully', success: true});

  }

  /**
   * Return a record from a given store with a given key
   * @param {string} storeName 
   * @param {string} key The key for the record in the given store 
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBRead(storeName, key, callback) {
    const tx = this.db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    tx.onerror = () => callback({result: this.db.error.toString(), success: false});
    
    const readRequest = store.get(key);

    readRequest.onsuccess = () => {
      callback({data: readRequest.result});
    };

  }

  /**
   * Get all keys with given index
   * @param {string} query Optionally give a keyRange of records to return
   * @param {string} count Optionally give a max limit on records to be returned
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBGetIndexKeys (storeName, indexName, query = null, count = null, callback = {}) {

    const tx = this.db.transaction(storeName, 'readWrite');
    const store = tx.objectStore(storeName);

    let index;

    tx.onerror = () => callback({result: this.db.error.toString(), success: false});

    if (query && count) {
      index = store.index(indexName, query, count);
    } else if (query) {
      index = store.index(indexName, query);
    } else {
      index = store.index(indexName);
    }

    const getAllKeysRequest = index.getAllKeys();


    getAllKeysRequest.onsuccess = function(e) {
      callback({result : e.result, success: true});
    };
  }

  /**
   * Get all records from a store
   * @param {string} storeName The store to get all records from
   * @param {integer} count Optionally the count of records to return
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBReadAll(storeName, count, callback) {
    const tx = this.db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    
    const readRequest = count != null ? store.getAll(storeName) : store.getAll(storeName, count);

    tx.onerror = () => callback({result: this.db.error.toString(), success: false});


    readRequest.onsuccess = () => {
      callback({result: readRequest.result, success: true});
    };
  }

  /**
   * Get the version number of a given database. This will create a database if it doesn't exist. 
   * Do not call this after opening a connection with 
   * @param {string} dbName The name of the database for which the version will be returned
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBGetVersion(dbName, callback) {
    // Open the database
    const dBOpenRequest = window.indexedDB.open(dbName);

    // these two event handlers act on the database
    // being opened. successfully, or not
    dBOpenRequest.onerror = function() {
      callback({result: dBOpenRequest.error.toString(), success: false});
    };

    dBOpenRequest.onsuccess = function() {
      const db = dBOpenRequest.result;
      callback({result: db.version, success: true});
    };
  }

  /**
   * Closes the connection to the database if open
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  IDBClose(callback) {
    if ( this.db ) {
      this.db.close();
      callback({result: 'Success: Closed Database Connection', success: true});
    } 
  }
  
}
