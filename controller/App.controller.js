sap.ui.define([
  "readians/controller/common/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("readians.controller.App", {

    onInit: function () {
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    },

    onNavBack: function () {
      var oHistory = sap.ui.core.routing.History.getInstance(),
        sPreviousHash = oHistory.getPreviousHash(),
        oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

      if (sPreviousHash !== undefined || !oCrossAppNavigator) {
        window.history.go(-1);
      } else if (oCrossAppNavigator) {
        oCrossAppNavigator.toExternal({
          target: {shellHash: "#"}
        });
      }
    }
  });

});