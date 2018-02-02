sap.ui.define([
  'sap/ui/core/UIComponent',
  'readians/model/Device',
  'readians/model/Odata',
  'readians/model/common/DataHub',
  "readians/ddic/DDIC",
  'readians/model/Help'
], function (UIComponent, Device, Odata, DataHub, DDIC, Help) {
  "use strict";

  var Component = UIComponent.extend("readians.Component", {

    metadata: {
      manifest: "json"
    },

    init: function () {

      // 데이터허브생성
      // 프로그램 전역으로 쓰이는 모델 선언 및 초기화
      this.dataHub = new DataHub();
      this.dataHub.ddic = _.assignIn({}, new DDIC());
      this.dataHub.manifest = this.getManifest();
      this.dataHub.device = new Device(this.dataHub);
      this.dataHub.i18n = this.getModel('i18n');
      this.dataHub.odataModel = new Odata(this.getModel('odataModel'), 'odataModel', this.dataHub);
      this.dataHub.help = new Help(this.dataHub);

      // 컴포넌트초기화
      UIComponent.prototype.init.apply(this, arguments);

      // 컴포넌트모델 설정
      this.setModel(this.dataHub.device.getModel(), this.dataHub.device.getName());
      this.setModel(this.dataHub.help.getModel(), this.dataHub.help.getName());

      // 라우터초기화
      this.getRouter().getTargetHandler().setCloseDialogs(false);
      this.getRouter().initialize();
    },

    destroy: function () {
      UIComponent.prototype.destroy.apply(this, arguments);
    },

    getContentDensityClass: function () {
      if (this._sContentDensityClass === undefined) {
        if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
          this._sContentDensityClass = "";
        } else if (!this.dataHub.device.get('/').support.touch) {
          this._sContentDensityClass = "sapUiSizeCompact";
        } else {
          this._sContentDensityClass = "sapUiSizeCozy";
        }
      }
      return this._sContentDensityClass;
    }
  });

  return Component;
});