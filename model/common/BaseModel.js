sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
  "use strict";

  return Object.extend('readians.model.common.BaseModel',{

    dataHub: null,
    name: '',
    model: {},
    template: {},

    setDataHub : function (oDataHub) {
      this.dataHub = oDataHub;
    },

    /**
     * 모델 리턴
     * @returns {object}  모델객체
     */
    getModel: function() {
      return this.model;
    },

    /**
     * 모델명리턴 - 하위클래스 구현필요
     * @returns {string} : 모델명
     */
    getName: function () {
      return this.name;
    },

    setName: function(sName) {
      if (_.isString(sName)) {
        this.name = sName;
      }
    },

    /**
     * 경로를 이용하여 속성값을 가져온다. 단, 값자체를 가져오기 위해서 값을 복사하여 리턴한다
     * @param sPath : 속성 경로
     * @returns {*} : 속성값
     */
    get: function (sPath) {
      return _.cloneDeep(this.model.getProperty(sPath));
    },

    /**
     * 경로에 대한 속성값에 값을 설정한다.
     * @param sPath : 속성 경로
     * @param value : 설정 값
     */
    set: function (sPath, value) {
      this.model.setProperty(sPath, value);
    },

    /**
     *
     * @param sPath 속성경로
     * @returns {*} 속성경로에 대한 템플릿의 복사본
     */
    getNewItem: function (sPath) {
      return _.cloneDeep(this.template[sPath]);
    },

    /**
     * 경로에 아이템을 하나 추가한다
     * @param sPath 속성 경로
     * @param oItem 추가 아이템. 없는 경우에는 경로의 템플릿으로 추가
     */
    append: function (sPath, oItem) {

      if (!oItem) {
        var oNewItem = _.cloneDeep(this.oTemplate[sPath]);
      } else {
        oNewItem = oItem;
      }

      var oItems = this.get(sPath);
      oItems.push(oNewItem);
      this.set(sPath, oItems);
    },

    /**
     * 배열속성에 대해서 인덱스에 해당하는 라인을 삭제한다
     * @param sPath : 배열 속성 경로
     * @param iIndex : 삭제하는 라인 인덱스
     */
    delete: function (sPath, iIndex) {

      if (!sPath) {
        return;
      }

      var oItems = this.get(sPath);

      if (!_.isArray(oItems)) {
        return;
      }

      _.pullAt(oItems, iIndex);

      this.set(sPath, oItems);
    },

    /**
     * 테스트시에 실 데이터 대신에 로컬의 파일을 사용하고자 하는 경우 사용
     * @param sFilePath 업로드 파일 경로
     */
    makeTestData: function (sFilePath) {

      if (sFilePath) {
        this.model.loadData(sFilePath);
      }
    },

    /**
     * 모델의 템플릿을 정의하는 메서드로 하위 클래스는 해당 메서드를 구현해야 한다
     */
    setTemplate: function() {

    },

    /**
     * 모델의 최초 초기 정보를 설정하는 함수로 하위 클래스에서 해당 메서드를 구현해야 한다
     */
    initModel : function () {

    }
  });
});