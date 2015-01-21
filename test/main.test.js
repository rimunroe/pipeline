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
      // TODO
    });

    it('throws an error when creating three stores with a circular dependency', function(){
      // TODO
    });

    describe('the ways to define dependencies', function(){
      // TODO
    });

  });

});

describe('While starting an app', function(){

  describe('the initialization functions', function(){

    describe('of stores', function(){

      it('is called first', function(){
        // TODO
      });

    });

    describe('of adapters', function(){

      it('is called second', function(){
        // TODO
      });

    });

    describe('of the app', function(){

      it('is called third', function(){
        // TODO
      });

    });

  });

});

describe('While an app is running', function(){

  it('is not possible to create new actions', function(){
    // TODO
  });

  it('is not possible to create new stores', function(){
    // TODO
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


