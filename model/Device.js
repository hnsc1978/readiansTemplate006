sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device",
  "readians/model/common/BaseModel"
], function (JSONModel, Device, BaseModel) {
  "use strict";

  return BaseModel.extend("readians.model.Device", {

    constructor : function (oDataHub) {
      this.model = new JSONModel(Device);
      this.model.setDefaultBindingMode("OneWay");
      this.setName('device');
      this.setDataHub(oDataHub);
    }
  });
});