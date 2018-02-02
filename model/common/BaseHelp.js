sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "readians/model/common/BaseModel",
  "sap/ui/model/Filter"
], function (JSONModel, BaseModel, Filter) {
  "use strict";

  return BaseModel.extend("readians.model.BaseHelp", {

    clickedContext : [],
    helpFragments : [],

    /**
     * 입력도움말을 호출한다.
     * @param sId Fragment의 id값
     * @param sName f4이름
     * @param oController 입력도움말의 이벤트를 처리할 컨트롤러
     * @param sValue 초기검색값
     * @param sField 초기검색필드
     */
    callF4: function (sId, sName, oController, sValue, sField) {

      this._sId = sId;

      if (!_.isString(sName) || sName.length === 0) {
        if (oController) {
          oController.showMessageToast(oController.getResourceBundle().getText('notExistPath'));
        } else {
          oController.showMessageToast(oController.getResourceBundle().getText('notExistPath'));
        }
        return;
      }

      if (!this.helpFragments[sName]) {
        this.helpFragments[sName] = sap.ui.xmlfragment(
          this.dataHub.manifest['sap.app']['id'] + ".view.f4." + sName,
          oController
        );
        oController.getView().addDependent(this.helpFragments[sName]);
      }

      if (sField && sField.length) {
        this.helpFragments[sName].getBinding("items").filter(
          [
            new Filter(sField, sap.ui.model.FilterOperator.Contains, sValue)
          ]);
      }
      this.helpFragments[sName].open();
    },

    /**
     * 입력도움말을 호출한다. 초기 검색 필드가 여러개이다
     * @param sId Fragment의 id값
     * @param sName f4이름
     * @param oController 입력도움말의 이벤트를 처리할 컨트롤러
     * @param sValue 초기검색값
     * @param aFields 초기검색필드
     */
    callF4Multi: function (sId, sName, oController, sValue, aFields) {

      this._sId = sId;

      if (!sName || sName.length === 0) {
        if (oController) {
          oController.showMessageToast(oController.getResourceBundle().getText('notExistPath'));
        } else {
          oController.showMessageToast(oController.getResourceBundle().getText('notExistPath'));
        }
        return;
      }

      if (!this.helpFragments[sName]) {
        this.helpFragments[sName] = sap.ui.xmlfragment(
          this.dataHub.manifest['sap.app'][id] + ".view.f4." + sName,
          oController
        );
        oController.getView().addDependent(this.helpFragments[sName]);
      }

      var aFilters = [];
      if (_.isArray(aFields) && aFields.length !== 0) {
        _.forEach(aFields, function(sField) {
          aFilters.push(new Filter(sField, sap.ui.model.FilterOperator.Contains, sValue));
        });
        this.helpFragments[sName].getBinding("items").filter(aFilters);
      }
      this.helpFragments[sName].open();
    },

    /**
     * 검색필드에 대한 검색 수행
     * @param oEvent  이벤트 객체
     * @param aFields 검색할 필드
     */
    callF4Search: function (oEvent, aFields) {

      var sValue = oEvent.getParameter("value");

      if (!aFields && aFields.length === 0) {
        return;
      }

      var aFilters = [];
      _.forEach(aFields, function (field) {
        aFilters.push(new Filter(field, sap.ui.model.FilterOperator.Contains, sValue));
      }.bind(this));

      var oFilters = new Filter({
        filters: aFilters,
        and: false
      });

      oEvent.getSource().getBinding("items").filter(oFilters);
    },

    /**
     * F4리스트에서 항목을 선택한 경우
     * @param oEvent  이벤트 객체
     * @param sModelName  모델명
     * @returns {객체}  바인딩된 데이터
     */
    callF4Select: function (oEvent, sModelName) {

      if (!_.isString(sModelName) || sModelName.length === 0) {
        return;
      }

      var oSelectedItem = oEvent.getParameter("selectedItem");

      if (oSelectedItem) {
        var sTitle = oSelectedItem.getProperty('title');
        var sInfo = oSelectedItem.getProperty('info');
      }

      oEvent.getSource().getBinding("items").filter([]);

      return {
        id: oEvent.getSource().getId(),
        title: sTitle,
        info: sInfo,
        oData: oSelectedItem.getBindingContext(sModelName).getObject()
      }
    },

    /**
     * 테이블형태의 선택화면인 경우에 아이템 항목을 클릭한 경우 클릭한 항목의 정보를 리턴
     * @param oEvent  이벤트 객체
     * @param sModelName  모델명
     * @returns {*} 선택된 아이템 정보
     */
    callF4SelectTable: function (oEvent, sModelName) {
      var oSelectedItem = oEvent.getParameter("selectedItem");

      oEvent.getSource().getBinding('items').filter([]);

      if (_.isString(sModelName) && sModelName.length > 0) {
        var oData = oSelectedItem.getBindingContext(sModelName).getObject();
        oData.id = oEvent.getSource().getId();
        return oData;
      }
    },

    /**
     * 선택화면에서 여러개를 선택한 경우 해당 정보를 배열로 리턴한다
     * @param oEvent  이벤트 객체
     * @param sModelName  모델명
     * @returns {Array} 선택된 아이템 리스트
     */
    callF4SelectTableMulti: function (oEvent, sModelName) {

      var self = this;
      var aSelectedItems = [];

      _.forEach(oEvent.getSource().getItems(), function (oItem) {
        if (oItem.isSelected()) {
          aSelectedItems.push(oItem);
        }
      });

      var aSelectedData = [];
      _.forEach(aSelectedItems, function (oSelectedItem) {
        var oData = oSelectedItem.getBindingContext(sModelName).getObject();
        aSelectedData.push(oData);
      });

      return aSelectedData;
    },

    showPromiseError: function (oError) {
      this.showMessage('error', 'errorClient');
    },

    saveContext : function(sId, oContext) {
      this.clickedContext[sId] = oContext;
    },

    /**
     * 커스텀데이터에서 키값을 가져온다
     * @param oEvent
     * @returns {*}
     */
    getKey: function (oEvent) {
      return oEvent.getSource().getAggregation('customData')[0].mProperties['key'];
    },

    /**
     * 하위클래스에서 구현 필요
     * @param oEvent
     */
    onF4 : function (oEvent) {

    }

  });
});