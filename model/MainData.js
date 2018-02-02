sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "readians/model/common/BaseModel"
], function (JSONModel, BaseModel) {
  "use strict";

  return BaseModel.extend("readians.model.MainData", {

    /**
     * 모델경로 또는 템플릿 경로
     */
    PATH: {
      MAIN_DATA: '/',
      MAIN_HEADER: '/MainHeader',
      MAIN_CONTENT: '/MainContent',
      LIST: '/List',
      POPUP: '/Popup',
      POPUP_LIST: '/PopupList'
    },

    /**
     * 초기화 로직 : 변경 불가
     * @param oController
     * @param oDataHub
     */
    constructor : function (oController, oDataHub) {
      // 입력데이터 설정
      this.controller = oController;
      this.setDataHub(oDataHub);

      // 모델 생성
      this.model = new JSONModel();
      this.setName('mainData');
      this.setTemplate();

      // 모델 등록
      this.controller.getView().setModel(this.model, this.getName());

      // 모델 초기화
      this.initModel();
    },

    /**
     * 모델초기화 : 사용자 추가 필요
     */
    initModel: function () {
      this.set(this.PATH.MAIN_DATA, _.cloneDeep(this.template[this.PATH.MAIN_DATA]));
      this.set(this.PATH.MAIN_HEADER, _.cloneDeep(this.template[this.PATH.MAIN_HEADER]));
      this.set(this.PATH.MAIN_CONTENT, _.cloneDeep(this.template[this.PATH.MAIN_CONTENT]));
      this.set(this.PATH.LIST, []);
      this.set(this.PATH.POPUP, _.cloneDeep(this.template[this.PATH.POPUP]));
    },

    /**
     * 템플릿 초기화 : 템플릿을 이용한 데이터를 생성할 때 사용
     */
    setTemplate: function() {
      this.template[this.PATH.MAIN_DATA] = this.dataHub.ddic.MAIN_DATA;
      this.template[this.PATH.MAIN_HEADER] = this.dataHub.ddic.MAIN_HEADER;
      this.template[this.PATH.MAIN_CONTENT] = this.dataHub.ddic.MAIN_CONTENT;
      this.template[this.PATH.LIST] = this.dataHub.ddic.LIST;
      this.template[this.PATH.POPUP] = this.dataHub.ddic.POPUP_FRAGMENT;
      this.template[this.PATH.POPUP_LIST] = this.dataHub.ddic.POPUP_FRAGMENT_LIST;
    }

  });
});