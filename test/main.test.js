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
    var App, order;

    beforeEach(function(){
      order = [];

      App = pipeline.createApp({
        initialize: function(){
          order.push('app');
        }
      });

      App.createStore('foo', {
        initialize: function(){
          order.push('store');
        }
      });

      App.createAdapter('boop', {
        initialize: function(){
          order.push('adapter');
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
    var output;

    beforeEach(function(){
      output = 0;
    });

    it('resolves synchronously', function(){

      App.createAction('anAction', function(value){
        return {data: value};
      });

      App.createStore('aStore', {
        actions: {
          anAction: function(payload){
            this.update({number: payload.data});
          }
        }
      });

      App.createAdapter('anAdapter', {
        stores: {
          aStore: function(){
            output = this.stores.aStore.get('number');
          }
        }
      });

      App.start();

      App.actions.anAction(2);
      App.actions.anAction(1);
      output.should.equal(1);

    });

  });

  describe('sending an action', function(){
    var output, order;

    beforeEach(function(){
      output = 0;
      order = [];

      App.createStore('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(){
              order.push('storeA');
              this.update('number', this.stores.storeB.get('number') * 2);
            }
          }
        }
      });

      App.createStore('storeB', {
        actions: {
          newNumber: function(payload){
            order.push('storeB');
            this.update({number: payload.data});
          }
        }
      });

      App.createAdapter('anAdapter', {
        stores: {
          storeA: function(){
            order.push('anAdapter');
            output = this.stores.storeA.get('number');
          }
        }
      });

      App.createAction('newNumber', function(value){
        return {data: value};
      });

      App.start();
      App.actions.newNumber(2);
    });

    it('triggers reactions in the proper order', function(){
      expectedOrder = ['storeB', 'storeA', 'anAdapter'];
      for(var i = 0; i < order.length; i++){
        order[i].should.equal(expectedOrder[i]);
      }
    });

  });

  describe('creating and running another app at the same time', function(){
    var App2, output1, output2;

    beforeEach(function(){
      output1 = 0;
      output2 = 0;

      App2 = pipeline.createApp();

      App.createStore('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(){
              this.update('number', this.stores.storeB.get('number') * 2);
            }
          }
        }
      });

      App.createStore('storeB', {
        actions: {
          newNumber: function(payload){
            this.update({number: payload.data});
          }
        }
      });

      App.createAdapter('anAdapter', {
        stores: {
          storeA: function(){
            output1 = this.stores.storeA.get('number');
          }
        }
      });

      App.createAction('newNumber', function(value){
        return {data: value};
      });

      App.start();

      App2.createAction('newNumber', function(value){
        return {data: value};
      });

      App2.createAdapter('anAdapter', {
        stores: {
          storeA: function(){
            output2 = this.stores.storeA.get('number');
          }
        }
      });

      App2.createStore('storeB', {
        actions: {
          newNumber: function(payload){
            this.update({number: payload.data});
          }
        }
      });

      App2.createStore('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(){
              this.update('number', this.stores.storeB.get('number') * 2);
            }
          }
        }
      });

      App2.start();
    });

    it('does not interfere with the app', function(){
      App.actions.newNumber(3);
      App2.actions.newNumber(6);
      output1.should.equal(6);
      output2.should.equal(12);
    });

  });

});


