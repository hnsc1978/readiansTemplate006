sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/m/MessageToast",
  'sap/m/MessageBox',
  'sap/ui/model/Filter'
], function (Controller, History, MessageToast, MessageBox, Filter) {
  "use strict";

  return Controller.extend("readians.common.BaseController", {

    // 필터 Operator
    OP: {
      ALL: sap.ui.model.FilterOperator.All,
      ANY: sap.ui.model.FilterOperator.Any,
      BT: sap.ui.model.FilterOperator.BT,
      CONTAINS: sap.ui.model.FilterOperator.Contains,
      ENDSWITH: sap.ui.model.FilterOperator.EndsWith,
      EQ: sap.ui.model.FilterOperator.EQ,
      GE: sap.ui.model.FilterOperator.GE,
      GT: sap.ui.model.FilterOperator.GT,
      LE: sap.ui.model.FilterOperator.LE,
      LT: sap.ui.model.FilterOperator.LT,
      NE: sap.ui.model.FilterOperator.NE,
      STARTSWITH: sap.ui.model.FilterOperator.StartsWith
    },

    // MessageBox Action
    MSGBOXACTION: {
      ABORT: sap.m.MessageBox.Action.ABORT,
      CANCEL: sap.m.MessageBox.Action.CANCEL,
      CLOSE: sap.m.MessageBox.Action.CLOSE,
      DELETE: sap.m.MessageBox.Action.DELETE,
      IGNORE: sap.m.MessageBox.Action.IGNORE,
      NO: sap.m.MessageBox.Action.NO,
      OK: sap.m.MessageBox.Action.OK,
      RETRY: sap.m.MessageBox.Action.RETRY,
      YES: sap.m.MessageBox.Action.YES
    },

    // MessageBox Icon
    MSGBOXICON: {
      ERROR: sap.m.MessageBox.Icon.ERROR,
      INFORMATION: sap.m.MessageBox.Icon.INFORMATION,
      NONE: sap.m.MessageBox.Icon.NONE,
      QUESTION: sap.m.MessageBox.Icon.QUESTION,
      SUCCESS: sap.m.MessageBox.Icon.SUCCESS,
      WARNING: sap.m.MessageBox.Icon.WARNING
    },

    // Fragment 관리
    fragments: [],

    /**
     * 라우터객체 리턴
     * @returns {*}
     */
    getRouter: function () {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },

    /**
     * 뷰의 모델객체 리턴
     * @param sName 모델명
     * @returns {*|Object} 모델객체
     */
    getModel: function (sName) {
      return this.getView().getModel(sName);
    },

    /**
     * 뷰에 모델객체 바인딩
     * @param oModel  모델객체
     * @param sName 모델객체명
     */
    setModel: function (oModel, sName) {
      this.getView().setModel(oModel, sName);
    },

    /**
     * 리소스번들객체 반환
     * @returns {*} 리소스객체 (i18n)
     */
    getResourceBundle: function () {
      return this.getOwnerComponent().getModel('i18n').getResourceBundle();
    },

    /**
     * i18n의 텍스트 검색
     * @param sKey  i18n 키
     * @returns {*} i18n 텍스트
     */
    getI18nText: function (sKey) {
      return this.getResourceBundle().getText(sKey);
    },

    /**
     * 네비게이션 Back. 이력이 있는 경우와 없는 경우에 처리가 달라진다
     * @param sRoute  이력이 없는 경우 돌아갈 라우트명
     * @param mData 이력이 없는 경우 돌아갈 라우트에 넘겨줄 값
     */
    myNavBack: function (sRoute, mData) {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var bReplace = true;
        this.getRouter().navTo(sRoute, mData, bReplace);
      }
    },

    /**
     * 데이터허브를 반환한다
     * @returns {*} 데이터허브객체
     */
    getDataHub: function () {
      return this.getOwnerComponent().dataHub;
    },

    /**
     * 어플리케이션의 네임스페이스를 반환한다
     * @returns {*} 네임스페이스
     */
    getNamespace: function () {
      return this.getDataHub().manifest['sap.app']['id'];
    },

    /**
     * 도움말객체를 리턴한다
     * @returns {*}
     */
    getF4Model: function () {
      return this.getDataHub().help.getModel();
    },

    /**
     * Manifest에서 customizing 설정값을 읽어온다
     * @param sPath 경로
     * @returns {*} 속성값
     */
    getConfigCustomizing: function (sPath) {
      if (sPath && sPath.length !== 0) {
        return _.get(this.getDataHub().manifest, 'customizing.' + sPath);
      } else {
        return _.get(this.getDataHub().manifest, 'customizing');
      }
    },

    /**
     * 이벤트의 customData의 이벤트코드를 읽어서 리턴한다
     * @param oEvent  이벤트 객체
     * @returns {string}  이벤트 코드
     */
    getFcCode: function (oEvent) {
      var sFcCode = '';
      var aAggregation = oEvent.getSource().getAggregation('customData');

      _.forEach(aAggregation, function (oAggregation) {
        if (oAggregation.mProperties['key'] === 'fcCode') {
          sFcCode = oAggregation.mProperties['value'];
          return;
        }
      });
      return sFcCode;
    },

    /**
     * sam.m.DateRangeSelection 컨트롤의 from날짜와 to날짜를 읽어서 객체로 리턴한다
     * @param sId 컨트롤 id
     * @returns {*} from날짜와 to날짜를 가지는 객체
     */
    getDateRange: function (sId) {
      var oDateRange = this.getView().byId(sId);

      if (oDateRange.getDateValue()) {
        var fdate = moment(oDateRange.getDateValue()).format('YYYYMMDD');
      }

      if (oDateRange.getSecondDateValue()) {
        var tdate = moment(oDateRange.getSecondDateValue()).format('YYYYMMDD');
      }

      if (!fdate || !tdate) {
        return null;
      }

      return {
        FDATE: fdate,
        TDATE: tdate
      };
    },

    /**
     * sap.m.DateRangeSelection의 날짜 범위의 값을 지우는데 사용
     * @param sId 컨트롤 id
     */
    clearDateRange: function (sId) {

      var oDateRange = this.getView().byId(sId);

      if (oDateRange) {
        oDateRange.setValue('');
      }
    },

    /**
     * 메세지를 화면에 출력
     * @param sStatus 상태값
     * @param si18n i18n 키
     */
    showMessage: function (sStatus, si18n) {

      var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
      var sMessage = this.getResourceBundle().getText(this.getResourceBundle().getText(si18n));

      switch (sStatus) {
        case 'confirm':
        case 'alert':
        case 'error':
        case 'information':
        case 'warning':
        case 'success':
          MessageBox[sStatus](
            sMessage,
            {
              styleClass: bCompact ? "sapUiSizeCompact" : ""
            }
          );
          break;
        default:
          MessageBox.information(
            sMessage,
            {
              styleClass: bCompact ? "sapUiSizeCompact" : ""
            }
          );
      }
    },

    /**
     * 메세지 Toast로 출력
     * @param si18n i18n 키값
     * @param sWidth  메세지 Toast의 너비
     */
    showMessageToast: function (si18n, sWidth) {

      if (!sWidth) {
        sWidth = '15em';
      }

      if (si18n) {
        MessageToast.show(this.getResourceBundle().getText(si18n), {
          width: sWidth
        });
      } else {
        this.showMessage('error', 'errorNoi18n');
      }
    },

    /**
     * 메세지 Toast에 i18n에 파라미터를 사용하여 출력하는데 사용
     * @param si18n i18n 키값
     * @param sWidth  출력 너비
     * @param aParams i18n에 필요한 파라미터
     */
    showMessageToastWithParams: function (si18n, sWidth, aParams) {

      if (!sWidth) {
        sWidth = '15em';
      }

      if (!aParams) {
        aParams = [];
      }

      if (si18n) {
        MessageToast.show(this.getResourceBundle().getText(si18n, aParams), {
          width: sWidth
        });
      } else {
        this.showMessage('error', 'errorNoi18n');
      }
    },

    /**
     * 문자열이고 값이 있는지 체크
     * @param sValue  문자열
     * @returns {boolean} 값의 유무
     */
    hasStringValue: function (sValue) {

      if (!_.isString(sValue) || sValue.length === 0) {
        return false;
      } else {
        return true;
      }

    },

    /**
     * 숫자값이 있는지 체크
     * @param value 숫자값
     * @returns {boolean} 숫자인지 여부
     */
    hasNumberValue: function (value) {

      if (!_.isNumber(parseFloat(value)) || _.isNaN(parseFloat(value)) || parseFloat(value) === 0) {
        return false;
      } else {
        return true;
      }
    },

    /**
     * Q Promise의 에러를 출력
     * @param oError
     */
    showPromiseError: function (oError) {
      this.showMessage('error', 'errorClient');
    },

    /**
     * 컨트롤의 aggregation에 필터를 거는데 사용
     * @param oControl  컨트롤
     * @param sValue  필터를 걸 값
     * @param aFields 필터를 걸 필드
     * @param sAggregationName  컨트롤의 aggregation 명
     */
    setSearchFilter: function (oControl, sValue, aFields, sAggregationName) {

      if (!_.isArray(aFields)) {
        aFields = [];
      }

      if (!_.isString(sAggregationName) || sAggregationName.length === 0) {
        sAggregationName = 'items';
      }

      var aFilters = [];
      _.forEach(aFields, function (field) {
        aFilters.push(new Filter(field, sap.ui.model.FilterOperator.Contains, sValue));
      }.bind(this));

      var oFilters = new Filter({
        filters: aFilters,
        and: false
      });

      oControl.getBinding("items").filter(oFilters);
    },

    /**
     * sap.m.Table 인경우 모델의 패스에 해당하는 값을 모델에서 삭제하는 경우 사용
     * @param oEvent  이벤트 객체
     * @param sModelName  컨트롤에 할당된 모델명
     * @param sModelPath  삭제할 속성의 경로
     */
    deleteTableItem: function (oEvent, sModelName, sModelPath) {
      var sPath = oEvent.getSource().getBindingContext(sModelName).getPath();
      var iIndex = parseInt(_.replace(sPath, sModelPath + '/', ''));
      var oItems = this.getModel(sModelName).getProperty(sModelPath);
      _.pullAt(oItems, iIndex);
      this.getModel(sModelName).setProperty(sModelPath, oItems);
    },

    /**
     * sap.m.Table인 경우 이벤트가 일어난 아이템의 컨텍스트 정보를 객체로 반환
     * @param oEvent  이벤트 객체
     * @param sModelName  모델 명
     * @returns {{oContext: *, sPath: *, oData: *}} 컨텍스트 상세 정보
     */
    getCurrentTableContextInfo: function (oEvent, sModelName) {
      return {
        oContext: oEvent.getSource().getBindingContext(sModelName),
        sPath: oEvent.getSource().getBindingContext(sModelName).getPath(),
        oData: oEvent.getSource().getBindingContext(sModelName).getObject()
      }
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
     * DateRange 컨트롤에
     * @param sId
     * @param oData
     * @returns {*}
     */
    setDateRange: function (sId, oData) {

      var oDateRange = this.getView().byId(sId);

      if (!oDateRange) {
        return null;
      }

      var oFdate = moment(oData.FDATE);
      var oTdate = moment(oData.TDATE);

      if (!oFdate.isValid() || !oTdate.isValid()) {
        return null;
      }

      oDateRange.setDateValue(oFdate.toDate());
      oDateRange.setSecondDateValue(oTdate.toDate());

      return oDateRange;

    },

    /**
     * Q 프라미스 에러를 팝업으로 나타내 준다
     * @param oEvent
     */
    callPromiseErrorPopup: function (oEvent) {

      var sErrorDetail = '';

      if (oEvent.statusCode === 500) {
        sErrorDetail = this.getI18nText('errorServer');
      } else {
        var oError = JSON.parse(oEvent.responseText);
        var oMainError = oError.error.message;
        var aErrorList = oError.error.innererror.errordetails;

        if (aErrorList && aErrorList.length > 0) {
          var sErrorType = _.last(aErrorList).code;
        }
        var sStatusCode = oEvent.statusCode;

        if (sErrorType === '/IWBEP/CX_MGW_BUSI_EXCEPTION') {
          this._sErrorText = this.getI18nText("errorTextBusi");
        } else {
          this._sErrorText = this.getI18nText("errorTextTech");
        }

        var aErrorListCreated = _.dropRight(aErrorList);
        sErrorDetail = this.getI18nText('errorTextHead') + '\n';

        if (_.isArray(aErrorListCreated) && aErrorListCreated.length === 0) {
          sErrorDetail = oMainError.value;
        } else {
          _.forEach(aErrorListCreated, function (oList) {
            sErrorDetail += ('[' + oList.severity + '] ' + oList.message + '\n');
          });
        }
      }

      this.showServiceError(sErrorDetail);
    },

    /**
     * 에러메세지를 화면체 출력
     * @param sDetails 에러메세지
     */
    showServiceError: function (sDetails) {
      if (this._bMessageOpen) {
        return;
      }
      this._bMessageOpen = true;
      MessageBox.error(
        this._sErrorText,
        {
          id: "serviceErrorMessageBox",
          details: sDetails,
          styleClass: this.getComponent().getContentDensityClass(),
          actions: [MessageBox.Action.CLOSE],
          onClose: function () {
            this._bMessageOpen = false;
          }.bind(this)
        }
      );
    },

    /**
     * Table의 아이템선택 이벤트가 발생하면 해당 행을 선택하도록 처리
     * @param oEvent 아이템선택 이벤트
     */
    setTableSelected: function (oEvent) {

      if (oEvent.getParameter('listItems')) {
        return;
      }

      var oItem = oEvent.getParameter('listItem');
      var bSelected = true;

      oEvent.getSource().setSelectedItem(oItem, bSelected);
    },

    /**
     * 테이블의 선택된 아이템을 반환한다 - 하나의 항목
     * @param sId 테이블 ID
     * @param sModelName  모델명
     * @returns {*} 선택행의 데이터
     */
    getTableSelectedItem: function (sId, sModelName) {

      var oTable = this.getControl(sId);

      var aItems = oTable.getSelectedItems();

      if (!_.isArray(aItems) || aItems.length !== 1) {
        return null;
      }

      var oItem = aItems[0];
      return _.cloneDeep(oItem.getBindingContext(sModelName).getObject());
    },

    /**
     * 테이블의 선택된 아이템을 반환한다 - 여러개의 항목
     * @param sId 테이블 ID
     * @param sModelName  모델명
     * @returns {*} 선택행의 데이터 배열
     */
    getTableSelectedItems: function (sId, sModelName) {

      var oTable = this.getControl(sId);

      var aItems = oTable.getSelectedItems();

      if (_.isArray(aItems) || aItems.length !== 1) {
        return null;
      }

      var aData = [];

      _.forEach(aItems, function (oItem) {
        aData.push(_.cloneDeep(oItem.getBindingContext(sModelName).getObject()));
      });

      return aData;
    },

    /**
     * ID에 해당하는 컨트롤을 반환한다
     * @param sId 컨트롤 ID
     * @returns {*} 컨트롤
     */
    getControl: function (sId) {
      return this.getView().byId(sId);
    },

    /**
     * 검색 필드의 QUERY 값을 가져온다
     * @param oEvent  검색 이벤트
     * @returns {any} QUERY 필드의 값
     */
    getSearchValue: function (oEvent) {
      return oEvent.getParameter('query');
    },

    /**
     * 검색필드의 값을 지운다
     * @param sId 검색필드 ID
     */
    clearSearchValue: function (sId) {
      this.getView().byId(sId).setValue('');
    },

    /**
     * 여러 조건에 대한 필터를 생성하여 반환한다
     * @param aSettings 필터 조건
     * @param sValue  검색값
     * @param bAnd  AND 여부
     * @returns {*} 필터 객체
     */
    makeMultiFilter: function (aSettings, sValue, bAnd) {

      var aFilters = [];

      _.forEach(aSettings, function (oSetting) {
        aFilters.push(new Filter(oSetting.field, oSetting.operator, sValue));
      });

      return new Filter({
        filters: aFilters,
        and: bAnd
      });
    },

    /**
     * 키값을 가지는 ODATA URL을 생성한다
     * @param sUrl  URL
     * @param oKeys 키값 리스트
     * @returns {*} 키값을 가지는 URL
     */
    makeUrlWithKey: function (sUrl, oKeys) {

      var sResult = sUrl;
      var iIndex = 0;

      sResult += "(";
      _.forEach(oKeys, function (sValue, sKey) {
        iIndex++;
        sResult = sResult + sKey + "='" + sValue + "',";
      });
      sResult = v.slice(sResult, 0, (v.count(sResult) - 1));
      sResult += ")";

      return sResult;
    },

    /**
     * 객체의 같은 이름의 속성에 대해서 값을 이동한다
     * @param oTo   값 이동 대상 객체
     * @param oFrom 값 이동 소스 객체
     */
    moveCorresponding: function (oTo, oFrom) {
      _.forIn(oTo, function (value, key) {

        if (!_.isUndefined(oFrom[key])) {
          oTo[key] = oFrom[key];
        }
      });
    },

    /**
     * 배열의 객체의 같은 이름의 속성에 대해서 값을 이동한다
     * @param oStructure  이동 대상 배열의 객체
     * @param aSources    이동 소스 배열
     * @returns {Array}   대상 배열
     */
    moveCorrespondingArray: function (oStructure, aSources) {

      var self = this;
      var aResults = [];

      _.forEach(aSources, function (oSource) {
        var oNewItem = _.cloneDeep(oStructure);
        self.moveCorresponding(oNewItem, oSource);
        aResults.push(oNewItem);
      });

      return aResults;
    },

    /**
     * 프레그먼트 팝업을 화면에 표시한다
     * @param sFragmentName 프레그먼트 이름
     */
    callPopupFragment: function (sFragmentName) {

      if (!this.fragments[sFragmentName]) {
        this.fragments[sFragmentName] = sap.ui.xmlfragment(sFragmentName, this);
      }

      this.getView().addDependent(this.fragments[sFragmentName]);
      jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.fragments[sFragmentName]);
      this.fragments[sFragmentName].open();
    },

    /**
     * 프레그먼트 팝업을 닫는다
     * @param sFragmentName 프레그먼트 이름
     */
    closePopupFragment: function (sFragmentName) {
      this.fragments[sFragmentName].close();
    },

    /**
     * 이벤트의 소스에 바인딩된 특정 모델의 데이터를 리턴한다
     * @param oEvent  이벤트
     * @param sModelName  모델명
     * @returns {*}
     */
    getContextObject: function (oEvent, sModelName) {
      return oEvent.getSource().getBindingContext(sModelName).getObject();
    },

    getBindingPath: function (oEvent, sModelName) {
      return oEvent.getSource().getBindingContext(sModelName).getPath();
    },

    /**
     * 확인 팝업
     * @param sI18n 화면에 나타낼 메세지의 I18N 키값
     * @param sType 메세지 종료
     * @param sIcon 메세지 아이콘
     * @returns {*|PromiseLike<any>} 선택에 대한 프라미스값
     */
    callPopupConfirm: function (sI18n, sType, sIcon) {

      var deferred = Q.defer();
      var sMessage = this.getI18nText(sI18n);

      if (!this.hasStringValue(sType)) {
        sType = 'success';
      }

      if (!this.hasStringValue(sIcon)) {
        sIcon = this.MSGBOXICON.NONE;
      }

      MessageBox[sType](
        sMessage,
        {
          icon: sIcon,
          actions: [this.MSGBOXACTION.YES, this.MSGBOXACTION.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              deferred.resolve('OK');
            } else {
              deferred.resolve('NO');
            }
          }
        });

      return deferred.promise;
    }

  });

});