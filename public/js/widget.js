var defaultConfig = {
  widgetURL: "widget",
  button: {
    width: 300,
    height: 126,
  },
  standard: {
    width: 375,
    height: 390,
    borderRadius: 12,
  },
};

var defaultStyles = {
  border: "none",
  "border-radius": "12px",
  display: "block !important",
  visibility: "visible",
  background: "none transparent",
  opacity: 1,
  "pointer-events": "auto",
  "touch-action": "auto",
};

var WigetType = {
  BUTTON: "button",
  STANDARD: "standard",
};

var WidgetScreen = {
  INIT: "widget",
  CONTACT: "contact",
};

var CSS_FILE_NAME = "widget";
var PREFIX_MODAL = "modal-";
var PREFIX_MODAL_LOADER = "modal-loader-";
var PREFIX_FIND_TABLE_RESULT = "table-result-";
var ACTION_TYPE = {
  INIT: "widget_init",
  FIND_TABLE: "widget_find_table",
  INITIAL_DATA_WIDGET: "widget_initial_data",
  SAVE_CONTACT_DATA: "widget_save_contact_data",
  BUILD_CONTACT_POPUP: "widget_build_contact_popup",
};
var KEY_STORE_CONTACT_PAGE = "widget_data_contact_page";

function getCurrentURLScript() {
  var scripts = document.getElementsByTagName("script");

  if (!scripts.length) {
    return "";
  }

  for (let script in scripts) {
    if (scripts[script].src.includes("brandShortName" || "widget")) {
      return scripts[script].src;
    }
  }
  return "";
}

function getCurrentAppURL(sourceURL) {
  return sourceURL.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/, "$1");
}

function parseQuerySourceURL(sourceURL) {
  var queryString = sourceURL.replace(/^[^\?]+\??/, "");
  var currentAppURL = getCurrentAppURL(sourceURL);
  var params = new Object({
    url: currentAppURL,
  });

  if (!queryString) {
    return params;
  }

  var originalParams = queryString.split(/[;&]/);

  for (var i = 0; i < originalParams.length; i++) {
    var keyValue = originalParams[i].split("=");

    if (!keyValue || keyValue.length !== 2) {
      continue;
    }

    var key = unescape(keyValue[0]);
    var value = unescape(keyValue[1]);

    value = value.replace(/\+/g, " ");
    params[key] = value;
  }

  return params;
}

function loadCSSStyleFromServer(serverURL) {
  return new Promise(function (resolve) {
    var isExistCssFile = !!document.getElementById(CSS_FILE_NAME);

    if (isExistCssFile) {
      resolve();
      return;
    }

    var link = document.createElement("link");

    link.id = CSS_FILE_NAME;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = serverURL + "css/" + CSS_FILE_NAME + ".css";
    link.media = "all";
    document.head.appendChild(link);

    link.onload = function () {
      resolve();
    };
  });
}

function randomString() {
  return Math.random().toString(36).substr(2, 15);
}

function handleFindTableUsingPopup(widgetObject, widgetInfoTyping) {
  var container = document.createElement("div");
  var findTableResultId = PREFIX_FIND_TABLE_RESULT + widgetObject.modalId;
  var modalLoaderId = PREFIX_MODAL_LOADER + widgetObject.modalId;

  var template =
    '<div class="overlay-container">' +
    '<div class="modal-content-container">' +
    '<div class="modal-header"><span class="close" data-close-Id="' +
    widgetObject.modalId +
    '">&times;</span></div>' +
    '<div class="modal-body">' +
    '<div style="height: 100%;" id="' +
    findTableResultId +
    '"></div>' +
    "</div>" +
    "</div>" +
    '<div class="modal-loader" id="' +
    modalLoaderId +
    '"></div>' +
    "</div>";

  container.id = PREFIX_MODAL + widgetObject.modalId;
  container.innerHTML = template;

  document.body.setAttribute("style", "overflow: hidden");

  window.focus();

  // Handle close modal
  container.addEventListener("click", function (event) {
    var closeId = event.target.dataset.closeId;

    if (!closeId || closeId !== widgetObject.modalId) {
      return;
    }
    document.body.setAttribute("style", "overflow: unset");
    document.getElementById(container.id).remove();
    localStorage.removeItem(KEY_STORE_CONTACT_PAGE);
    widgetObject.resetWidget();
  });

  document.body.appendChild(container);

  document.addEventListener("keyup", function (event) {
    if (event.key === "Escape") {
      document.body.setAttribute("style", "overflow: unset");
      document.getElementById(`modal-${widgetObject.modalId}`)?.remove();
      localStorage.removeItem(KEY_STORE_CONTACT_PAGE);
      widgetObject.resetWidget();
    }
  });

  // Add contact page into IFrame
  var tableResultDOM = document.getElementById(findTableResultId);
  var iframeStyles = Object.assign({}, defaultStyles);
  var styles = "";

  iframeStyles["width"] = "100%";
  iframeStyles["height"] = "100%";

  for (let key in iframeStyles) {
    styles += key + ": " + iframeStyles[key] + ";";
  }

  widgetObject.subIframe = document.createElement("iframe");
  widgetObject.subIframe.setAttribute("style", styles);

  // Remove lodaing when iframe is loaded
  widgetObject.subIframe.onload = function () {
    document.getElementById(modalLoaderId).remove();
  };

  widgetObject.subIframe.src =
    widgetObject.config.url + widgetInfoTyping.brand.shortName;
  widgetObject.subIframe.referrerPolicy = "origin";

  tableResultDOM.appendChild(widgetObject.subIframe);
}

