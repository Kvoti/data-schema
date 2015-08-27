'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var ManagedObject = (function () {
  function ManagedObject(schema) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var initial = _ref.initial;
    var data = _ref.data;
    var onChange = _ref.onChange;

    _classCallCheck(this, ManagedObject);

    this._pendNextChange = false;
    this._pendingChange = null;
    this._isBound = {};
    this._errors = {};
    this._options = {};
    this._onChange = onChange;
    var path = [];

    this.managed = schema(this, this, path);
    if (initial !== undefined) {
      this.managed.set(initial);
    }
    if (data !== undefined) {
      this.managed.set(data);
    }
    this._isInitialised = true;
    if (data) {
      // FIXME
      this._validate();
    }
  }

  // Public API

  _createClass(ManagedObject, [{
    key: 'get',
    value: function get() {
      return this._managedObject;
    }
  }, {
    key: 'isChanged',
    value: function isChanged(original) {
      //    console.log('is changed', this._managedObject, original);
      var result = !_lodash2['default'].isEqual(this._managedObject, original);
      return result;
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      for (var path in this._errors) {
        if (this._errors.hasOwnProperty(path)) {
          if (this._errors[path] !== null && this._errors[path].length) {
            return false;
          }
        }
      }
      return true;
    }
  }, {
    key: 'pend',
    value: function pend() {
      if (this._pendNextChange) {
        throw new Error('Already pending');
      }
      this._pendNextChange = true;
      return this;
    }
  }, {
    key: 'toState',
    value: function toState() {
      return {
        managedObject: this._managedObject,
        pendNextChange: this._pendNextChange,
        pendingChange: this._pendingChange,
        isBound: this._isBound,
        errors: this._errors
      };
    }

    // Private methods
  }, {
    key: '_set',
    value: function _set(path, value) {
      if (this._pendNextChange) {
        if (this._pendingChange && !_lodash2['default'].isEqual(path, this._pendingChange.path)) {
          throw new Error('Cannot pend more than one change');
        }
        this._pendingChange = { path: path, value: value };
        this._pendNextChange = false;
      } else {
        if (this._pendingChange && !_lodash2['default'].isEqual(path, this._pendingChange.path)) {
          throw new Error('Cannot change other state while change is pending');
        }
        this._setPathToValue(path, value);
        this._pendingChange = null;
        this._pendNextChange = false;
      }
    }
  }, {
    key: '_setPathToValue',
    value: function _setPathToValue(path, value) {
      //    console.log('setting', path, value);
      if (this._managedObject === undefined || !path.length) {
        this._managedObject = value;
        return;
      }
      var state = this._managedObject;
      path.slice(0, path.length - 1).forEach(function (p) {
        state = state[p];
      });
      state[path[path.length - 1]] = value;
    }
  }, {
    key: '_get',
    value: function _get(path) {
      var item = this._managedObject;
      path.forEach(function (p) {
        item = item[p];
      });
      return item;
    }
  }, {
    key: '_getPending',
    value: function _getPending(path) {
      if (this._pendingChange && _lodash2['default'].isEqual(path, this._pendingChange.path)) {
        return this._pendingChange.value;
      }
    }
  }, {
    key: '_validate',
    value: function _validate() {
      this.managed._validate();
    }
  }, {
    key: 'validateWithUnbound',
    value: function validateWithUnbound() {
      this._validateUnbound = true;
      this.managed._validate();
    }
  }, {
    key: '_getIsBound',
    value: function _getIsBound(path) {
      if (this._validateUnbound) {
        return true;
      }
      var stringifiedPath = String(path);
      if (this._isBound.hasOwnProperty(stringifiedPath)) {
        return this._isBound[path];
      }
      return false;
    }
  }, {
    key: '_setIsBound',
    value: function _setIsBound(path, value) {
      this._isBound[path] = value;
    }
  }, {
    key: '_getErrors',
    value: function _getErrors(path) {
      if (this._errors.hasOwnProperty(path)) {
        return this._errors[path];
      }
      return [];
    }
  }, {
    key: '_setErrors',
    value: function _setErrors(path, errors) {
      this._errors[path] = errors;
    }
  }, {
    key: '_removeIsBound',
    value: function _removeIsBound(path) {
      delete this._isBound[path];
    }
  }, {
    key: '_removeErrors',
    value: function _removeErrors(path) {
      delete this._errors[path];
    }
  }], [{
    key: 'fromState',
    value: function fromState(schema, state, onChange) {
      var initial = state.managedObject;
      var object = new ManagedObject(schema, { initial: initial });
      object._pendNextChange = state.pendNextChange;
      object._pendingChange = state.pendingChange;
      object._isBound = state.isBound;
      object._errors = state.errors;
      object._onChange = onChange;
      return object;
    }
  }]);

  return ManagedObject;
})();

