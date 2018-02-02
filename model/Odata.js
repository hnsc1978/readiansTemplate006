sap.ui.define([
  "readians/model/common/BaseOdata"
], function (BaseOdata) {
  "use strict";

  return BaseOdata.extend("readians.model.Odata", {

    PATH: {
      ROOT: '/'
    },

    constructor: function (oModel, sModelName, oDataHub) {
      this.model = oModel;
      this.setDataHub(oDataHub);
      this.setName(sModelName);
      this.setTemplate();
    },

    initModel: function () {

    },

    getHelp: function () {

      var aPromises = [];

      return aPromises;
    },

    setTemplate: function () {
      this.template['/'] = [];
    }

  });
});