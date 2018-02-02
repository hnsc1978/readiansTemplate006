sap.ui.define([
  "sap/ui/core/util/MockServer",
  'sap/ui/model/json/JSONModel'
], function (MockServer, JSONModel) {
  "use strict";

  return {

    init: function () {

      // create
      var oMockServer = new MockServer({
        rootUri: "/sap/opu/odata/sap/ZVWGW_FI006_SRV/"
      });

      var oUriParameters = jQuery.sap.getUriParameters();

      // configure mock server with a delay
      MockServer.config({
        autoRespond: true,
        autoRespondAfter: oUriParameters.get("serverDelay") || 1000
      });

      // simulate
      var sPath = jQuery.sap.getModulePath("readians.localService");
      oMockServer.simulate(sPath + "/metadata.xml", {
        sMockdataBaseUrl : sPath + "/mockdata",
        bGenerateMissingMockData : true
      });

      var aRequests = oMockServer.getRequests();

      var oHeadInfo = new JSONModel();
      oHeadInfo.loadData('../localService/mockdata/GET_HEAD_INFO.json');
      aRequests.push({
        method: "GET",
        path: new RegExp("GET_HEAD_INFO(.*)"),
        response: function(oXhr, sUrlParams) {
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oHeadInfo.getJSON());
          return true;
        }
      });

      var oBtaList = new JSONModel();
      oBtaList.loadData('../localService/mockdata/GET_BTA_LIST.json');
      aRequests.push({
        method: "GET",
        path: new RegExp("GET_BTA_LIST?(.*)"),
        response: function(oXhr, sUrlParams) {
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oBtaList.getJSON());
          return true;
        }
      });

      var oCardList = new JSONModel();
      oCardList.loadData('../localService/mockdata/GET_CARD_LIST.json');
      aRequests.push({
        method: 'GET',
        path: new RegExp('GET_CARD_LIST(.*)'),
        response: function(oXhr, sUrlParams) {
          setTimeout(function () {}, 3000);
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oCardList.getJSON());
          return true;
        }
      });

      var oExchangeRateInfo = new JSONModel();
      oExchangeRateInfo.loadData('../localService/mockdata/GET_EXCHANGE_RATE_INFO.json');
      aRequests.push({
        method: 'GET',
        path: new RegExp('GET_EXCHANGE_RATE_INFO(.*)'),
        response: function(oXhr, sUrlParams) {
          setTimeout(function () {}, 3000);
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oExchangeRateInfo.getJSON());
          return true;
        }
      });

      var oMwskz = new JSONModel();
      oMwskz.loadData('../localService/mockdata/GET_MWSKZ.json');
      aRequests.push({
        method: 'GET',
        path: new RegExp('GET_MWSKZ(.*)'),
        response: function(oXhr, sUrlParams) {
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oMwskz.getJSON());
          return true;
        }
      });

      var oZtermDate = new JSONModel();
      oZtermDate.loadData('../localService/mockdata/GET_ZTERM_DATE.json');
      aRequests.push({
        method: 'GET',
        path: new RegExp('GET_ZTERM_DATE(.*)'),
        response: function(oXhr, sUrlParams) {
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oZtermDate.getJSON());
          return true;
        }
      });

      var oAccountInfo = new JSONModel();
      oAccountInfo.loadData('../localService/mockdata/GET_ACCOUNT_INFO.json');
      aRequests.push({
        method: 'GET',
        path: new RegExp('GET_ACCOUNT_INFO(.*)'),
        response: function(oXhr, sUrlParams) {
          var oResponse = jQuery.sap.sjax();
          oXhr.respondJSON(200, {}, oAccountInfo.getJSON());
          return true;
        }
      });

      oMockServer.setRequests(aRequests);

      // start
      oMockServer.start();
    }
  };

});