exports.ManagedObject = ManagedObject;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseCollectionManager2 = require('./BaseCollectionManager');

var ArrayManager = (function (_BaseCollectionManager) {
  _inherits(ArrayManager, _BaseCollectionManager);

  function ArrayManager(managedObject, parent, path, MemberManager, options) {
    _classCallCheck(this, ArrayManager);

    _get(Object.getPrototypeOf(ArrayManager.prototype), 'constructor', this).call(this, managedObject, parent, path, options);
    this._MemberManager = MemberManager;
    this._object._set(this._path, []);
  }

  _createClass(ArrayManager, [{
    key: 'canAdd',
    value: function canAdd() {
      if (!this._options.canAdd) {
        return false;
      }
      if (this._options.maxLength === undefined) {
        return true;
      }
      /// TODO how does this happen?
      if (this.get() === undefined) {
        return true;
      }
      var length = this.get().length;
      return length < this._options.maxLength;
    }
  }, {
    key: 'add',
    value: function add(value, manager) {
      if (value === undefined) {
        value = this._options.empty;
        if (value === undefined) {
          throw new Error("Can't add Array item with no 'empty' value");
        }
      }
      console.log('adding', value);
      // TODO details of storage should all live with ManagedObject as an array
      // _might_ be stored as a real Array or an ImmutableJS array or object
      // or something else entirely.
      var array = this.get();
      if (array === undefined) {
        // TODO how can this.get() be undefined?
        array = [];
        this._object._set(this._path, array); // or this.set([])??
      }
      array.push(undefined);
      if (array.length - 2 >= 0 && !this[array.length - 2].isBound) {
        this[array.length - 2].isBound = true;
      }
      this._setIndex(array.length - 1, value, manager);
      //this._object._validate();
      if (this._options.postAdd) {
        this._options.postAdd.call(this, this[array.length - 1], value);
      }
    }
  }, {
    key: 'reorder',
    value: function reorder(indices) {
      var _this = this;

      console.log('reordering', indices, this._path, this);
      var reordered = [];
      indices.forEach(function (origIndex, index) {
        reordered.push(_this[origIndex].get());
        _this[index]._preRemove();
      });
      this.set(reordered);
      if (this._options.postReorder) {
        this._options.postReorder.call(this, indices);
      }
      //this._object._validate();
    }

    // private methods
    // TODO maybe these 'can' methods are UI things?
  }, {
    key: 'canRemoveItems',
    value: function canRemoveItems() {
      if (this._options.canRemove === undefined) {
        return false;
      }
      var length = this.get().length;
      if (length && (this._options.minLength === undefined || this._options.minLength < length)) {
        return true;
      }
      return false;
    }
  }, {
    key: '_remove',
    value: function _remove(index) {
      // TODO details of storage should all live with ManagedObject as an array
      // _might_ be stored as a real Array or an ImmutableJS array or object
      // or something else entirely.
      var array = this.get();
      array.splice(index, 1);
      this[index]._preRemove();
      this._removeMembers();
      this.set(array);
      this._errors = [];
      if (this._options.postRemove) {
        this._options.postRemove.call(this, index);
      }
      //this._object._validate();
    }
  }, {
    key: 'canReorderItems',
    value: function canReorderItems() {
      return this._options.canReorder;
    }
  }, {
    key: '_checkValue',
    value: function _checkValue(values) {
      try {
        if (values.push === undefined) {
          throw new Error();
        }
      } catch (e) {
        throw new Error('Values must be iterable ' + values);
      }
    }
  }, {
    key: '_setCheckedValue',
    value: function _setCheckedValue(values) {
      var _this2 = this;

      this._object._set(this._path, []);
      values.forEach(function (v, i) {
        _this2._setIndex(i, v);
      });
      return this._object;
    }
  }, {
    key: '_setIndex',
    value: function _setIndex(i, v, Manager) {
      if (this._options.getMemberManager) {
        Manager = this._options.getMemberManager(v);
      } else if (Manager === undefined) {
        Manager = this._MemberManager;
      }
      var path = this._path.concat([i]);
      this[i] = new Manager(this._object, this, path, i);
      this[i].set(v);
    }
  }, {
    key: '_memberKeys',
    get: function get() {
      var keys = [];
      for (var k in this) {
        if (this.hasOwnProperty(k) && k !== 'parent' && this[k] && this[k].__isManager === true) {
          keys.push(k);
        }
      }
      keys.sort();
      return keys;
    }
  }]);

  return ArrayManager;
})(_BaseCollectionManager2.BaseCollectionManager);

