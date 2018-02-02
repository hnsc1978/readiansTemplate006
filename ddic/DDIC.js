sap.ui.define([
  "sap/ui/base/Object"
], function (Object) {
  "use strict";

  return Object.extend('readians.template002.ddic.DDIC', {

    constructor: function () {

      // 프로그램에서 기본 Structure를 확장하여 사용하는 경우에 아래와 같이 구조를 선언하여 사용
      this.LIST_DETAIL = _.assign(_.cloneDeep(this.BTA_CONFIRM), {
        "FieldAdd01" : "", //추가필드1
        "FieldAdd02" : ""  //추가필드2
      });

    },

    //뷰
    MAIN_VIEW : {
      busy: false,
      review : false,
      wizard01 : {
        wizard01_Step01: false,
        wizard01_Step02: false,
        wizard01_Step03: false,
        wizard01_Step04: false
      }
    },

    //도움말
    HELP: {
      title: '',
      info: ''
    },

    //프로그램에서 사용하는 Structure를 선언한다
    MAIN_DATA: {

    },

    MAIN_HEADER: {
      "Field01": '',
      "Field02": '',
      "Field03": '',
      "Field04": '0'
    },

    MAIN_CONTENT: {
      "Step01": false,
      "Step02": false,
      "Step03": false,
      "Step04": false
    },

    LIST: {
      "Field01": "",     //필드1
      "Field02": ""      //필드2
    },

    //프레그먼트 - POPUP
    POPUP_FRAGMENT: {
      input01: 'test',
      PopupList: []
    },

    POPUP_FRAGMENT_LIST: {
      field01: '',
      field02: '',
      field03: ''
    }

    //게이트웨이의 Entity Type정보

  });
});