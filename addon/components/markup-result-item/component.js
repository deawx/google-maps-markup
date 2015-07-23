import Ember from 'ember';
import layout from './template';

const {
  on
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  tagName: 'li',
  classNames: ['list-group-item', 'clearfix'],

  onOver: on('mouseEnter', function () {
    this.sendAction('onover', this.get('data'));
  }),

  onOut: on('mouseLeave', function () {
    this.sendAction('onout', this.get('data'));
  })
});