"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@deck.gl/layers");

var _constants = _interopRequireDefault(require("@luma.gl/constants"));

var _core = require("@luma.gl/core");

var _outline = _interopRequireDefault(require("../../shaderlib/outline/outline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO - this should be built into assembleShaders
function injectShaderCode(_ref) {
  var source = _ref.source,
      _ref$code = _ref.code,
      code = _ref$code === void 0 ? '' : _ref$code;
  var INJECT_CODE = /}[^{}]*$/;
  return source.replace(INJECT_CODE, code.concat('\n}\n'));
}

var VS_CODE = "  outline_setUV(gl_Position);\n  outline_setZLevel(instanceZLevel);\n";
var FS_CODE = "  gl_FragColor = outline_filterColor(gl_FragColor);\n";
var defaultProps = {
  getZLevel: {
    type: 'accessor',
    value: 0
  }
};

var PathOutlineLayer = /*#__PURE__*/function (_PathLayer) {
  _inherits(PathOutlineLayer, _PathLayer);

  var _super = _createSuper(PathOutlineLayer);

  function PathOutlineLayer() {
    _classCallCheck(this, PathOutlineLayer);

    return _super.apply(this, arguments);
  }

  _createClass(PathOutlineLayer, [{
    key: "getShaders",
    // Override getShaders to inject the outline module
    value: function getShaders() {
      var shaders = _get(_getPrototypeOf(PathOutlineLayer.prototype), "getShaders", this).call(this);

      return Object.assign({}, shaders, {
        modules: shaders.modules.concat([_outline["default"]]),
        vs: injectShaderCode({
          source: shaders.vs,
          code: VS_CODE
        }),
        fs: injectShaderCode({
          source: shaders.fs,
          code: FS_CODE
        })
      });
    }
  }, {
    key: "initializeState",
    value: function initializeState(context) {
      _get(_getPrototypeOf(PathOutlineLayer.prototype), "initializeState", this).call(this, context); // Create an outline "shadow" map
      // TODO - we should create a single outlineMap for all layers


      this.setState({
        outlineFramebuffer: new _core.Framebuffer(context.gl),
        dummyTexture: new _core.Texture2D(context.gl)
      }); // Create an attribute manager

      this.state.attributeManager.addInstanced({
        instanceZLevel: {
          size: 1,
          type: _constants["default"].UNSIGNED_BYTE,
          update: this.calculateZLevels,
          accessor: 'getZLevel'
        }
      });
    } // Override draw to add render module

  }, {
    key: "draw",
    value: function draw(_ref2) {
      var _ref2$moduleParameter = _ref2.moduleParameters,
          moduleParameters = _ref2$moduleParameter === void 0 ? {} : _ref2$moduleParameter,
          parameters = _ref2.parameters,
          uniforms = _ref2.uniforms,
          context = _ref2.context;
      // Need to calculate same uniforms as base layer
      var _this$props = this.props,
          rounded = _this$props.rounded,
          miterLimit = _this$props.miterLimit,
          widthScale = _this$props.widthScale,
          widthMinPixels = _this$props.widthMinPixels,
          widthMaxPixels = _this$props.widthMaxPixels,
          dashJustified = _this$props.dashJustified;
      uniforms = Object.assign({}, uniforms, {
        jointType: Number(rounded),
        alignMode: Number(dashJustified),
        widthScale: widthScale,
        miterLimit: miterLimit,
        widthMinPixels: widthMinPixels,
        widthMaxPixels: widthMaxPixels
      }); // Render the outline shadowmap (based on segment z orders)

      var _this$state = this.state,
          outlineFramebuffer = _this$state.outlineFramebuffer,
          dummyTexture = _this$state.dummyTexture;
      outlineFramebuffer.resize();
      outlineFramebuffer.clear({
        color: true,
        depth: true
      });
      this.state.model.updateModuleSettings({
        outlineEnabled: true,
        outlineRenderShadowmap: true,
        outlineShadowmap: dummyTexture
      });
      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: 0,
          widthScale: this.props.widthScale * 1.3
        }),
        parameters: {
          depthTest: false,
          // Biggest value needs to go into buffer
          blendEquation: _constants["default"].MAX
        },
        framebuffer: outlineFramebuffer
      }); // Now use the outline shadowmap to render the lines (with outlines)

      this.state.model.updateModuleSettings({
        outlineEnabled: true,
        outlineRenderShadowmap: false,
        outlineShadowmap: outlineFramebuffer
      });
      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: Number(rounded),
          widthScale: this.props.widthScale
        }),
        parameters: {
          depthTest: false
        }
      });
    }
  }, {
    key: "calculateZLevels",
    value: function calculateZLevels(attribute) {
      var getZLevel = this.props.getZLevel;
      var pathTesselator = this.state.pathTesselator;
      attribute.value = pathTesselator._updateAttribute({
        target: attribute.value,
        size: 1,
        getValue: function getValue(object, index) {
          return [getZLevel(object, index) || 0];
        }
      });
    }
  }]);

  return PathOutlineLayer;
}(_layers.PathLayer);

