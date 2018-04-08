// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({6:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],5:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":6}],3:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":5}],9:[function(require,module,exports) {
/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

module.exports = head;

},{}],8:[function(require,module,exports) {
module.exports = require('./head');

},{"./head":9}],7:[function(require,module,exports) {
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _first = require("lodash/first");

var _first2 = _interopRequireDefault(_first);

var _last = require("lodash/last");

var _last2 = _interopRequireDefault(_last);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = {
  first: _first2.default,
  last: _last2.default
};

var Dasher = function () {
  function Dasher() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Dasher);

    this.DASHER_NAME = opts.dasher || "dasher";
    this.DASHES_NAME = opts.dash || "dash";
    this.DASHER = document.getElementById(this.DASHER_NAME);
    this.DASHES = document.getElementsByClassName(this.DASHES_NAME);
    this.DASH_SPEED = opts.DashSpeed || 700;
    this.DASH_TRANSITION = opts.DashTransition || 'ease';
    this.onWheel = this.onWheel.bind(this);
    this.LOOP_DASHING = opts.loopDashing || false;
    this.MAX_SCROLLSPEED = opts.maxScrollSpeed || 15;
    this.STD_MENU = opts.stdMenu || true;
    // this.PHANTOM          = opts.phantomDash || true; 
    // this.PHANTOM_HANDLER  = opts.phantomHandler || false;
    this.TIMER = Date.now();
    this.ACTIVE_DASH = _.first(this.DASHES);
    this.SCROLL_HISTORY = [];
    this.PHANTOM_HISTORY = 0;
    this.TEST = 0;

    this.PHANTOM_ENABLED = true;
    this.PHANTOM_PROP = 'opacity';
    this.PHANTOM_START = true;
    this.switch = false;
    this.done = false;

    this.PHANTOM_HANDLER = function () {
      var dash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (dash && value && opts.phantomHandler) {
        return opts.phantomHandler(dash, value);
      } else if (opts.phantomAnimation) {
        return this.phantomAnimation(dash, value, opts.phantomAnimation);
      } else {
        // _default_
        return this.phantomDefaultAnimation(dash, value);
      }
    };
  }

  _createClass(Dasher, [{
    key: "phantomDefaultAnimation",
    value: function phantomDefaultAnimation(dash, value) {

      console.log(dash, value);
      var property = 'opacity';
      this.PHANTOM_PROP = property;
      if (this.PHANTOM_START) {
        this.PHANTOM_PRE = dash.style[property];
        this.PHANTOM_START = false;
      }
      dash.style[property] = value;
    }
  }, {
    key: "phantomAnimation",
    value: function phantomAnimation(dash, value, animation) {
      console.log('phantom Animation');
    }
  }, {
    key: "restorePhantomDash",
    value: function restorePhantomDash(dash) {
      var _this = this;

      setTimeout(function () {
        _this.PHANTOM_START = true;
        console.log('restting dash: ', dash);
        console.log('PRE PHANTOM: ', _this.PHANTOM_PRE);
        dash.style[_this.PHANTOM_PROP] = _this.PHANTOM_PRE;
        console.log('resetting...');
      }, this.DASH_SPEED);
    }
  }, {
    key: "onWheel",
    value: function onWheel(e) {
      this.updateScrollHistory(e.deltaY);

      // if not at edges and switch is false. Scroll within section.
      if (this.isOverflowHandler(this.ACTIVE_DASH, e) && !this.switch) {
        return this.handleOverflowScroll(e);
      } else {
        // If switch is not turned on yet:
        if (!this.switch) {
          // if we hit edges once. Turn switch on untill we are this.done.
          if (this.isAtEdges(this.ACTIVE_DASH, e)) {
            this.switch = true;
          }
        } // if switch is on and we are not done: Remember: Overflowscroll disabled because switch is on!
        else if (this.switch && !this.done) {

            // TO-DO Determine if at bottom or at top.
            // 

            // this.determineLocation(this.ACTIVE_DASH, e);

            var direction = this.getDirection(e.deltaY);

            if (this.isAtBottom(this.ACTIVE_DASH)) {
              var amount = 0;

              if (direction.direction === 'down') {
                console.log('going down');
                amount = 1;
                this.PHANTOM_HISTORY += amount;
                var value = 1 - this.PHANTOM_HISTORY / 100;
                this.PHANTOM_HANDLER(this.ACTIVE_DASH, value);
              }

              //TO-DO break free if phantom history is -1;
              else if (direction.direction === 'up') {
                  amount = -1;
                  this.PHANTOM_HISTORY += amount;
                  var _value = 1 - this.PHANTOM_HISTORY / 100;

                  this.PHANTOM_HANDLER(this.ACTIVE_DASH, _value);
                  console.log(this.PHANTOM_HISTORY);
                }

              if (this.PHANTOM_HISTORY === 100) {
                this.restorePhantomDash(this.ACTIVE_DASH);
                this.done = true;
                this.switch = false;
              } else if (this.PHANTOM_HISTORY <= 0) {
                this.switch = false;
              }
            } else if (this.isAtTop(this.ACTIVE_DASH)) {
              var _amount = 0;

              if (direction.direction === 'down') {
                _amount = -1;
                this.PHANTOM_HISTORY += _amount;
                var _value2 = 1 - this.PHANTOM_HISTORY / 100;

                this.PHANTOM_HANDLER(this.ACTIVE_DASH, _value2);
              } else if (direction.direction === 'up') {
                _amount = 1;
                this.PHANTOM_HISTORY += _amount;
                var _value3 = 1 - this.PHANTOM_HISTORY / 100;
                this.PHANTOM_HANDLER(this.ACTIVE_DASH, _value3);
              }

              if (this.PHANTOM_HISTORY === 100) {
                this.restorePhantomDash(this.ACTIVE_DASH);
                this.done = true;
                this.switch = false;
              } else if (this.PHANTOM_HISTORY <= 0) {
                this.switch = false;
              }
            }

            return;
            // this.isAtBottom(this.ACTIVE_DASH, e);

            var x = e.deltaY > 0 ? 1 : -1;

            // console.log(direction);

            if (direction.direction === 'down') {
              // console.log('down');

              var _amount2 = 1;
              this.PHANTOM_HISTORY += _amount2;
              var _value4 = 1 - this.PHANTOM_HISTORY / 100;
              this.PHANTOM_HANDLER(this.ACTIVE_DASH, _value4);

              if (this.PHANTOM_HISTORY >= 100) {
                this.restorePhantomDash(this.ACTIVE_DASH);
                this.done = true;
                this.switch = false;
              }
              if (this.PHANTOM_HISTORY < 0) {
                this.switch = false;
              }
            } else if (direction.direction === 'up') {

              if (this.isAtTop(this.ACTIVE_DASH, e)) {
                // at bottom

                var _amount3 = -1;
                this.PHANTOM_HISTORY += _amount3;
                var _value5 = 1 - this.PHANTOM_HISTORY / 100;
                this.PHANTOM_HANDLER(this.ACTIVE_DASH, _value5);

                if (this.PHANTOM_HISTORY < 0) {
                  this.switch = false;
                }
              } else {// at top.

              }
            }

            return;
            // ============ ///
            this.PHANTOM_HISTORY += x;
            this.handlePhantomScroll(this.ACTIVE_DASH, e);

            if (this.PHANTOM_HISTORY >= 100) {
              this.restorePhantomDash(this.ACTIVE_DASH);
              this.done = true;
              this.switch = false;
            }
            if (this.PHANTOM_HISTORY < 0) {
              this.switch = false;
            }
          } else {
            //  console.log('switch');
            this.PHANTOM_HISTORY = 0;
            this.done = false;
            this.switch = false;
            return this.handleDash(e);
          }
      }
    }
  }, {
    key: "isAtBottom",
    value: function isAtBottom(dash) {
      var inner = dash.querySelector('.inner');
      var matrix = window.getComputedStyle(inner).transform;
      var matrixOffset = this.getMatrixHeight(matrix);

      // console.log(window.innerHeight + Math.abs(matrixOffset));
      return window.innerHeight + Math.abs(matrixOffset) === inner.scrollHeight;
    }
  }, {
    key: "isAtTop",
    value: function isAtTop(dash) {
      var inner = dash.querySelector('.inner');
      var matrix = window.getComputedStyle(inner).transform;
      var matrixOffset = this.getMatrixHeight(matrix);
      console.log('calculating if at top');

      return matrixOffset === 0;
    }
  }, {
    key: "handlePhantomScroll",
    value: function handlePhantomScroll(dash, e) {
      var value = 1 - this.PHANTOM_HISTORY / 100;
      this.PHANTOM_HANDLER(dash, value);
    }

    // isAtBottom(dash, e) {
    //   const inner = dash.querySelector('.inner');
    //   const matrix = window.getComputedStyle(inner).transform;
    //   const matrixHeight = this.getMatrixHeight(matrix);
    //   const newOffset = matrixHeight - e.deltaY;
    //   const innerHeight = inner.offsetHeight - window.innerHeight;

    //   // also transform inner for seamlessly connecting.
    //   if(innerHeight + newOffset <= 0) { //bottom
    //     console.log('bottom')
    //     // inner.style.transform = `matrix(1,0,0,1,0,${innerHeight * -1})`;
    //     return true;
    //   }
    //   else if ( newOffset >= 0) { //top
    //     // inner.style.transform = `matrix(1,0,0,1,0,1)`;
    //     console.log('top')
    //     return true;
    //   } else {
    //     return false; //overflow
    //   }
    // }

  }, {
    key: "isPhantomHandler",
    value: function isPhantomHandler(dash, e) {}

    // phantomHandler(dash, e) {
    //   const inner = dash.querySelector('.inner');
    //   const matrix = window.getComputedStyle(inner).transform;
    //   const matrixHeight = this.getMatrixHeight(matrix);
    //   const newOffset = matrixHeight - e.deltaY;
    //   const innerHeight = inner.offsetHeight - window.innerHeight;

    //   const event = this.getDirection(e.deltaY);
    //   const abs = Math.abs(e.deltaY);
    //   const moveY = Math.min(Math.max(parseInt(abs), 0.5), 10) * event.modifier;

    //   if(innerHeight + newOffset <= 0) {

    //     this.PHANTOM_HISTORY += +moveY;
    //     console.log(this.PHANTOM_HISTORY);
    //     if(this.PHANTOM_HISTORY <= -1000) {
    //       console.log('trigger');
    //       this.PHANTOM_HISTORY = 0;
    //       this.handleDash(e);
    //     }
    //   }
    // }


  }, {
    key: "isOverflowHandler",
    value: function isOverflowHandler(dash, e) {
      var overflow = dash.scrollHeight > window.innerHeight;
      // console.log('isOverFlowHandler overflow: ', overflow)
      // console.log('isOverFlowHandler !isAtEdges: ', !this.isAtEdges(dash, e))
      return overflow && !this.isAtEdges(dash, e);
    }
  }, {
    key: "isAtEdges",
    value: function isAtEdges(dash, e) {
      var inner = dash.querySelector('.inner');
      var matrix = window.getComputedStyle(inner).transform;
      var matrixHeight = this.getMatrixHeight(matrix);
      var newOffset = matrixHeight - e.deltaY;
      var innerHeight = inner.offsetHeight - window.innerHeight;

      // also transform inner for seamlessly connecting.
      if (innerHeight + newOffset <= 0) {
        //bottom
        inner.style.transform = "matrix(1,0,0,1,0," + innerHeight * -1 + ")";
        return true;
      } else if (newOffset >= 0) {
        //top
        inner.style.transform = "matrix(1,0,0,1,0,0)";
        return true;
      } else {
        return false; //overflow
      }
    }
  }, {
    key: "updateScrollHistory",
    value: function updateScrollHistory(deltaY) {
      if (this.SCROLL_HISTORY.length > 150) this.SCROLL_HISTORY.shift();
      this.SCROLL_HISTORY.push(Math.abs(deltaY));
    }
  }, {
    key: "getNextOffset",
    value: function getNextOffset(inner, e) {
      var event = this.getDirection(e.deltaY);
      var matrix = window.getComputedStyle(inner).transform;
      var currentOffset = this.getMatrixHeight(matrix);
      var abs = Math.abs(e.deltaY);
      var moveY = Math.min(Math.max(parseInt(abs), 0.5), this.MAX_SCROLLSPEED) * event.modifier;
      return currentOffset + moveY;
    }
  }, {
    key: "handleOverflowScroll",
    value: function handleOverflowScroll(e) {
      var isAccelerating = this.isAccelerating(this.SCROLL_HISTORY);
      if (!this.DASHING && isAccelerating) {
        this.scrollHistory = [];
        var inner = this.ACTIVE_DASH.querySelector('.inner');
        var newOffset = this.getNextOffset(inner, e);
        return inner.style.transform = "matrix(1,0,0,1,0," + newOffset + ")";
      }
    }
  }, {
    key: "getMatrixHeight",
    value: function getMatrixHeight(matrix) {
      return Number(_.last(matrix.split(',')).replace(')', ''));
    }
  }, {
    key: "isAccelerating",
    value: function isAccelerating(scrollHistory) {
      var end = this.getAverage(scrollHistory, 10);
      var average = this.getAverage(scrollHistory, 30);
      return end >= average;
    }
  }, {
    key: "getAverage",
    value: function getAverage(elements, number) {
      var sum = 0;
      var lastElements = elements.slice(Math.max(elements.length - number, 1));
      for (var i = 0; i < lastElements.length; i++) {
        sum = sum + lastElements[i];
      }
      return Math.ceil(sum / number);
    }
  }, {
    key: "handleDash",
    value: function handleDash(e) {
      console.log(e);
      var event = this.getDirection(e.deltaY);
      var nextDash = this.getNextDash(this.ACTIVE_DASH, this.LOOP_DASH, event);

      var enoughTimePassed = this.isEnoughTimePassed(Date.now());

      var isAccelerating = this.isAccelerating(this.SCROLL_HISTORY);

      if (nextDash && enoughTimePassed) {

        if (isAccelerating || this.PHANTOM_ENABLED) {

          this.SCROLL_HISTORY = [];
          this.TIMER = Date.now();

          this.setActiveDash(nextDash);
          if (this.STD_MENU) {
            this.setActiveMenu(nextDash);
          }
          this.moveNextDash(nextDash);
        }
      }
    }
  }, {
    key: "setActiveMenu",
    value: function setActiveMenu(nextDash) {
      var menu = document.querySelector(".dasher-menu");
      Array.from(this.DASHES).map(function (dash, index) {
        if (dash.classList.contains('active')) {
          menu.childNodes[index].classList.add('active');
        } else {
          menu.childNodes[index].classList.remove('active');
        }
      });
      console.log(menu.childNodes);
    }
  }, {
    key: "isEnoughTimePassed",
    value: function isEnoughTimePassed(now) {
      var passed = now - this.TIMER;
      return passed >= this.DASH_SPEED;
    }
  }, {
    key: "moveNextDash",
    value: function moveNextDash(nextDash) {
      var offsetTop = nextDash.offsetTop * -1;
      this.DASHER.style.transform = "matrix(1,0,0,1,0," + offsetTop + ")";
    }
  }, {
    key: "getNextDash",
    value: function getNextDash(dash, loopDashing, event) {
      var next = void 0;
      var selection = event.direction === 'down' ? {
        sibling: 'nextElementSibling',
        loopDash: _.first(this.DASHES)
      } : {
        sibling: 'previousElementSibling',
        loopDash: _.last(this.DASHES)
      };

      if (dash[selection.sibling]) {
        return dash[selection.sibling];
      } else {
        if (this.LOOP_DASHING) return selection.loopDash;
      }
    }
  }, {
    key: "getDirection",
    value: function getDirection(deltaY) {
      return deltaY >= 0 ? { direction: "down", modifier: -1, deltaY: deltaY } : { direction: "up", modifier: 1, deltaY: deltaY };
    }
  }, {
    key: "setDashingState",
    value: function setDashingState() {
      var _this2 = this;

      this.DASHING = true;
      this.DASHER.classList.add("dashing");
      setTimeout(function () {
        _this2.DASHING = false;
        _this2.DASHER.classList.remove("dashing");
      }, this.DASH_SPEED);
    }
  }, {
    key: "setActiveDash",
    value: function setActiveDash(dash) {
      Array.from(this.DASHES).forEach(function (el) {
        return el.classList.remove("active");
      });

      this.ACTIVE_DASH = dash;
      this.ACTIVE_DASH.classList.add("active");
      this.setDashingState();
    }
  }, {
    key: "setDasherAnimation",
    value: function setDasherAnimation(duration, style) {
      this.DASHER.style.transition = "all " + duration / 1000 + "s " + style;
    }
  }, {
    key: "_initDashStyles",
    value: function _initDashStyles() {
      Array.from(this.DASHES).forEach(function (dash) {

        dash.style.overflow = "hidden";
        dash.style.height = "100vh";
        dash.style.width = "100%";

        var inner = dash.getElementsByClassName('inner')[0];
        inner.style.minHeight = "100vh";
        inner.style.width = "100%";
        inner.style.transform = "matrix(1,0,0,1,0,0)";
      });
    }
  }, {
    key: "_initInnerDash",
    value: function _initInnerDash() {
      Array.from(this.DASHES).forEach(function (dash) {
        var org_html = dash.innerHTML;
        var new_html = "<div class='inner'>" + org_html + "</div>";
        dash.innerHTML = new_html;
      });
    }
  }, {
    key: "handleMenuClick",
    value: function handleMenuClick(e) {

      var dash = this.DASHES[e.target.dataset.index];
      this.setActiveDash(dash);
      this.moveNextDash(dash);
      this.setActiveMenu(dash);
    }
  }, {
    key: "_initStdMenu",
    value: function _initStdMenu() {
      var _this3 = this;

      var ul = document.createElement("ul");
      ul.classList.add("dasher-menu");

      var length = this.DASHES.length;
      for (var i = 0; i < length; i++) {

        var li = document.createElement("li");
        if (i === 0) {
          li.classList.add('active');
        }
        li.onclick = function (e) {
          return _this3.handleMenuClick(e);
        };
        li.dataset.index = i;
        li.style.transition = "all " + this.DASH_SPEED / 1000 + "s ease";
        ul.appendChild(li);
      }
      document.body.appendChild(ul);
    }
  }, {
    key: "_initDOM",
    value: function _initDOM() {
      this._initInnerDash();
      if (this.STD_MENU) this._initStdMenu();
      this._initDashStyles();
      this.setDasherAnimation(this.DASH_SPEED, this.DASH_TRANSITION);
      this.setActiveDash(this.ACTIVE_DASH);
    }
  }, {
    key: "start",
    value: function start() {
      this._initDOM();
      window.addEventListener('wheel', this.onWheel);
    }
  }]);

  return Dasher;
}();

exports.default = Dasher;
},{"lodash/first":8,"lodash/last":7}],2:[function(require,module,exports) {
"use strict";

require("./src/Dasher.css");

var _Dasher = require("./src/Dasher");

var _Dasher2 = _interopRequireDefault(_Dasher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dasher = new _Dasher2.default({
  // phantomHandler: handler
});
dasher.start();

function handler(dash, value) {
  console.log('dash is ', dash);
}
},{"./src/Dasher.css":3,"./src/Dasher":4}],10:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60124' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[10,2])
//# sourceMappingURL=/dist/dasher.map