exports.ArrayManager = ArrayManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseManager2 = require('./BaseManager');

var _BaseManager3 = _interopRequireDefault(_BaseManager2);

var BaseCollectionManager = (function (_BaseManager) {
  _inherits(BaseCollectionManager, _BaseManager);

  function BaseCollectionManager() {
    _classCallCheck(this, BaseCollectionManager);

    _get(Object.getPrototypeOf(BaseCollectionManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BaseCollectionManager, [{
    key: '_removeMembers',

    // private methods
    value: function _removeMembers() {
      var _this = this;

      this._memberKeys.forEach(function (k) {
        _this[k]._preRemove();
        delete _this[k];
      });
    }
  }, {
    key: '_preRemove',
    value: function _preRemove() {
      var _this2 = this;

      this._object._removeIsBound(this._path);
      this._object._removeErrors(this._path);
      this._memberKeys.forEach(function (k) {
        if (_this2[k]._preRemove) {
          _this2[k]._preRemove();
        }
      });
    }
  }, {
    key: '_validate',
    value: function _validate() {
      var _this3 = this;

      this._memberKeys.forEach(function (k) {
        _this3[k]._validate();
      });
      this.errors = [];
    }
  }, {
    key: 'members',
    get: function get() {
      var _this4 = this;

      var members = [];
      this._memberKeys.forEach(function (k) {
        return members.push([k, _this4[k]]);
      });
      return members;
    }
  }]);

  return BaseCollectionManager;
})(_BaseManager3['default']);

exports.BaseCollectionManager = BaseCollectionManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseManager2 = require('./BaseManager');

var _BaseManager3 = _interopRequireDefault(_BaseManager2);

var _ArrayManager = require('./ArrayManager');

var BaseItemManager = (function (_BaseManager) {
  _inherits(BaseItemManager, _BaseManager);

  function BaseItemManager() {
    _classCallCheck(this, BaseItemManager);

    _get(Object.getPrototypeOf(BaseItemManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BaseItemManager, [{
    key: '_setCheckedValue',

    // private methods
    value: function _setCheckedValue(value) {
      if (!this._object._pendNextChange) {
        if (this._options.isRequired || !this._valueIsEmpty(value)) {
          this.isBound = true;
        }
      }
      return this._object._set(this._path, value);
    }
  }, {
    key: '_preRemove',
    value: function _preRemove() {
      this._object._removeIsBound(this._path);
      this._object._removeErrors(this._path);
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      // TODO only relevant for array item?
      if (this._options.unique) {
        return this._validateUnique();
      }
      return [];
    }
  }, {
    key: '_validateUnique',
    value: function _validateUnique() {
      if (this._isEmpty()) {
        return [];
      }
      var value = this.get();
      var parent = this.parent;
      var others = [];
      for (;;) {
        if (parent instanceof _ArrayManager.ArrayManager) {
          break;
        }
        parent = parent.parent;
      }
      var index = this._path[parent._path.length];
      for (var k in parent._memberKeys) {
        if (parseInt(k, 10) !== index) {
          var sibling = this._getSibling(parent, k);
          if (sibling.isBound) {
            others.push(sibling.get());
          }
        }
      }
      var duplicates = (function () {
        var _duplicates = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = others[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var o = _step.value;

            if (o === value) {
              _duplicates.push(o);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return _duplicates;
      })();
      if (duplicates.length) {
        return ['This is a duplicate value'];
      }
      return [];
    }
  }, {
    key: '_getSibling',
    value: function _getSibling(parent, i) {
      var index = parent._path.length;
      var path = [].concat(_toConsumableArray(this._path));
      path[index] = i;
      path = path.slice(index);
      var sibling = parent;
      path.forEach(function (p) {
        return sibling = sibling[p];
      });
      return sibling;
    }
  }]);

  return BaseItemManager;
})(_BaseManager3['default']);

exports.BaseItemManager = BaseItemManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BaseManager = (function () {
  function BaseManager(managedObject, parent, path, options) {
    var _this = this;

    _classCallCheck(this, BaseManager);

    this.remove = function () {
      if (!(_this.parent && _this.parent._remove)) {
        throw new Error('Item is not in a list');
      }
      _this.parent._remove(parseInt(_this.key, 10));
    };

    this.__isManager = true;
    this._object = managedObject;
    this.parent = parent;
    this._path = path;
    this._options = options;
  }

  // Public API

  _createClass(BaseManager, [{
    key: 'get',
    value: function get() {
      return this._object._get(this._path);
    }
  }, {
    key: 'set',
    value: function set(value) {
      //    console.log('setting', this._path, value);
      var validate = undefined;
      if (!this._isSetting) {
        this._isSetting = true;
        validate = true;
      }
      this._checkValue(value);
      this._setCheckedValue(value);
      //    console.log('validate?', validate);
      if (validate) {
        this._object._validate();
        this._isSetting = false;
        if (this._object._onChange) {
          //        console.log('emitting state change');
          this._object._onChange(this._object.toState());
        }
      }
    }

    // TODO need to be able to initialise values without settings isBound and without
    // triggering validation
    // init(value) {
    //   this._checkValue(value);
    //   this._setCheckedValue(value);
    //   if (this._object._onChange) {
    //     this._object._onChange(this._object.toState());
    //   }
    // }

  }, {
    key: 'pend',
    value: function pend() {
      this._object.pend();
      return this;
    }
  }, {
    key: 'getPending',
    value: function getPending() {
      return this._object._getPending(this._path);
    }
  }, {
    key: 'getPendingOrCurrent',
    value: function getPendingOrCurrent() {
      var pending = this.getPending();
      return pending !== undefined ? pending : this.get();
    }
  }, {
    key: 'addError',
    value: function addError(error) {
      var errors = this.errors;
      errors.push(error);
      this.errors = errors;
    }
  }, {
    key: 'canReorder',
    value: function canReorder() {
      return this.parent && this.parent.canReorderItems && // TODO this only needed as ManagedObject api not like Manager api, maybe should be?
      this.parent.canReorderItems();
    }
  }, {
    key: 'canRemove',
    value: function canRemove() {
      return this.parent && this.parent.canRemoveItems && this.parent.canRemoveItems();
    }
  }, {
    key: '_setCheckedValue',
    value: function _setCheckedValue(value) {
      throw new Error('Subclass must implement _setCheckedValue');
    }
  }, {
    key: '_validate',
    value: function _validate() {
      if (!this.isBound) {
        this.errors = null;
      } else {
        var errors = this._validateBoundValue();
        if (!errors.length && !this._options.isRequired && this._isEmpty()) {
          this.errors = null;
        } else {
          this.errors = errors;
        }
      }
      if (this._options.validate) {
        var errors = this._options.validate.apply(this);
        if (errors.length) {
          if (this.errors === null) {
            this.errors = errors;
          } else {
            this.errors = this.errors.concat(errors);
          }
        }
      }
    }
  }, {
    key: '_checkValue',
    value: function _checkValue() {
      throw new Error('Subclass must implement _checkValue method');
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      throw new Error('Subclass must implement _validateBoundValue method');
    }
  }, {
    key: 'key',
    get: function get() {
      return this._path[this._path.length - 1];
    }
  }, {
    key: 'isBound',
    get: function get() {
      return this._object._getIsBound(this._path);
    },
    set: function set(value) {
      this._object._setIsBound(this._path, value);
    }
  }, {
    key: 'errors',
    get: function get() {
      return this._object._getErrors(this._path);
    },
    set: function set(errors) {
      return this._object._setErrors(this._path, errors);
    }
  }, {
    key: '_isSetting',

    // Private methods
    set: function set(value) {
      this._object._isSetting = value;
    },
    get: function get() {
      return this._object._isSetting;
    }
  }]);

  return BaseManager;
})();

exports['default'] = BaseManager;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var BoolManager = (function (_BaseItemManager) {
  _inherits(BoolManager, _BaseItemManager);

  function BoolManager() {
    _classCallCheck(this, BoolManager);

    _get(Object.getPrototypeOf(BoolManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BoolManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      if (typeof value !== 'boolean') {
        throw new Error('Value must be a boolean: ' + this._path + ' ' + value);
      }
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var errors = [];
      if (this._options.isRequired && this._isEmpty()) {
        errors.push('This field is required');
      }
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return !this.get();
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value;
    }
  }]);

  return BoolManager;
})(_BaseItemManager2.BaseItemManager);

exports.BoolManager = BoolManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var ChoiceManager = (function (_BaseItemManager) {
  _inherits(ChoiceManager, _BaseItemManager);

  function ChoiceManager(managedObject, parent, path, choices, options) {
    _classCallCheck(this, ChoiceManager);

    _get(Object.getPrototypeOf(ChoiceManager.prototype), 'constructor', this).call(this, managedObject, parent, path, options);
    this._choices = choices;
  }

  _createClass(ChoiceManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      // TODO
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var errors = _get(Object.getPrototypeOf(ChoiceManager.prototype), '_validateBoundValue', this).call(this);
      var value = this.get();
      if (this._options.isRequired && this._valueIsEmpty(value)) {
        errors.push('This field is required');
      }
      if (!this._isEmpty() && this._choices.indexOf(value) === -1) {
        errors.push('Not a valid choice: ' + value);
      }
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value === '';
    }
  }]);

  return ChoiceManager;
})(_BaseItemManager2.BaseItemManager);

exports.ChoiceManager = ChoiceManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var IntegerManager = (function (_BaseItemManager) {
  _inherits(IntegerManager, _BaseItemManager);

  function IntegerManager() {
    _classCallCheck(this, IntegerManager);

    _get(Object.getPrototypeOf(IntegerManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(IntegerManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      // if (typeof value !== 'integer') {
      //   throw new Error(`Value must be a integer: ${value}`);
      // }
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var errors = _get(Object.getPrototypeOf(IntegerManager.prototype), '_validateBoundValue', this).call(this);
      var value = this.get();
      //console.log('value', value);
      if (this._options.isRequired && this._isEmpty()) {
        errors.push('This field is required');
      }
      if (!this._isEmpty()) {
        var parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
          errors.push('Please enter an integer');
        } else {
          if (this._options.max && value > this._options.max) {
            errors.push('Maximum allowed value is ' + this._options.max);
          }
        }
      }
      //console.log('errors', errors);
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value === null || value === undefined;
    }
  }]);

  return IntegerManager;
})(_BaseItemManager2.BaseItemManager);

exports.IntegerManager = IntegerManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var MultiChoiceManager = (function (_BaseItemManager) {
  _inherits(MultiChoiceManager, _BaseItemManager);

  function MultiChoiceManager(managedObject, parent, path, choices, options) {
    _classCallCheck(this, MultiChoiceManager);

    _get(Object.getPrototypeOf(MultiChoiceManager.prototype), 'constructor', this).call(this, managedObject, parent, path, options);
    this._choices = choices;
    // TODO init([])?
    managedObject._setPathToValue(this._path, []);
  }

  _createClass(MultiChoiceManager, [{
    key: 'add',
    value: function add(value) {
      var values = this.get() || [];
      values.push(value);
      this.set(values);
    }

    // TODO fix superclass remove method causing problem here
  }, {
    key: 'removeX',
    value: function removeX(value) {
      var values = this.get() || [];
      values.splice(values.indexOf(value), 1);
      this.set(values);
    }
  }, {
    key: '_checkValue',
    value: function _checkValue(value) {
      // TODO
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var _this = this;

      var errors = _get(Object.getPrototypeOf(MultiChoiceManager.prototype), '_validateBoundValue', this).call(this);
      var values = this.get();
      if (this._options.isRequired && this._valueIsEmpty(values)) {
        errors.push('This field is required');
      }
      values.forEach(function (value) {
        if (_this._choices.indexOf(value) === -1) {
          errors.push('Not a valid choice: ' + value);
        }
      });
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return !value || value.length === 0;
    }
  }]);

  return MultiChoiceManager;
})(_BaseItemManager2.BaseItemManager);

exports.MultiChoiceManager = MultiChoiceManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var NullManager = (function (_BaseItemManager) {
  _inherits(NullManager, _BaseItemManager);

  function NullManager() {
    _classCallCheck(this, NullManager);

    _get(Object.getPrototypeOf(NullManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(NullManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      if (typeof value === 'null') {
        throw new Error('Value must be null: ' + value);
      }
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      return [];
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value === null;
    }
  }]);

  return NullManager;
})(_BaseItemManager2.BaseItemManager);

exports.NullManager = NullManager;
// TODO _possibly_ this could be implemented out of CompositionManager
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var ScoreGroupManager = (function (_BaseItemManager) {
  _inherits(ScoreGroupManager, _BaseItemManager);

  function ScoreGroupManager(managedObject, parent, path, labels, noOfItems, options) {
    _classCallCheck(this, ScoreGroupManager);

    _get(Object.getPrototypeOf(ScoreGroupManager.prototype), 'constructor', this).call(this, managedObject, parent, path, options);
    this._labels = labels;
    this._noOfItems = noOfItems;
    // TODO init([])?
    var empty = [];
    managedObject._setPathToValue(this._path, empty);
  }

  _createClass(ScoreGroupManager, [{
    key: 'setChoice',
    value: function setChoice(i, value) {
      var values = this.get();
      values[i] = value;
      this.set(values);
    }
  }, {
    key: '_checkValue',
    value: function _checkValue(value) {
      // TODO
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var _this = this;

      var errors = _get(Object.getPrototypeOf(ScoreGroupManager.prototype), '_validateBoundValue', this).call(this);
      var values = this.get();
      if (this._options.isRequired && this._valueIsEmpty(values)) {
        errors.push('This field is required');
      }
      values.forEach(function (v) {
        if (_this._labels.indexOf(v) === -1) {
          errors.push('Not a valid choice: ' + v);
        }
      });
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value.every(function (v) {
        return v === '';
      });
    }
  }]);

  return ScoreGroupManager;
})(_BaseItemManager2.BaseItemManager);

exports.ScoreGroupManager = ScoreGroupManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseCollectionManager2 = require('./BaseCollectionManager');

var ShapeManager = (function (_BaseCollectionManager) {
  _inherits(ShapeManager, _BaseCollectionManager);

  function ShapeManager(managedObject, parent, path, MemberManagers) {
    _classCallCheck(this, ShapeManager);

    _get(Object.getPrototypeOf(ShapeManager.prototype), 'constructor', this).call(this, managedObject, parent, path);
    this._MemberManagers = MemberManagers;
    this._object._set(this._path, {});
    for (var k in MemberManagers) {
      if (MemberManagers.hasOwnProperty(k)) {
        if (this[k] !== undefined) {
          throw new Error('Cannot have property named \'' + k + '\'');
        }
        var _path = this._path.concat([k]);
        this[k] = new this._MemberManagers[k](this._object, this, _path, k);
      }
    }
  }

  _createClass(ShapeManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      try {
        // TODO can we do a decent object check here?
        if (typeof value !== 'object') {
          throw new Error();
        }
      } catch (e) {
        throw new Error('Value must be an object ' + value);
      }
    }
  }, {
    key: '_setCheckedValue',
    value: function _setCheckedValue(values) {
      this._object._set(this._path, {});
      for (var k in values) {
        if (values.hasOwnProperty(k)) {
          if (!this._MemberManagers.hasOwnProperty(k)) {
            //          debugger;
            throw new Error('Key \'' + k + '\' is not valid for object \'' + this._path + '\'');
          } else {
            this[k].set(values[k]);
          }
        }
      }
    }
  }, {
    key: '_memberKeys',
    get: function get() {
      var keys = [];
      for (var k in this) {
        if (this.hasOwnProperty(k) && k !== 'parent' && this[k] && this[k].__isManager === true) {
          keys.push(k);
        }
      }
      return keys;
    }
  }]);

  return ShapeManager;
})(_BaseCollectionManager2.BaseCollectionManager);