exports["default"] = PathOutlineLayer;

_defineProperty(PathOutlineLayer, "layerName", 'PathOutlineLayer');

_defineProperty(PathOutlineLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1vdXRsaW5lLWxheWVyL3BhdGgtb3V0bGluZS1sYXllci50cyJdLCJuYW1lcyI6WyJpbmplY3RTaGFkZXJDb2RlIiwic291cmNlIiwiY29kZSIsIklOSkVDVF9DT0RFIiwicmVwbGFjZSIsImNvbmNhdCIsIlZTX0NPREUiLCJGU19DT0RFIiwiZGVmYXVsdFByb3BzIiwiZ2V0WkxldmVsIiwidHlwZSIsInZhbHVlIiwiUGF0aE91dGxpbmVMYXllciIsInNoYWRlcnMiLCJPYmplY3QiLCJhc3NpZ24iLCJtb2R1bGVzIiwib3V0bGluZSIsInZzIiwiZnMiLCJjb250ZXh0Iiwic2V0U3RhdGUiLCJvdXRsaW5lRnJhbWVidWZmZXIiLCJGcmFtZWJ1ZmZlciIsImdsIiwiZHVtbXlUZXh0dXJlIiwiVGV4dHVyZTJEIiwic3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiYWRkSW5zdGFuY2VkIiwiaW5zdGFuY2VaTGV2ZWwiLCJzaXplIiwiR0wiLCJVTlNJR05FRF9CWVRFIiwidXBkYXRlIiwiY2FsY3VsYXRlWkxldmVscyIsImFjY2Vzc29yIiwibW9kdWxlUGFyYW1ldGVycyIsInBhcmFtZXRlcnMiLCJ1bmlmb3JtcyIsInByb3BzIiwicm91bmRlZCIsIm1pdGVyTGltaXQiLCJ3aWR0aFNjYWxlIiwid2lkdGhNaW5QaXhlbHMiLCJ3aWR0aE1heFBpeGVscyIsImRhc2hKdXN0aWZpZWQiLCJqb2ludFR5cGUiLCJOdW1iZXIiLCJhbGlnbk1vZGUiLCJyZXNpemUiLCJjbGVhciIsImNvbG9yIiwiZGVwdGgiLCJtb2RlbCIsInVwZGF0ZU1vZHVsZVNldHRpbmdzIiwib3V0bGluZUVuYWJsZWQiLCJvdXRsaW5lUmVuZGVyU2hhZG93bWFwIiwib3V0bGluZVNoYWRvd21hcCIsImRyYXciLCJkZXB0aFRlc3QiLCJibGVuZEVxdWF0aW9uIiwiTUFYIiwiZnJhbWVidWZmZXIiLCJhdHRyaWJ1dGUiLCJwYXRoVGVzc2VsYXRvciIsIl91cGRhdGVBdHRyaWJ1dGUiLCJ0YXJnZXQiLCJnZXRWYWx1ZSIsIm9iamVjdCIsImluZGV4IiwiUGF0aExheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQSxTQUFTQSxnQkFBVCxPQUFpRDtBQUFBLE1BQXJCQyxNQUFxQixRQUFyQkEsTUFBcUI7QUFBQSx1QkFBYkMsSUFBYTtBQUFBLE1BQWJBLElBQWEsMEJBQU4sRUFBTTtBQUMvQyxNQUFNQyxXQUFXLEdBQUcsVUFBcEI7QUFDQSxTQUFPRixNQUFNLENBQUNHLE9BQVAsQ0FBZUQsV0FBZixFQUE0QkQsSUFBSSxDQUFDRyxNQUFMLENBQVksT0FBWixDQUE1QixDQUFQO0FBQ0Q7O0FBRUQsSUFBTUMsT0FBTywwRUFBYjtBQUtBLElBQU1DLE9BQU8sMERBQWI7QUFJQSxJQUFNQyxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLFNBQVMsRUFBRTtBQUFFQyxJQUFBQSxJQUFJLEVBQUUsVUFBUjtBQUFvQkMsSUFBQUEsS0FBSyxFQUFFO0FBQTNCO0FBRFEsQ0FBckI7O0lBSXFCQyxnQjs7Ozs7Ozs7Ozs7OztBQUluQjtpQ0FDYTtBQUNYLFVBQU1DLE9BQU8sbUZBQWI7O0FBQ0EsYUFBT0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkYsT0FBbEIsRUFBMkI7QUFDaENHLFFBQUFBLE9BQU8sRUFBRUgsT0FBTyxDQUFDRyxPQUFSLENBQWdCWCxNQUFoQixDQUF1QixDQUFDWSxtQkFBRCxDQUF2QixDQUR1QjtBQUVoQ0MsUUFBQUEsRUFBRSxFQUFFbEIsZ0JBQWdCLENBQUM7QUFBRUMsVUFBQUEsTUFBTSxFQUFFWSxPQUFPLENBQUNLLEVBQWxCO0FBQXNCaEIsVUFBQUEsSUFBSSxFQUFFSTtBQUE1QixTQUFELENBRlk7QUFHaENhLFFBQUFBLEVBQUUsRUFBRW5CLGdCQUFnQixDQUFDO0FBQUVDLFVBQUFBLE1BQU0sRUFBRVksT0FBTyxDQUFDTSxF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VCxDQUFULElBQTRCLENBQTdCLENBQW5CO0FBQUE7QUFIc0MsT0FBaEMsQ0FBbEI7QUFLRDs7OztFQTFHMkNDLGlCOzs7O2dCQUF6QjNELGdCLGVBQ0Esa0I7O2dCQURBQSxnQixrQkFFR0osWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhdGhMYXllciB9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQgR0wgZnJvbSAnQGx1bWEuZ2wvY29uc3RhbnRzJztcbmltcG9ydCB7IEZyYW1lYnVmZmVyLCBUZXh0dXJlMkQgfSBmcm9tICdAbHVtYS5nbC9jb3JlJztcbmltcG9ydCBvdXRsaW5lIGZyb20gJy4uLy4uL3NoYWRlcmxpYi9vdXRsaW5lL291dGxpbmUnO1xuXG4vLyBUT0RPIC0gdGhpcyBzaG91bGQgYmUgYnVpbHQgaW50byBhc3NlbWJsZVNoYWRlcnNcbmZ1bmN0aW9uIGluamVjdFNoYWRlckNvZGUoeyBzb3VyY2UsIGNvZGUgPSAnJyB9KSB7XG4gIGNvbnN0IElOSkVDVF9DT0RFID0gL31bXnt9XSokLztcbiAgcmV0dXJuIHNvdXJjZS5yZXBsYWNlKElOSkVDVF9DT0RFLCBjb2RlLmNvbmNhdCgnXFxufVxcbicpKTtcbn1cblxuY29uc3QgVlNfQ09ERSA9IGBcXFxuICBvdXRsaW5lX3NldFVWKGdsX1Bvc2l0aW9uKTtcbiAgb3V0bGluZV9zZXRaTGV2ZWwoaW5zdGFuY2VaTGV2ZWwpO1xuYDtcblxuY29uc3QgRlNfQ09ERSA9IGBcXFxuICBnbF9GcmFnQ29sb3IgPSBvdXRsaW5lX2ZpbHRlckNvbG9yKGdsX0ZyYWdDb2xvcik7XG5gO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGdldFpMZXZlbDogeyB0eXBlOiAnYWNjZXNzb3InLCB2YWx1ZTogMCB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aE91dGxpbmVMYXllciBleHRlbmRzIFBhdGhMYXllcjxhbnk+IHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdQYXRoT3V0bGluZUxheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICAvLyBPdmVycmlkZSBnZXRTaGFkZXJzIHRvIGluamVjdCB0aGUgb3V0bGluZSBtb2R1bGVcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBzaGFkZXJzID0gc3VwZXIuZ2V0U2hhZGVycygpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzaGFkZXJzLCB7XG4gICAgICBtb2R1bGVzOiBzaGFkZXJzLm1vZHVsZXMuY29uY2F0KFtvdXRsaW5lXSksXG4gICAgICB2czogaW5qZWN0U2hhZGVyQ29kZSh7IHNvdXJjZTogc2hhZGVycy52cywgY29kZTogVlNfQ09ERSB9KSxcbiAgICAgIGZzOiBpbmplY3RTaGFkZXJDb2RlKHsgc291cmNlOiBzaGFkZXJzLmZzLCBjb2RlOiBGU19DT0RFIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKGNvbnRleHQ6IGFueSkge1xuICAgIHN1cGVyLmluaXRpYWxpemVTdGF0ZShjb250ZXh0KTtcblxuICAgIC8vIENyZWF0ZSBhbiBvdXRsaW5lIFwic2hhZG93XCIgbWFwXG4gICAgLy8gVE9ETyAtIHdlIHNob3VsZCBjcmVhdGUgYSBzaW5nbGUgb3V0bGluZU1hcCBmb3IgYWxsIGxheWVyc1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgb3V0bGluZUZyYW1lYnVmZmVyOiBuZXcgRnJhbWVidWZmZXIoY29udGV4dC5nbCksXG4gICAgICBkdW1teVRleHR1cmU6IG5ldyBUZXh0dXJlMkQoY29udGV4dC5nbCksXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgYW4gYXR0cmlidXRlIG1hbmFnZXJcbiAgICB0aGlzLnN0YXRlLmF0dHJpYnV0ZU1hbmFnZXIuYWRkSW5zdGFuY2VkKHtcbiAgICAgIGluc3RhbmNlWkxldmVsOiB7XG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIHR5cGU6IEdMLlVOU0lHTkVEX0JZVEUsXG4gICAgICAgIHVwZGF0ZTogdGhpcy5jYWxjdWxhdGVaTGV2ZWxzLFxuICAgICAgICBhY2Nlc3NvcjogJ2dldFpMZXZlbCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgZHJhdyB0byBhZGQgcmVuZGVyIG1vZHVsZVxuICBkcmF3KHsgbW9kdWxlUGFyYW1ldGVycyA9IHt9LCBwYXJhbWV0ZXJzLCB1bmlmb3JtcywgY29udGV4dCB9KSB7XG4gICAgLy8gTmVlZCB0byBjYWxjdWxhdGUgc2FtZSB1bmlmb3JtcyBhcyBiYXNlIGxheWVyXG4gICAgY29uc3Qge1xuICAgICAgcm91bmRlZCxcbiAgICAgIG1pdGVyTGltaXQsXG4gICAgICB3aWR0aFNjYWxlLFxuICAgICAgd2lkdGhNaW5QaXhlbHMsXG4gICAgICB3aWR0aE1heFBpeGVscyxcbiAgICAgIGRhc2hKdXN0aWZpZWQsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICB1bmlmb3JtcyA9IE9iamVjdC5hc3NpZ24oe30sIHVuaWZvcm1zLCB7XG4gICAgICBqb2ludFR5cGU6IE51bWJlcihyb3VuZGVkKSxcbiAgICAgIGFsaWduTW9kZTogTnVtYmVyKGRhc2hKdXN0aWZpZWQpLFxuICAgICAgd2lkdGhTY2FsZSxcbiAgICAgIG1pdGVyTGltaXQsXG4gICAgICB3aWR0aE1pblBpeGVscyxcbiAgICAgIHdpZHRoTWF4UGl4ZWxzLFxuICAgIH0pO1xuXG4gICAgLy8gUmVuZGVyIHRoZSBvdXRsaW5lIHNoYWRvd21hcCAoYmFzZWQgb24gc2VnbWVudCB6IG9yZGVycylcbiAgICBjb25zdCB7IG91dGxpbmVGcmFtZWJ1ZmZlciwgZHVtbXlUZXh0dXJlIH0gPSB0aGlzLnN0YXRlO1xuICAgIG91dGxpbmVGcmFtZWJ1ZmZlci5yZXNpemUoKTtcbiAgICBvdXRsaW5lRnJhbWVidWZmZXIuY2xlYXIoeyBjb2xvcjogdHJ1ZSwgZGVwdGg6IHRydWUgfSk7XG5cbiAgICB0aGlzLnN0YXRlLm1vZGVsLnVwZGF0ZU1vZHVsZVNldHRpbmdzKHtcbiAgICAgIG91dGxpbmVFbmFibGVkOiB0cnVlLFxuICAgICAgb3V0bGluZVJlbmRlclNoYWRvd21hcDogdHJ1ZSxcbiAgICAgIG91dGxpbmVTaGFkb3dtYXA6IGR1bW15VGV4dHVyZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUubW9kZWwuZHJhdyh7XG4gICAgICB1bmlmb3JtczogT2JqZWN0LmFzc2lnbih7fSwgdW5pZm9ybXMsIHtcbiAgICAgICAgam9pbnRUeXBlOiAwLFxuICAgICAgICB3aWR0aFNjYWxlOiB0aGlzLnByb3BzLndpZHRoU2NhbGUgKiAxLjMsXG4gICAgICB9KSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgZGVwdGhUZXN0OiBmYWxzZSxcbiAgICAgICAgLy8gQmlnZ2VzdCB2YWx1ZSBuZWVkcyB0byBnbyBpbnRvIGJ1ZmZlclxuICAgICAgICBibGVuZEVxdWF0aW9uOiBHTC5NQVgsXG4gICAgICB9LFxuICAgICAgZnJhbWVidWZmZXI6IG91dGxpbmVGcmFtZWJ1ZmZlcixcbiAgICB9KTtcblxuICAgIC8vIE5vdyB1c2UgdGhlIG91dGxpbmUgc2hhZG93bWFwIHRvIHJlbmRlciB0aGUgbGluZXMgKHdpdGggb3V0bGluZXMpXG4gICAgdGhpcy5zdGF0ZS5tb2RlbC51cGRhdGVNb2R1bGVTZXR0aW5ncyh7XG4gICAgICBvdXRsaW5lRW5hYmxlZDogdHJ1ZSxcbiAgICAgIG91dGxpbmVSZW5kZXJTaGFkb3dtYXA6IGZhbHNlLFxuICAgICAgb3V0bGluZVNoYWRvd21hcDogb3V0bGluZUZyYW1lYnVmZmVyLFxuICAgIH0pO1xuICAgIHRoaXMuc3RhdGUubW9kZWwuZHJhdyh7XG4gICAgICB1bmlmb3JtczogT2JqZWN0LmFzc2lnbih7fSwgdW5pZm9ybXMsIHtcbiAgICAgICAgam9pbnRUeXBlOiBOdW1iZXIocm91bmRlZCksXG4gICAgICAgIHdpZHRoU2NhbGU6IHRoaXMucHJvcHMud2lkdGhTY2FsZSxcbiAgICAgIH0pLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVpMZXZlbHMoYXR0cmlidXRlKSB7XG4gICAgY29uc3QgeyBnZXRaTGV2ZWwgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBwYXRoVGVzc2VsYXRvciB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGF0dHJpYnV0ZS52YWx1ZSA9IHBhdGhUZXNzZWxhdG9yLl91cGRhdGVBdHRyaWJ1dGUoe1xuICAgICAgdGFyZ2V0OiBhdHRyaWJ1dGUudmFsdWUsXG4gICAgICBzaXplOiAxLFxuICAgICAgZ2V0VmFsdWU6IChvYmplY3QsIGluZGV4KSA9PiBbZ2V0WkxldmVsKG9iamVjdCwgaW5kZXgpIHx8IDBdLFxuICAgIH0pO1xuICB9XG59XG4iXX0=