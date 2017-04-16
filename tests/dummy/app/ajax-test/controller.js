import Ember from 'ember';
import { task } from 'ember-concurrency';
import { concatTasks } from 'ember-concurrency-ajax/utils';

const { computed, Controller, inject } = Ember;

export default Controller.extend({
  ecajax: inject.service(),
  tasks: computed.alias('ecajax.tasks'),
  result: Ember.A(),
  concatTasks: concatTasks,

  slice: task(function* (val) {
    yield console.log('slicing beef', val);
    return val;
  }),

  pack: task(function* (val) {
    yield console.log('packing beef', val);
  }),

  init() {
    this._super(...arguments);
    let ecajax = this.get('ecajax');
    ecajax.createTask({ name: 'enqueue', policy: 'enqueue'});
    ecajax.createTask({ name: 'drop', policy: 'drop'});
    ecajax.createTask({ name: 'restartable', policy: 'restartable', maxConcurrency: 5 });
    
    this.get('concatTasks').perform(
      ecajax.request('/beef.json'), 
      this.get('slice'),
      this.get('pack')
    );
  },

  actions: {
    process(data) {
      let result = this.get('result');
      result.pushObject(data.foo);
    }
  }
});