exports.ShapeManager = ShapeManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BaseItemManager2 = require('./BaseItemManager');

var StringManager = (function (_BaseItemManager) {
  _inherits(StringManager, _BaseItemManager);

  function StringManager() {
    _classCallCheck(this, StringManager);

    _get(Object.getPrototypeOf(StringManager.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(StringManager, [{
    key: '_checkValue',
    value: function _checkValue(value) {
      if (typeof value !== 'string') {
        throw new Error('Value must be a string: ' + value);
      }
    }
  }, {
    key: '_validateBoundValue',
    value: function _validateBoundValue() {
      var errors = _get(Object.getPrototypeOf(StringManager.prototype), '_validateBoundValue', this).call(this);
      var value = this.get();
      if (this._options.isRequired && this._isEmpty()) {
        errors.push('This field is required');
      }
      if (this._options.maxLength !== undefined && value.length > this._options.maxLength) {
        errors.push('String is too long');
      }
      return errors;
    }
  }, {
    key: '_isEmpty',
    value: function _isEmpty() {
      return this._valueIsEmpty(this.get());
    }
  }, {
    key: '_valueIsEmpty',
    value: function _valueIsEmpty(value) {
      return value === '' || value === undefined;
    }
  }]);

  return StringManager;
})(_BaseItemManager2.BaseItemManager);

exports.StringManager = StringManager;
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _ShapeManager = require('./ShapeManager');

_defaults(exports, _interopExportWildcard(_ShapeManager, _defaults));

var _ArrayManager = require('./ArrayManager');

_defaults(exports, _interopExportWildcard(_ArrayManager, _defaults));

var _StringManager = require('./StringManager');

_defaults(exports, _interopExportWildcard(_StringManager, _defaults));

var _BoolManager = require('./BoolManager');

_defaults(exports, _interopExportWildcard(_BoolManager, _defaults));

var _IntegerManager = require('./IntegerManager');

_defaults(exports, _interopExportWildcard(_IntegerManager, _defaults));

var _ChoiceManager = require('./ChoiceManager');

_defaults(exports, _interopExportWildcard(_ChoiceManager, _defaults));

var _MultiChoiceManager = require('./MultiChoiceManager');

_defaults(exports, _interopExportWildcard(_MultiChoiceManager, _defaults));

var _ScoreGroupManager = require('./ScoreGroupManager');

_defaults(exports, _interopExportWildcard(_ScoreGroupManager, _defaults));
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _StringManager = require('./StringManager');

_defaults(exports, _interopExportWildcard(_StringManager, _defaults));

var _IntegerManager = require('./IntegerManager');

_defaults(exports, _interopExportWildcard(_IntegerManager, _defaults));

var _BoolManager = require('./BoolManager');

_defaults(exports, _interopExportWildcard(_BoolManager, _defaults));
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.array = array;
exports.shape = shape;
exports.string = string;
exports.scoregroup = scoregroup;
exports.choice = choice;
exports.multichoice = multichoice;
exports.bool = bool;
exports.integer = integer;
exports.nullValue = nullValue;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _proxies = require('./proxies');

var managers = _interopRequireWildcard(_proxies);

function array(item) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function _array(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.ArrayManager(managedObject, parent, basePath, item, options);
    return parent[key];
  };
}

function shape(args) {
  return function _shape(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.ShapeManager(managedObject, parent, basePath, args);
    return parent[key];
  };
}

function string() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.StringManager(managedObject, parent, basePath, options);
    return parent[key];
  };
}

function scoregroup(labels, noOfItems) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.ScoreGroupManager(managedObject, parent, basePath, labels, noOfItems, options);
    return parent[key];
  };
}

function choice(choices) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.ChoiceManager(managedObject, parent, basePath, choices, options);
    return parent[key];
  };
}

function multichoice(choices) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.MultiChoiceManager(managedObject, parent, basePath, choices, options);
    return parent[key];
  };
}

function bool() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.BoolManager(managedObject, parent, basePath, options);
    return parent[key];
  };
}

function integer() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.isRequired === undefined) {
    options.isRequired = false;
  }
  return function _string(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.IntegerManager(managedObject, parent, basePath, options);
    return parent[key];
  };
}

function nullValue() {
  return function _null(managedObject, parent, basePath) {
    var key = basePath[basePath.length - 1];
    parent[key] = new managers.NullManager(managedObject, parent, basePath, options);
    return parent[key];
  };
}

var _ManagedObject = require('./ManagedObject');

_defaults(exports, _interopExportWildcard(_ManagedObject, _defaults));
