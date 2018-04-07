/*jshint eqeqeq:false */
(function(window) {
  'use strict';

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function() {};
    this._dbName = name;
    if (!localStorage[name]) {
      var data = {
        todos: []
      };
      localStorage[name] = JSON.stringify(data);
    }

    // ### START EDIT
    // - Use a cache property due to accesing memory is faster than accessing disk or AJAX

    // callback.call(this, JSON.parse(localStorage[name]));
    this._cache = JSON.parse(localStorage[name]);
    callback.call(this, this._cache);

    // ### END EDIT
  }

  /**
   * Finds items based on a query given as a JS object
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
   * });
   */
  Store.prototype.find = function(query, callback) {
    if (!callback) {
      return;
    }

    // ### START EDIT
    // - Fetch todos from cache instead

    // var todos = JSON.parse(localStorage[this._dbName]).todos;
    var todos = this._cache.todos;

    // ### END EDIT

    callback.call(
      this,
      todos.filter(function(todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function(callback) {
    callback = callback || function() {};

    // ### START EDIT
    // - Fetch todos from cache instead

    // callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    callback.call(this, this._cache.todos);

    // ### END EDIT
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function(updateData, callback, id) {
    // ### START EDIT
    // - Fetch todos from cache instead

    // var data = JSON.parse(localStorage[this._dbName]);
    var data = this._cache;

    // ### END EDIT

    var todos = data.todos;
    callback = callback || function() {};

    // ### START EDIT
    // - Only generate an ID if needed - moved into else block below.

    // Generate an ID
    // var newId = '';
    // var charset = '0123456789';
    // for (var i = 0; i < 6; i++) {
    //   newId += charset.charAt(Math.floor(Math.random() * charset.length));
    // }

    // ### END EDIT

    // If an ID was actually given, find the item and update each property
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      // ### START EDIT
      // - Moved to after if/else instead of having duplicate code. It needs to run in both situations.

      // localStorage[this._dbName] = JSON.stringify(data);

      // ### END EDIT

      callback.call(this, todos);
    } else {
      // ### START EDIT
      // - Assign an ID

      // TODO: Can this be generated in a safer (unique) manner? Timestamp? Sequentially or auto increase somehow?
      var newId = '';
      var charset = '0123456789';
      for (var i = 0; i < 6; i++) {
        newId += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      // ### END EDIT

      updateData.id = parseInt(newId);
      todos.push(updateData);

      // ### START EDIT
      // - Moved to after if/else instead of having duplicate code. It needs to run in both situations.

      // localStorage[this._dbName] = JSON.stringify(data);

      // ### END EDIT

      callback.call(this, [updateData]);
    }

    localStorage[this._dbName] = JSON.stringify(data);
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function(id, callback) {
    // ### START EDIT
    // - Fetch todos from cache instead

    // var data = JSON.parse(localStorage[this._dbName]);

    var data = this._cache;

    // ### END EDIT

    var todos = data.todos;

    // ### START EDIT
    // - Redundant var

    // var todoId;

    // ### END EDIT

    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        // ### START EDIT
        // - Redundant var

        // todoId = todos[i].id;

        // ### END EDIT

        todos.splice(i, 1);
      }
    }

    // ### START EDIT
    // - Redundant after moving splice to above for loop

    // for (var i = 0; i < todos.length; i++) {
    //   if (todos[i].id == todoId) {
    //     todos.splice(i, 1);
    //   }
    // }

    // ### END EDIT

    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, todos);
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function(callback) {
    // ### START EDIT
    // - Replaced by cache object

    // var data = { todos: [] };
    // localStorage[this._dbName] = JSON.stringify(data);
    // callback.call(this, data.todos);
    this._cache = { todos: [] };
    localStorage[this._dbName] = JSON.stringify(this._cache);
    callback.call(this, this._cache.todos);

    // ### END EDIT
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
