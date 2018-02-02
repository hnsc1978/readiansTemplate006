sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
  "use strict";

  return Object.extend('readians.model.common.DataHub',{

    // 모델 및 설정정보
    manifest : null,
    device : null,
    i18n : null,
    help: null,
    mainData : null,
    mainView : null,

    // 구조
    ddic : null,

    // Promise 상수
    REJECTED: 'rejected',
    FULFILLED: 'fulfilled',

    // 필터변수
    mainIconTabFilter : [],
    mainSearchFilter : [],

    // FRAGMENT 이름
    POPUP : {
      POP_FRAGMENT : 'readians.view.popup.PopupFragment'
    },

    // 뷰간데이터이동데이터 선언
    toDetail : null,

    // oData 모델은 모델명으로 변수를 선언해 준다
    odataModel: null,
    URLS : {
      'SERVICE' : '/SERVICE_URL'
    }
  });
});