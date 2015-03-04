var chai = require('chai');
var pipeline = require('../build/pipeline.js');
var should = chai.should();

describe('While defining an app', function(){
  var App;

  beforeEach(function(){
    App = pipeline.createApp();
  });

  describe('the ways to define dependencies', function(){
    // TODO
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

      App.create.store('foo', {
        initialize: function(){
          order.push('store');
        }
      });

      App.create.adapter('boop', {
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

  describe('store definition', function(){
    beforeEach(function(){
      App = pipeline.createApp();
    });

    it('throws an error when creating a store which depends on itself', function(){

      var createSelfReferencingStore = function(){
        App.create.store('foo',{
          after: 'foo'
        });
      };

      createSelfReferencingStore.should.throw(Error);

    });

    it('throws an error when using reserved keys in the api object', function(){

      var createStoreWithBadAPIKeys = function(){
        App.create.store('foo',{
          api: {
            stores: undefined
          }
        });
      };
      createStoreWithBadAPIKeys.should.throw(Error);

    });

    describe('creating multiple stores', function(){

      it('throws an error when creating two mutually dependent stores', function(){

        App.create.store('foo',{
          after: 'bar',
          actions: {
            boop: function(){}
          }
        });

        App.create.store('bar',{
          after: 'foo',
          actions: {
            boop: function(){}
          }
        });

        App.start.should.throw(Error);

      });

      it('throws an error when creating three stores with a circular dependency', function(){

        App.create.store('foo',{
          after: 'bar',
          actions: {
            boop: function(){}
          }
        });

        App.create.store('bar',{
          after: 'baz',
          actions: {
            boop: function(){}
          }
        });

        App.create.store('baz',{
          after: 'foo',
          actions: {
            boop: function(){}
          }
        });

        App.start.should.throw(Error);

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
    App.start();
    createAction = function(){
      App.create.action('foo', function(){});
    };
    createAction.should.throw(Error);
  });

  it('is not possible to create new stores', function(){
    App.start();
    createStore = function(){
      App.create.store('foo', function(){});
    };
    createStore.should.throw(Error);
  });

  describe('sending multiple actions in quick succession', function(){
    var output;

    beforeEach(function(){
      output = 0;
    });

    it('resolves synchronously', function(){

      App.create.action('anAction', function(val){
        return {val: true};
      });

      App.create.store('aStore', {
        actions: {
          anAction: function(val){
            this.update({val: val});
          }
        }
      });

      App.create.adapter('anAdapter', {
        stores: {
          aStore: function(){
            // console.log(this.stores.aStore.get('val'));
            output = this.stores.aStore.get('val');
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

      App.create.store('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(payload, stores){
              order.push('storeA');
              this.update('number', stores.storeB.get('number') * 2);
            }
          }
        }
      });

      App.create.store('storeB', {
        actions: {
          newNumber: function(payload){
            order.push('storeB');
            this.update({number: payload.data});
          }
        }
      });

      App.create.adapter('anAdapter', {
        stores: {
          storeA: function(){
            order.push('anAdapter');
            output = this.stores.storeA.get('number');
          }
        }
      });

      App.create.action('newNumber', function(value){
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

  describe('with branching store dependencies', function(){
    var output, order;

    beforeEach(function(){
      output = 0;
      order = [];

      App.create.store('A', {
        actions: {
          newNumber: {
            after: 'B',
            action: function(num, stores){
              order.push('A');
              this.update('number', stores.B.get('number') * 2);
            }
          }
        }
      });
      App.create.store('F', {
        actions: {
          newNumber: function(num){
            order.push('F');
            this.update({number: num * 3});
          }
        }
      });
      App.create.store('E', {
        actions: {
          newNumber: function(num){
            order.push('E');
            this.update({number: num * 2});
          }
        }
      });

      App.create.store('B', {
        actions: {
          newNumber: {
            after: ['D', 'E'],
            action: function(num, stores){
              order.push('B');
              this.update('number', stores.D.get('number') * stores.E.get('number'));
            }
          }
        }
      });

      App.create.store('C', {
        actions: {
          newNumber: {
            after: ['F'],
            action: function(num, stores){
              order.push('C');
              this.update({number: stores.F.get('number') * 3});
            }
          }
        }
      });

      App.create.store('D', {
        actions: {
          newNumber: {
            after: ['F'],
            action: function(num, stores){
              order.push('D');
              this.update({number: Math.pow(stores.F.get('number'), 2)});
            }
          }
        }
      });

      App.create.action('newNumber', function(value){
        return {num: true};
      });

      App.start();
      App.actions.newNumber(2);
    });

    it('triggers reactions in the proper order', function(){
      expectedOrder = ['F', 'E', 'C', 'D', 'B', 'A'];
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

      App.create.store('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(num, stores){
              this.update('number', stores.storeB.get('number') * 2);
            }
          }
        }
      });

      App.create.store('storeB', {
        actions: {
          newNumber: function(num){
            this.update({number: num});
          }
        }
      });

      App.create.adapter('anAdapter', {
        stores: {
          storeA: function(){
            output1 = this.stores.storeA.get('number');
          }
        }
      });

      App.create.action('newNumber', function(value){
        return {data: value};
      });

      App.start();

      App2.create.action('newNumber', function(value){
        return {data: value};
      });

      App2.create.adapter('anAdapter', {
        stores: {
          storeA: function(){
            output2 = this.stores.storeA.get('number');
          }
        }
      });

      App2.create.store('storeB', {
        actions: {
          newNumber: function(num){
            this.update({number: num});
          }
        }
      });

      App2.create.store('storeA', {
        actions: {
          newNumber: {
            after: 'storeB',
            action: function(num, stores){
              this.update('number', stores.storeB.get('number') * 2);
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
