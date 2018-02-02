sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "readians/model/common/BaseModel"
], function (JSONModel, BaseModel) {
  "use strict";

  return BaseModel.extend("readians.model.common.BaseOdata", {

    read: function (sUrl, aFilters, oParams) {

      var deferred = Q.defer();

      if (!aFilters) {
        aFilters = [];
      }

      if (!oParams) {
        oParams = {};
      }

      this.model.read(
        sUrl,
        {
          success: function (oData, oResponse) {
            oData.sUrl = sUrl;
            deferred.resolve(oData);
          },
          error: function (oError) {
            oError.sUrl = sUrl;
            deferred.reject(oError);
          },
          filters: aFilters,
          urlParameters : oParams
        }
      );

      return deferred.promise;
    },

    callFunction: function (sUrl, oParams) {

      var deferred = Q.defer();

      if (!oParams) {
        oParams = {};
      }

      this.model.callFunction(
        sUrl,
        {
          method: 'GET',
          success: function (oData, oResponse) {
            oData.sUrl = sUrl;
            oData.oResponse = oResponse;
            deferred.resolve(oData);
          },
          error: function (oError) {
            oError.sUrl = sUrl;
            deferred.reject(oError);
          },
          urlParameters: oParams
        }
      );

      return deferred.promise;
    },

    create: function (sUrl, oData) {

      var deferred = Q.defer();

      this.model.create(
        sUrl,
        oData,
        {
          success: function (oData, oResponse) {
            oData.sUrl = sUrl;
            oData.oResponse = oResponse;
            deferred.resolve(oData);
          },
          error: function (oError) {
            oData.sUrl = sUrl;
            deferred.reject(oError);
          }
        }
      );

      return deferred.promise;
    },

    delete: function (sUrl) {

      var deferred = Q.defer();

      this.model.remove(sUrl,
        {
          success: function (oData, oResponse) {
            oData.sUrl = sUrl;
            oData.oResponse = oResponse;
            deferred.resolve(oData);
          },
          error: function (oError) {
            oData.sUrl = sUrl;
            deferred.reject(oError);
          }
        });

      return deferred.promise;
    }

  });
});