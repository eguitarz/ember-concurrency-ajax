import Ember from 'ember';

const { computed, Controller, inject } = Ember;

export default Controller.extend({
  ecajax: inject.service(),
  tasks: computed.alias('ecajax.tasks'),
  result: Ember.A(),

  init() {
    this._super(...arguments);
    let ecajax = this.get('ecajax');
    ecajax.createTask({ name: 'enqueue', policy: 'enqueue'});
    ecajax.createTask({ name: 'drop', policy: 'drop'});
    ecajax.createTask({ name: 'restartable', policy: 'restartable', maxConcurrency: 5 });
  },

  actions: {
    process(data) {
      let result = this.get('result');
      result.pushObject(data.foo);
    }
  }
});