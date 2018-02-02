sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "readians/model/common/BaseHelp"
], function (JSONModel, BaseHelp) {
  "use strict";

  return BaseHelp.extend("readians.model.Help", {

    PATH: {
      ROOT: '/',
      HELP: '/HelpSample'
    },

    constructor: function (oDataHub) {

      // 입력데이터 설정
      this.setDataHub(oDataHub);

      // 모델 생성
      this.model = new JSONModel();
      this.setName('help');
      this.setTemplate();

      // 모델 초기화
      this.initModel();
    },

    initModel: function () {
      this.set('/', _.cloneDeep(this.template[this.PATH.ROOT]));
    },

    setTemplate: function () {
      this.template[this.PATH.HELP] = this.dataHub.ddic.HELP;
      this.template[this.PATH.ROOT] = {
        'HelpSample': []
      }
    },

    /**
     * F4 클릭 이벤트 처리 - 프로그램에 따라서 달리 구현
     * @param oEvent  이벤트
     * @param oController 컨트롤러
     */
    onF4: function (oEvent, oController) {

      var sId = this.getKey(oEvent);
      this.saveContext(sId, oEvent.getSource().getBindingContext(this.dataHub.mainData.getName()));

      var sInitValue = '';
      var aInfo = _.split(oEvent.getSource().getAggregation('customData')[0].mProperties['value'], '-');

      if (aInfo.length === 2) {
        this.callF4(sId, aInfo[0], oController, sInitValue, aInfo[1]);
      } else if (aInfo.length > 2) {
        this.callF4Multi(sId, aInfo[0], oController, sInitValue, _.pullAt(aInfo, [0]));
      }
    },

    /**
     * F4 클릭 이벤트 처리 (Odata) - 프로그램에 따라서 달리 처리
     * @param oEvent  이벤트
     * @param oController 컨트롤러
     */
    onF4Odata: function (oEvent, oController) {
      var self = this;
      var sId = this.getKey(oEvent);
      this.saveContext(sId, oEvent.getSource().getBindingContext(this.dataHub.mainData.getName()));

      var sInitValue = '';
      var aInfo = _.split(oEvent.getSource().getAggregation('customData')[0].mProperties['value'], '-');

      var aPromises = [];
      aPromises = this.dataHub.oData.getHelp(sId);

      if (_.isArray(aPromises) && aPromises.length !== 0) {
        oController.setBusy(true);
        Q.allSettled(aPromises).then(function (aResults) {
          _.forEach(aResults, function (oResult) {
            switch (oResult.value.sUrl) {
              case 'F4Name':
                self.set('/F4Name', oResult.value.results);
                break;
            }
          });

          if (aInfo.length === 2) {
            self.callF4(sId, aInfo[0], oController, sInitValue, aInfo[1]);
          } else if (aInfo.length > 2) {
            self.callF4Multi(sId, aInfo[0], oController, sInitValue, _.pullAt(aInfo, [0]));
          }

        }).catch(function (oError) {
          oController.showPromiseError(oError);
        }).done(function () {
          oController.setBusy(false);
        });
      } else {
        if (aInfo.length === 2) {
          this.callF4(sId, aInfo[0], self, sInitValue, aInfo[1]);
        } else if (aInfo.length > 2) {
          this.callF4Multi(sId, aInfo[0], self, sInitValue, _.pullAt(aInfo, [0]));
        }
      }
    }

  });
});