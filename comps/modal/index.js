'use strict';

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this._showChange(newVal);
      }
    },
    title: String,
    ico: String
  },
  data: {

  },
  methods: {
    _showChange(value) {
      console.log(value);
    }
  }

});