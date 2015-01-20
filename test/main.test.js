var chai = require('chai')
var should = chai.should()
// var pipeline = require('../src/main.js');

describe('Pipeline', function(){
  var pipeline;

  before(function(){
    pipeline = require('../dist/pipeline.js');
  });

  it('should expose a method to create a new app', function(){
    pipeline.createApp.should.exist();
  });

  describe('Creating apps', function(){
    it('Should return a new app', function(){
      var App = pipeline.createApp();
      App.should.be.an('object');
    });

    it('should allow you to create multiple pipeline apps', function(){
      var App1 = pipeline.createApp();
      var App2 = pipeline.createApp();

      App1.should.not.equal(App2);
    })
  });

  describe('A simple pipeline app', function(){
    var App, output;

    beforeEach(function(){
      output = undefined;
      App = pipeline.createApp();
      App.createAction('newNumber', function(number){
        return {data: number};
      });
      App.createStore('numberStore', {
        initialize: function(){
          this.update({number: 0});
        },
        actions: {
          newNumber: function(payload){
            this.update({number: payload.data});
          }
        }
      });
      App.createAdapter('someAdapter', {
        initialize: function(){
          output = this.stores.numberStore.get('number');
        },
        stores: {
          numberStore: function(){
            output = this.stores.numberStore.get('number');
          }
        }
      });

      App.start();
    });

    afterEach(function(){
      output = undefined;
    });

    it('should have created the action', function(){
      App.actions.newNumber.should.exist()
    });

    it('should have created the store', function(){
      App.stores.numberStore.should.exist()
    });

    describe('the adapter', function(){
      it('should have updated the tracking value to the correct value', function(){
        output.should.equal(0)
      });
    });

    describe('sending a single action', function(){
      it('should result in the store updating itself and the adapter reacting to the change', function(){
        App.actions.newNumber(1);
        output.should.equal(1);
      });
    });

    describe('sending multiple actions', function(){
      it('should cause effects synchronously', function(){
        App.actions.newNumber(2);
        output.should.equal(2);
        App.actions.newNumber(3);
        output.should.equal(3);
      });
    });
  });

  describe('An app with two stores where one waits for the other', function(){
    var App, output;

    beforeEach(function(){
      output = undefined;
      App = pipeline.createApp();
      App.createAction('newNumber', function(number){
        return {data: number};
      });
      App.createStore('leader', {
        initialize: function(){
          this.update({number: 0});
        },
        actions: {
          newNumber: function(payload){
            this.update({number: payload.data});
          }
        }
      });
      App.createStore('follower', {
        after: ['leader'],
        initialize: function(){
          this.update({number: 0});
        },
        actions: {
          newNumber: function(payload){
            this.update({number: this.stores.leader.get('number') * 2});
          }
        }
      });
      App.createAdapter('someAdapter', {
        initialize: function(){
          output = this.stores.follower.get('number');
        },
        stores: {
          follower: function(){
            output = this.stores.follower.get('number');
          }
        }
      });

      App.start();
    });

    afterEach(function(){
      output = undefined;
    });

    describe('two stores with an evaluation order', function(){
      it('should evaluate in the correct order', function(){
        App.actions.newNumber(5);
        output.should.equal(10);
      });
    });
  });
});
