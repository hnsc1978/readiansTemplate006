sap.ui.define([
	"readians/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("readians.NotFound", {
		onLinkPressed: function() {
			this.getRouter().navTo("");
		}
	});
});