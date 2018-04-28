/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
  'use strict';

  var subject, model, view;

  // Sets up the model with data and delegation functions
  var setUpModel = function (todos) {
    model.read.and.callFake(function (query, callback) {
      callback = callback || query;
      callback(todos);
    });

    model.getCount.and.callFake(function (callback) {
      var todoCounts = {
        active: todos.filter(function (todo) {
          return !todo.completed;
        }).length,
        completed: todos.filter(function (todo) {
          return !!todo.completed;
        }).length,
        total: todos.length
      };

      callback(todoCounts);
    });

    model.remove.and.callFake(function (id, callback) {
      callback();
    });

    model.create.and.callFake(function (title, callback) {
      callback();
    });

    model.update.and.callFake(function (id, updateData, callback) {
      callback();
    });
  };

  // Returns a stub of the View class
  var createViewStub = function () {
    var eventRegistry = {};
    return {
      render: jasmine.createSpy('render'),
      bind: function (event, handler) {
        eventRegistry[event] = handler;
      },
      trigger: function (event, parameter) {
        eventRegistry[event](parameter);
      }
    };
  };

  // 
  beforeEach(function () {

    // Set model to a spy object with several spy functions 
    // that are required for initializing the Controller.
    model = jasmine.createSpyObj('model', [
      'read',
      'getCount',
      'remove',
      'create',
      'update'
    ]);

    // Set view to a stub that contains a render spy and a 
    // bind function (required when initializing the Controller),
    // and a trigger function which allows for manually triggering events in the view
    view = createViewStub();

    // Initialize a new Controller providing the bare model and view stub.
    subject = new app.Controller(model, view);

  });

  it('should show entries on start-up', function () {

    // TODO: write test
    // ### START EDIT

    // Define some todos and set up the model
    var todo = { title: 'my todo' };
    setUpModel([todo]);

    // Init default view
    subject.setView('');

    // Expect
    expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

    // ### END EDIT

  });

  describe('routing', function () {
    it('should show all entries without a route', function () {
      var todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show all entries without "all" route', function () {
      var todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('#/');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show active entries', function () {

      // TODO: write test
      // ### START EDIT

      // Define some todos that are not and set up the model
      var todo = { title: 'my todo', completed: false };
      setUpModel([todo]);

      // Init the active view
      subject.setView('#/active');

      // Expect to fetch only active todos
      expect(model.read).toHaveBeenCalledWith(
        { completed: false },
        jasmine.any(Function)
      );

      // Expect
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

      // ### END EDIT

    });

    it('should show completed entries', function () {

      // TODO: write test
      // ### START EDIT

      // Define some todos that are completed and set up the model
      var todo = { title: 'my todo', completed: true };
      setUpModel([todo]);

      // Init the completed view
      subject.setView('#/completed');

      // Expect to fetch only completed todos
      expect(model.read).toHaveBeenCalledWith(
        { completed: true },
        jasmine.any(Function)
      );

      // Expect
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

      // ### END EDIT

    });
  });

  it('should show the content block when todos exists', function () {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: true
    });
  });

  it('should hide the content block when no todos exists', function () {
    setUpModel([]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: false
    });
  });

  it('should check the toggle all button, if all todos are completed', function () {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('toggleAll', {
      checked: true
    });
  });

  it('should set the "clear completed" button', function () {
    var todo = { id: 42, title: 'my todo', completed: true };
    setUpModel([todo]);
    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
      completed: 1,
      visible: true
    });
  });

  it('should highlight "All" filter by default', function () {

    // TODO: write test
    // ### START EDIT

    // Set up model with an empty arrays (no todos are needed for this test)
    setUpModel([]);

    // Init the default view
    subject.setView('');

    // Expect
    expect(view.render).toHaveBeenCalledWith('setFilter', '');

    // ### END EDIT

  });

  it('should highlight "Active" filter when switching to active view', function () {

    // TODO: write test
    // ### START EDIT

    // Set up model with an empty arrays (no todos are needed for this test)
    setUpModel([]);

    // Init the active view
    subject.setView('#/active');

    // Expect
    expect(view.render).toHaveBeenCalledWith('setFilter', 'active');

    // ### END EDIT

  });

  describe('toggle all', function () {

    // Both test in this suite needs a couple of todos and having them all toggled to complete
    beforeEach(function () {
      var todos = [
        { title: 'my todo', completed: false, id: 43 },
        { title: 'your todo', completed: false, id: 44 }
      ];
      setUpModel(todos);
      subject.setView('');
      view.trigger('toggleAll', { completed: true });
    });

    it('should toggle all todos to completed', function () {

      // TODO: write test
      // ### START EDIT

      // Expect the model update method to have updated both todos to completed
      expect(model.update).toHaveBeenCalledWith(
        43,
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.update).toHaveBeenCalledWith(
        44,
        { completed: true },
        jasmine.any(Function)
      );

      // ### END EDIT

    });

    it('should update the view', function () {

      // TODO: write test
      // ### START EDIT

      // Expect the render method to call the view method _elementComplete
      // which will toggle the todo in the UI
      expect(view.render).toHaveBeenCalledWith('elementComplete', {
        id: 43,
        completed: true
      });
      expect(view.render).toHaveBeenCalledWith('elementComplete', {
        id: 44,
        completed: true
      });

      // ### END EDIT

    });
  });

  describe('new todo', function () {

    // Set up model with an empty array (no todos are required for this test)
    // and init the default view
    beforeEach(function () {
      setUpModel([]);
      subject.setView('');
    });

    it('should add a new todo to the model', function () {

      // TODO: write test
      // ### START EDIT

      // Trigger the newTodo event in the view 
      view.trigger('newTodo', 'a new todo');

      // Expect model.create to have been called with the createinfo from the view event
      expect(model.create).toHaveBeenCalledWith(
        'a new todo',
        jasmine.any(Function)
      );

      // ### END EDIT

    });

    it('should add a new todo to the view', function () {

      // ### START EDIT
      // - Moved some setup logic to beforeEach
      // ### END EDIT

      view.render.calls.reset();
      model.read.calls.reset();
      model.read.and.callFake(function (callback) {
        callback([
          {
            title: 'a new todo',
            completed: false
          }
        ]);
      });
      view.trigger('newTodo', 'a new todo');
      expect(model.read).toHaveBeenCalled();
      expect(view.render).toHaveBeenCalledWith('showEntries', [
        {
          title: 'a new todo',
          completed: false
        }
      ]);

    });

    it('should clear the input field when a new todo is added', function () {

      // ### START EDIT
      // - Moved some setup logic to beforeEach
      // ### END EDIT

      view.trigger('newTodo', 'a new todo');
      expect(view.render).toHaveBeenCalledWith('clearNewTodo');

    });
  });

  describe('element removal', function () {

    // Set up model with a todo and init the default view
    beforeEach(function () {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);
      subject.setView('');
    });

    it('should remove an entry from the model', function () {

      // TODO: write test
      // ### START EDIT

      // Trigger the view event for itemRemove for the todo assigned in beforeEach
      view.trigger('itemRemove', { id: 42 });

      // Expect
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));

      // ### END EDIT

    });

    it('should remove an entry from the view', function () {

      // ### START EDIT
      // - Moved some setup logic to beforeEach
      // ### END EDIT
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });

    it('should update the element count', function () {
      // ### START EDIT
      // - Moved some setup logic to beforeEach
      // ### END EDIT
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
    });
  });

  describe('remove completed', function () {
    it('should remove a completed entry from the model', function () {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(model.read).toHaveBeenCalledWith(
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });

    it('should remove a completed entry from the view', function () {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });
  });

  describe('element complete toggle', function () {
    it('should update the model', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 21, completed: true });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { completed: true },
        jasmine.any(Function)
      );
    });

    it('should update the view', function () {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 42, completed: false });

      expect(view.render).toHaveBeenCalledWith('elementComplete', {
        id: 42,
        completed: false
      });
    });
  });

  describe('edit item', function () {
    it('should switch to edit mode', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEdit', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItem', {
        id: 21,
        title: 'my todo'
      });
    });

    it('should leave edit mode on done', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'new title'
      });
    });

    it('should persist the changes on done', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { title: 'new title' },
        jasmine.any(Function)
      );
    });

    it('should remove the element from the model when persisting an empty title', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
    });

    it('should remove the element from the view when persisting an empty title', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(view.render).toHaveBeenCalledWith('removeItem', 21);
    });

    it('should leave edit mode on cancel', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'my todo'
      });
    });

    it('should not persist the changes on cancel', function () {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(model.update).not.toHaveBeenCalled();
    });
  });
});
