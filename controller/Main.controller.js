sap.ui.define([
  "readians/controller/common/BaseController",
  "readians/controller/utils/formatter",
  "readians/controller/utils/types",
  "readians/controller/utils/grouper",
  "readians/controller/utils/dateTime",
  "readians/model/MainData",
  "readians/model/MainView",
  "sap/ui/model/Filter"
], function (BaseController, formatter, types, grouper, dateTime, MainData, MainView, Filter) {
  "use strict";

  return BaseController.extend("readians.controller.Main", {

    types: types,
    formatter: formatter,
    grouper: grouper,
    dateTime: dateTime,

    /* =========================================================== */
    /* 라이프사이클 메서드                                           */
    /* =========================================================== */
    onInit: function () {

      // 전역변수
      this.dataHub = this.getDataHub();
      this.oReviewPage = sap.ui.xmlfragment("readians.view.fragments.Wizard01_Review", this);
      this.oNavContainer = this.getView().byId("nav01");
      this.oNavContainer.addPage(this.oReviewPage);
      this.oWizard = this.getView().byId("wizard01");
      this.oWizardContentPage = this.getView().byId('mainContent');

      // 뷰의 모델초기화
      this.dataHub.mainData = new MainData(this, this.dataHub);
      this.dataHub.mainView = new MainView(this, this.dataHub);

      // 이벤트등록
      this.getRouter().getRoute('main').attachPatternMatched(this.onPatternMatched, this);

      // 화면설정
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

    },

    /**
     * 리소스를 삭제한다
     */
    onExit: function () {

    },

    /* ========================================================== */
    /* 이벤트핸들러
    /* =========================================================== */
    onPatternMatched: function (oEvent) {

      var oNewMainHeader = this.dataHub.mainData.getNewItem(this.dataHub.mainData.PATH.MAIN_HEADER);
      oNewMainHeader.Field01 = '테스트1';
      oNewMainHeader.Field02 = '테스트2';
      oNewMainHeader.Field03 = '테스트3';
      oNewMainHeader.Field04 = '4';
      this.dataHub.mainData.set(this.dataHub.mainData.PATH.MAIN_HEADER, oNewMainHeader);

    },

    onF4: function (oEvent) {
      this.dataHub.help.onF4(oEvent, this);
    },

    onF4Odata: function (oEvent) {
      this.dataHub.help.onF4Odata(oEvent, this);
    },

    /**
     * 이벤트처리 함수. 모든 이벤트는 여기를 통해서 처리가 된다
     * @param oEvent
     */
    onPAI: function (oEvent) {

      var sCode = this.getFcCode(oEvent);

      switch (sCode) {
        case 'fcTable':
          this._fcTable(oEvent);
          break;
        case 'fcMainOk':
          this._fcMainOk(oEvent);
          break;
        case 'fcMainPopup':
          this._fcMainPopup(oEvent);
          break;
        case 'fcPopupDialogOk':
          this._fcPopupDialogOk(oEvent);
          break;
        case 'fcMainNav':
          this._fcMainNav(oEvent);
          break;

        /**
         * Wizard
         */
        case 'fcCompleteStep':
          this._fcCompleteStep();
          break;
        case 'fcComplete':
          this._fcComplete(oEvent);
          break;

        /**
         * Review
         */
        case 'fc_Back_wizard01_Step01':
          this._moveToChangePoint('wizard01_Step01');
          break;
        case 'fc_Back_wizard01_Step02':
          this._moveToChangePoint('wizard01_Step02');
          break;
        case 'fc_Back_wizard01_Step03':
          this._moveToChangePoint('wizard01_Step03');
          break;
        case 'fc_Back_wizard01_Step04':
          this._moveToChangePoint('wizard01_Step04');
          break;
      }
    },

    /* ========================================================== */
    /* PRIVATE 함수 - 이벤트핸들러
    /* =========================================================== */
    _fcTable: function (oEvent) {
      this.showMessageToastWithParams('msgSuss__999', '20rem', [this.getFcCode(oEvent)]);
    },

    _fcMainOk: function (oEvent) {
      this.showMessageToastWithParams('msgSuss__999', '20rem', [this.getFcCode(oEvent)]);
    },

    _fcMainPopup: function (oEvent) {
      this.callPopupFragment(this.dataHub.POPUP.POP_FRAGMENT);
    },

    _fcPopupDialogOk: function (oEvent) {
      this.closePopupFragment(this.dataHub.POPUP.POP_FRAGMENT);
    },

    _fcMainNav: function (oEvent) {

      if (this.dataHub.mainView.get(this.dataHub.mainView.PATH.REVIEW)) {
        this.dataHub.mainView.setReview(false);
        this._navBackToStep(this.getView().byId("wizard01_Step01"));
      }
    },

    _fcCompleteStep: function () {
      if (this._checkData()) {
        this.dataHub.mainView.setValidated(this._getWizardCurrentStep(), true);
      } else {
        this.dataHub.mainView.setValidated(this._getWizardCurrentStep(), false);
      }
    },

    _fcComplete: function (oEvent) {
      this.dataHub.mainView.setReview(true);
      this.oNavContainer.to(this.oReviewPage);
    },

    /* ========================================================== */
    /* PRIVATE 함수
    /* =========================================================== */

    _navBackToStep: function (sStep) {

      var fnAfterNavigate = function () {
        this.oWizard.goToStep(sStep);
        this.oNavContainer.detachAfterNavigate(fnAfterNavigate);
      }.bind(this);

      this.oNavContainer.attachAfterNavigate(fnAfterNavigate);
      this.oNavContainer.to(this.oWizardContentPage);
    },

    _checkData: function () {

      var bStep01 = true;
      var bStep02 = true;
      var bStep03 = true;
      var bStep04 = true;

      var sCurrentStep = this._getCurrentStep();

      switch (sCurrentStep) {
        case 'wizard01_Step01':
          bStep01 =
            this._checkData_wizard01_Step01();
          break;
        case 'wizard01_Step02':
          bStep02 =
            this._checkData_wizard01_Step01() &&
            this._checkData_wizard01_Step02();
          break;
        case 'wizard01_Step03':
          bStep03 =
            this._checkData_wizard01_Step01() &&
            this._checkData_wizard01_Step02() &&
            this._checkData_wizard01_Step03();
          break;
        case 'wizard01_Step04':
          bStep04 =
            this._checkData_wizard01_Step01() &&
            this._checkData_wizard01_Step02() &&
            this._checkData_wizard01_Step03() &&
            this._checkData_wizard01_Step04();
          break;
      }

      return bStep01 && bStep02 && bStep03 && bStep04;
    },

    _checkData_wizard01_Step01 : function() {
      // 단계별 데이터 정합성 체크 로직 작성 필요
      var bResult = this.dataHub.mainData.get(this.dataHub.mainData.PATH.MAIN_CONTENT).Step01;

      return bResult;
    },

    _checkData_wizard01_Step02 : function() {
      // 단계별 데이터 정합성 체크 로직 작성 필요
      var bResult = this.dataHub.mainData.get(this.dataHub.mainData.PATH.MAIN_CONTENT).Step02;

      return bResult;
    },

    _checkData_wizard01_Step03 : function() {
      // 단계별 데이터 정합성 체크 로직 작성 필요
      var bResult = this.dataHub.mainData.get(this.dataHub.mainData.PATH.MAIN_CONTENT).Step03;

      return bResult;
    },

    _checkData_wizard01_Step04 : function() {
      // 단계별 데이터 정합성 체크 로직 작성 필요
      var bResult = this.dataHub.mainData.get(this.dataHub.mainData.PATH.MAIN_CONTENT).Step04;

      return bResult;
    },

    _getWizardCurrentStep: function () {

      if (!this.oWizard) {
        return '';
      }

      return this._getCurrentStep();
    },

    _getCurrentStep: function () {

      var sStep = '';
      var iStep = this.oWizard.getProgress();

      if (this.oWizard.getProgressStep()) {
        iStep = this.oWizard.indexOfStep(this.oWizard.getProgressStep()) + 1;
      }

      switch (iStep) {
        case 1:
          sStep = 'wizard01_Step01';
          break;
        case 2:
          sStep = 'wizard01_Step02';
          break;
        case 3:
          sStep = 'wizard01_Step03';
          break;
        case 4:
          sStep = 'wizard01_Step04';
          break;
      }

      return sStep;
    },

    _moveToChangePoint: function (sId) {
      this._navBackToStep(this.getView().byId(sId));
    }

  });
});