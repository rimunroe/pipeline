var chai = require('chai');
var pipeline = require('../dist/pipeline.js');
var should = chai.should();

describe('While defining an app', function(){
  var App;

  beforeEach(function(){
    App = pipeline.createApp()
  });

  describe('creating a single store', function(){

    it('throws an error when creating a store which depends on itself', function(){

      var createSelfReferencingStore = function(){
        App.createStore('foo',{
          after: 'foo'
        })
      };

      createSelfReferencingStore.should.throw(Error);

    });

    it('throws an error when using reserved keys in the api object', function(){

      var createStoreWithBadAPIKeys = function(){
        App.createStore('foo',{
          api: {
            stores: undefined
          }
        })
      };

      createStoreWithBadAPIKeys.should.throw(Error);

    });

  });

  describe('creating multiple stores', function(){

    it('throws an error when creating two mutually dependent stores', function(){

      var createCircularReference = function(){
        App.createStore('foo',{
          after: 'bar',
          actions: {
            boop: function(){}
          }
        });

        App.createStore('bar',{
          after: 'foo',
          actions: {
            boop: function(){}
          }
        });
      };

      createCircularReference.should.throw(Error);

    });

    it('throws an error when creating three stores with a circular dependency', function(){

      var createCircularReference = function(){
        App.createStore('foo',{
          after: 'bar',
          actions: {
            boop: function(){}
          }
        });

        App.createStore('bar',{
          after: 'baz',
          actions: {
            boop: function(){}
          }
        });

        App.createStore('baz',{
          after: 'foo',
          actions: {
            boop: function(){}
          }
        });
      };

      createCircularReference.should.throw(Error);

    });

    describe('the ways to define dependencies', function(){
      // TODO
    });

  });

});

describe('While starting an app', function(){

  describe('the initialization functions', function(){
    var App, order, position;

    beforeEach(function(){
      position = 0
      order = new Array(3);

      App = pipeline.createApp({
        initialize: function(){
          order[position] = 'app';
          position += 1;
        }
      });

      App.createStore('foo', {
        initialize: function(){
          order[position] = 'store';
          position += 1;
        }
      });

      App.createAdapter('boop', {
        initialize: function(){
          order[position] = 'adapter';
          position += 1;
        }
      });

      App.start();

    });

    describe('of stores', function(){

      it('are called first', function(){
        order[0].should.equal('store');
      });

    });

    describe('of adapters', function(){

      it('are called second', function(){
        order[1].should.equal('adapter');
      });

    });

    describe('of the app', function(){

      it('is called third', function(){
        order[2].should.equal('app');
      });

    });

  });

});

describe('While an app is running', function(){
  var App;

  beforeEach(function(){
    App = pipeline.createApp();
  });

  it('is not possible to create new actions', function(){
    App.start()
    createAction = function(){
      App.createAction('foo', function(){});
    }
    createAction.should.throw(Error);
  });

  it('is not possible to create new stores', function(){
    App.start()
    createStore = function(){
      App.createStore('foo', function(){});
    }
    createStore.should.throw(Error);
  });

  describe('sending multiple actions in quick succession', function(){

    it('resolves synchronously', function(){
      // TODO
    });

  });

  describe('the reactions of stores to actions', function(){

    it('happen in proper order', function(){
      // TODO
    });

  });

  describe('adapter reactions', function(){

    it('occur in response to stores changing', function(){
      // TODO
    });

  });

  describe('creating and running another app at the same time', function(){

    it('does not interfere with the app', function(){
      // TODO
    });

  });

});


