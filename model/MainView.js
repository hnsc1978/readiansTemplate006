sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "readians/model/common/BaseModel"
], function (JSONModel, BaseModel) {
  "use strict";

  return BaseModel.extend("readians.model.MainView", {

    PATH: {
      MAIN_VIEW: '/',
      BUSY: '/busy',
      REVIEW: '/review',
      WIZARD01: '/wizard01'
    },

    constructor : function (oController, oDataHub) {

      // 입력데이터 설정
      this.controller = oController;
      this.setDataHub(oDataHub);

      // 모델 생성
      this.model = new JSONModel();
      this.setName('mainView');
      this.setTemplate();

      // 모델 등록
      this.controller.getView().setModel(this.model, this.getName());

      // 모델 초기화
      this.initModel();
    },

    /**
     * 모델전체를 초기화하는 로직을 추가한다
     * 모델생성에 대해서 한번 실행된다
     */
    initModel: function() {
      this.set(this.PATH.MAIN_VIEW, _.clone(this.template[this.PATH.MAIN_VIEW]));
    },

    /**
     * 모델항목들의 템플릿을 선언한다
     * 모델에 데이터를 추가할 때 참조정보로 사용된다
     */
    setTemplate: function() {
      this.template[this.PATH.MAIN_VIEW] = this.dataHub.ddic.MAIN_VIEW;
    },

    /*****************************************************************
     * 모델의 정보를 변경하는 메서드를 작성한다
     *****************************************************************/
    /**
     * 화면 busy 설정을 한다
     * @param bSet busy 설정값
     */
    setBusy: function (bSet) {
      this.set(this.PATH.BUSY, bSet);
    },

    setReview: function (bSet) {
      this.set(this.PATH.REVIEW, bSet);
    },

    setValidated: function (sStep, bSet) {
      this.set(this.PATH.WIZARD01 + '/' + sStep, bSet);
    }

  });
});