var currentURLScript = getCurrentURLScript();
var queryParams = parseQuerySourceURL(currentURLScript);

var Widget = {
  iframe: null,
  subIframe: null,
  config: null,
  modalId: "",
  isSavedContactData: false,
  isLoadedModal: false,

  init: async function (config) {
    var height = defaultConfig[config.type].height;
    var width = defaultConfig[config.type].width;
    var iframeStyles = Object.assign({}, defaultStyles);

    if (!config?.outletId && config?.type === "standard") {
      height = 470;
    }

    config["height"] = height;
    config["width"] = width;

    iframeStyles["height"] = height + "px";
    iframeStyles["width"] = "100%";
    iframeStyles["min-width"] = "272px";
    iframeStyles["max-width"] = "376px";

    if (WigetType.STANDARD === config.type) {
      iframeStyles["border-radius"] =
        defaultConfig[config.type].borderRadius + "px";
    }

    this.config = config;
    this.modalId = randomString();
    this.createIframe(iframeStyles);
    loadCSSStyleFromServer(this.config.url);
  },

  createIframe: function (iframeStyles) {
    var parentContainer = document.getElementById("reserve-container");
    var styles = "";
    for (let key in iframeStyles) {
      styles += key + ": " + iframeStyles[key] + ";";
    }

    this.iframe = document.createElement("iframe");
    this.iframe.setAttribute("style", styles);
    this.iframe.src = this.config.url + defaultConfig.widgetURL;
    this.iframe.referrerPolicy = "origin";

    if (parentContainer) {
      parentContainer.appendChild(this.iframe);
    } else {
      document.body.appendChild(this.iframe);
    }

    this.setupListeners();
  },

  setupListeners: function () {
    window.addEventListener("message", this.handleMessage.bind(this));
  },

  handleMessage: function (e) {
    e.preventDefault();

    if (!e.data || typeof e.data !== "string") {
      return;
    }

    var data = JSON.parse(e.data);

    switch (data.action) {
      case ACTION_TYPE.INIT: {
        // Initial data for wiget page
        if (this.iframe && data.screen === WidgetScreen.INIT) {
          var postMessageData = {
            action: ACTION_TYPE.INITIAL_DATA_WIDGET,
            data: {
              type: this.config.type,
              outletId: this.config.outletId,
              brandShortName: this.config.brandShortName,
              modalId: this.modalId,
              token: this.config.token,
              timeslot: this.config?.timeslot,
              date: this.config?.date,
              adult: this.config?.adult,
              child: this.config?.child,
            },
          };
          this.iframe.contentWindow.postMessage(
            JSON.stringify(postMessageData),
            "*"
          );
        }

        break;
      }

      case ACTION_TYPE.FIND_TABLE: {
        if (
          this.modalId === data.widgetInfo.modalId &&
          !this.isSavedContactData
        ) {
          var postMessageData = {
            action: ACTION_TYPE.SAVE_CONTACT_DATA,
            data: data.widgetInfo,
          };

          this.isSavedContactData = true;
          this.iframe.contentWindow.postMessage(
            JSON.stringify(postMessageData),
            "*"
          );
        }

        break;
      }

      case ACTION_TYPE.BUILD_CONTACT_POPUP: {
        if (this.modalId === data.data.modalId && !this.isLoadedModal) {
          this.isLoadedModal = true;
          handleFindTableUsingPopup(this, data.data);
        }

        break;
      }

      default:
        break;
    }
  },

  resetWidget: function () {
    this.subIframe = null;
    this.isSavedContactData = false;
    this.isLoadedModal = false;
  },
};

Widget.init(queryParams);
