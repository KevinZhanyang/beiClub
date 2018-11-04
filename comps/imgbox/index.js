'use strict';

Component({
  properties: {
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    src: {
      type: String
    },
    lazy: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    viewimg(e) {
      console.log(e)
      let path = e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [path]
      })
    }
  }

});