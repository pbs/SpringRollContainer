import { SavedDataHandler } from '../SavedDataHandler';
import { BasePlugin } from '../base-plugins';

/**
 * @export
 * @class UserDataPlugin
 * @extends {BasePlugin}
 */
export class UserDataPlugin extends BasePlugin {
  /**
   *Creates an instance of UserDataPlugin.
   * @memberof UserDataPlugin
   */
  constructor() {
    super('UserData-Plugin');
    this.onUserDataRemove = this.onUserDataRemove.bind(this);
    this.onUserDataRead = this.onUserDataRead.bind(this);
    this.onUserDataWrite = this.onUserDataWrite.bind(this);

    this.onIDBAdd = this.onIDBAdd.bind(this);
    this.onIDBOpen = this.onIDBOpen.bind(this);
    this.onIDBRead = this.onIDBRead.bind(this);
    this.onIDBRead = this.onIDBRead.bind(this);
    this.onIDBRemove = this.onIDBRemove.bind(this);
    this.onIDBUpdate = this.onIDBUpdate.bind(this);
    this.onIDBUpdate = this.onIDBUpdate.bind(this);
    this.onIDBClose = this.onIDBClose.bind(this);
    this.IDBReadAll = this.onIDBReadAll.bind(this);
    this.onIDBGetVersion = this.onIDBGetVersion.bind(this);

    this.savedDataHandler = null;
  }

  /**
   *
   *
   * @memberof UserDataPlugin
   */
  init() {
    this.client.on('userDataRemove', this.onUserDataRemove);
    this.client.on('userDataRead', this.onUserDataRead);
    this.client.on('userDataWrite', this.onUserDataWrite);

    this.client.on('IDBOpen', this.onIDBOpen);
    this.client.on('IDBRead', this.onIDBRead);
    this.client.on('IDBAdd', this.onIDBAdd);
    this.client.on('IDBRemove', this.onIDBRemove);
    this.client.on('IDBUpdate', this.onIDBUpdate);
    this.client.on('IDBClose', this.onIDBClose);
    this.client.on('IDBGetVersion', this.onIDBGetVersion);

  }

  /**
   * Handler for the userDataRemove event 
   * @method onUserDataRemove
   * @private
   */
  onUserDataRemove({ data, type }) { 
    SavedDataHandler.remove(data, () => {
      this.client.send(type);
    });
  }

  /**
   * Handler for the userDataRead event
   * @method onUserDataRead
   * @private
   */
  onUserDataRead({ data, type }) {
    SavedDataHandler.read(data, value => this.client.send(type, value));
  }

  /**
   * Handler for the userDataWrite event
   * @method onUserDataWrite
   * @private
   */
  onUserDataWrite({type, data: { name, value } }) {

    SavedDataHandler.write(name, value,  () => this.client.send(type));
  }

  // ----------------------------------------------------------------
  //                      IndexedDB Manipulation        
  // ----------------------------------------------------------------

  /**
   * Open a connection with the IDB Database and optionally add or delete
   * Indexes and stores
   * @param {string} dbName The name of your IndexedDB database
   * @param {string} dbVersion The version number of the database
   * @param {JSON} additions Any additions to the structure of the database
   * @param {array} additions.stores Any stores to be added into the database syntax: 
   * {storeName: '[name]', options: {[optionally add options]}}
   * @param {array} additions.indexes Any Indexes to be added to the database syntax: 
   * {storeName: '[name]', options: {[optionally add options]}}
   */
  onIDBOpen({type, data: {dbName, dbVersion = null, additions = {}, deletions = {} }}) {
    // Keep an instance open to use on open
    this.savedDataHandler = new SavedDataHandler();
    this.savedDataHandler.IDBOpen( dbName, dbVersion, additions, deletions, value => this.client.send(type, value));
  }

  /**
   * Add a record to a given store
   * @param {string} storeName The name of the store from which the record will be updated
   * @param {string} key the key of the record to be updated 
   * @param {*} value The value for the record with the given key to be updated
   */
  onIDBAdd({type, data: { storeName, value, key}}) {
    this.savedDataHandler.IDBAdd(storeName, value, key, value => this.client.send(type, value));
  }
  
  /**
   * Update a record from a given store
   * @param {string} storeName 
   * @param {string} record 
   * @param {string} key 
   * @param {function} callback 
   */
  onIDBUpdate({type, data: { storeName, key, value}}) {
    this.savedDataHandler.IDBUpdate(storeName, key, value, value => this.client.send(type, value));
  }

  /**
   * Remove a record from a store
   * @param {*} storeName The name of the store from which the record will be removed
   * @param {*} key the key of the record to be removed 
   */
  onIDBRemove({type, data: {storeName, key}}) {
    this.savedDataHandler.IDBRemove(storeName, key, value => this.client.send(type, value));
  }

  /**
   * Return a record from a given store with a given key
   * @param {string} storeName 
   * @param {string} key The key for the record in the given store 
   * @param {function} callback The method to call on success or failure. A single value will be passed in
   */
  onIDBRead({type, data: {storeName, key}}) {
    this.savedDataHandler.IDBRead(storeName, key, value => this.client.send(type, value));
  }
  
  /**
   * Get all records from a store
   * @param {string} storeName The store to get all records from
   * @param {integer} count Optionally the count of records to return
   */
  onIDBReadAll({ type, data: {storeName, count} }) {
    this.savedData.IDBReadAll(storeName, count, value => this.client.send(type, value));
  }
  
  /**
   * Get the version of a given database
   * @param {string} dbName The name of the database to return the version of
   */
  onIDBGetVersion({type, data: {dbName}}) {
    const savedDataHandler = new SavedDataHandler();
    savedDataHandler.IDBGetVersion(dbName, value => this.client.send(type, value));
  }
  
  /**
   * 
   */
  onIDBClose({type}) {
    this.savedDataHandler.IDBClose(value => this.client.send(type, value));
  }
}
