(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('common', ['exports', 'rxjs', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.common = {}, global.rxjs, global.ng.core));
}(this, (function (exports, rxjs, i0) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var ActionHandler = /** @class */ (function () {
        function ActionHandler() {
        }
        ActionHandler.prototype.getStatus = function (data) {
            return '';
        };
        ActionHandler.prototype.checkAccess = function (action, acls, defaultAcls) {
            var requiredAcls = defaultAcls || [];
            if (action && action.acl) {
                requiredAcls = action.acl;
            }
            if (!requiredAcls || !requiredAcls.length) {
                return true;
            }
            var aclsMap = {};
            acls.forEach(function (value) { return aclsMap[value] = value; });
            return requiredAcls.every(function (value) { return aclsMap[value]; });
        };
        return ActionHandler;
    }());

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    exports.LineActionEvent = void 0;
    (function (LineActionEvent) {
        LineActionEvent["onLineItemAdd"] = "onLineItemAdd";
        LineActionEvent["onLineItemRemove"] = "onLineItemRemove";
    })(exports.LineActionEvent || (exports.LineActionEvent = {}));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var Button = /** @class */ (function () {
        function Button(klass, onClick, label, icon, labelKey, titleKey) {
            if (klass === void 0) { klass = null; }
            if (onClick === void 0) { onClick = null; }
            if (label === void 0) { label = null; }
            if (icon === void 0) { icon = null; }
            if (labelKey === void 0) { labelKey = null; }
            if (titleKey === void 0) { titleKey = null; }
            this.klass = klass;
            this.onClick = onClick;
            this.label = label;
            this.icon = icon;
            this.labelKey = labelKey;
            this.titleKey = titleKey;
        }
        Button.fromButton = function (button) {
            return new Button(button.klass, button.onClick, button.label, button.icon, button.labelKey, button.titleKey);
        };
        Button.appendClasses = function (button, newClasses) {
            if (!button.klass) {
                button.klass = newClasses;
                return;
            }
            if (typeof button.klass === 'string') {
                button.klass = newClasses.join(' ') + ' ' + button.klass;
                return;
            }
            if (button.klass instanceof Array || button.klass instanceof Set) {
                button.klass = __spreadArray(__spreadArray([], __read(button.klass)), __read(newClasses));
                return;
            }
            if (button.klass instanceof Object) {
                var classes = Object.assign({}, button.klass);
                classes[newClasses.join(' ')] = true;
                button.klass = classes;
            }
        };
        Button.prototype.addClasses = function (newClasses) {
            if (!this.klass) {
                this.klass = newClasses;
                return;
            }
            if (typeof this.klass === 'string') {
                this.klass = newClasses.join(' ') + ' ' + this.klass;
                return;
            }
            if (this.klass instanceof Array || this.klass instanceof Set) {
                this.klass = __spreadArray(__spreadArray([], __read(this.klass)), __read(newClasses));
                return;
            }
            if (this.klass instanceof Object) {
                var classes = Object.assign({}, this.klass);
                classes[newClasses.join(' ')] = true;
                this.klass = classes;
            }
        };
        return Button;
    }());

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var OverridableMap = /** @class */ (function () {
        function OverridableMap() {
            this.map = {
                default: {
                    values: {},
                    exclude: []
                }
            };
        }
        OverridableMap.prototype.init = function (entryMap) {
            var _this = this;
            Object.keys(entryMap).forEach(function (group) {
                if (entryMap[group].values) {
                    Object.keys(entryMap[group].values).forEach(function (key) {
                        _this.addEntry(group, key, entryMap[group].values[key]);
                    });
                }
                if (entryMap[group].exclude) {
                    entryMap[group].exclude.forEach(function (excluded) { return _this.excludeEntry(group, excluded); });
                }
            });
        };
        OverridableMap.prototype.addEntry = function (group, key, value) {
            if (!(group in this.map)) {
                this.map[group] = {
                    values: {},
                    exclude: []
                };
            }
            this.map[group].values[key] = value;
        };
        OverridableMap.prototype.excludeEntry = function (group, key) {
            if (!(group in this.map)) {
                this.map[group] = {
                    values: {},
                    exclude: []
                };
            }
            this.map[group].exclude.push(key);
        };
        OverridableMap.prototype.getGroupEntries = function (group) {
            var _this = this;
            var values = {};
            var allValues = Object.assign({}, this.map.default.values);
            var groupEntry = {
                values: {},
                exclude: []
            };
            if (group in this.map) {
                groupEntry = this.map[group];
                groupEntry.values = groupEntry.values || {};
                groupEntry.exclude = groupEntry.exclude || [];
            }
            Object.keys(groupEntry.values).forEach(function (key) {
                allValues[key] = groupEntry.values[key];
            });
            Object.keys(allValues).forEach(function (key) {
                if (_this.map.default.exclude.includes(key)) {
                    return;
                }
                if (groupEntry.exclude.includes(key)) {
                    return;
                }
                values[key] = allValues[key];
            });
            return values;
        };
        return OverridableMap;
    }());

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var BaseComponentRegistry = /** @class */ (function () {
        function BaseComponentRegistry() {
            this.init();
        }
        BaseComponentRegistry.getKey = function (type) {
            return type;
        };
        BaseComponentRegistry.prototype.register = function (module, type, component) {
            this.map.addEntry(module, BaseComponentRegistry.getKey(type), component);
        };
        BaseComponentRegistry.prototype.exclude = function (module, key) {
            this.map.excludeEntry(module, key);
        };
        BaseComponentRegistry.prototype.get = function (module, type) {
            var components = this.map.getGroupEntries(module);
            var key = BaseComponentRegistry.getKey(type);
            if (components[key]) {
                return components[key];
            }
            return null;
        };
        BaseComponentRegistry.prototype.has = function (module, type) {
            var components = this.map.getGroupEntries(module);
            var key = BaseComponentRegistry.getKey(type);
            return !!components[key];
        };
        BaseComponentRegistry.prototype.init = function () {
            this.map = new OverridableMap();
            this.initDefault();
        };
        BaseComponentRegistry.prototype.initDefault = function () {
        };
        return BaseComponentRegistry;
    }());

    /* eslint-enable camelcase */

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var BaseField = /** @class */ (function () {
        function BaseField() {
            this.fieldDependencies = [];
            this.attributeDependencies = [];
            this.valueSubject = new rxjs.BehaviorSubject({});
            this.valueChanges$ = this.valueSubject.asObservable();
        }
        Object.defineProperty(BaseField.prototype, "value", {
            get: function () {
                return this.valueState;
            },
            set: function (value) {
                var changed = value !== this.valueState;
                this.valueState = value;
                if (changed) {
                    this.emitValueChanges();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseField.prototype, "valueList", {
            get: function () {
                return this.valueListState;
            },
            set: function (value) {
                this.valueListState = value;
                this.emitValueChanges();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseField.prototype, "valueObject", {
            get: function () {
                return this.valueObjectState;
            },
            set: function (value) {
                this.valueObjectState = value;
                this.emitValueChanges();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseField.prototype, "valueObjectArray", {
            get: function () {
                return this.valueObjectArrayState;
            },
            set: function (value) {
                this.valueObjectArrayState = value;
                this.emitValueChanges();
            },
            enumerable: false,
            configurable: true
        });
        BaseField.prototype.emitValueChanges = function () {
            this.valueSubject.next({
                value: this.valueState,
                valueList: this.valueListState,
                valueObject: this.valueObjectState
            });
        };
        return BaseField;
    }());

    var RecordMapperRegistry = /** @class */ (function () {
        function RecordMapperRegistry() {
            this.init();
        }
        RecordMapperRegistry.prototype.register = function (module, key, mapper) {
            this.map.addEntry(module, key, mapper);
        };
        RecordMapperRegistry.prototype.exclude = function (module, key) {
            this.map.excludeEntry(module, key);
        };
        RecordMapperRegistry.prototype.get = function (module) {
            return this.map.getGroupEntries(module);
        };
        RecordMapperRegistry.prototype.has = function (module, key) {
            var moduleFields = this.map.getGroupEntries(module);
            return !!moduleFields[key];
        };
        RecordMapperRegistry.prototype.init = function () {
            this.map = new OverridableMap();
        };
        return RecordMapperRegistry;
    }());
    RecordMapperRegistry.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function RecordMapperRegistry_Factory() { return new RecordMapperRegistry(); }, token: RecordMapperRegistry, providedIn: "root" });
    RecordMapperRegistry.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    RecordMapperRegistry.ctorParameters = function () { return []; };

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    exports.MessageTypes = void 0;
    (function (MessageTypes) {
        MessageTypes["primary"] = "alert alert-primary";
        MessageTypes["secondary"] = "alert alert-secondary";
        MessageTypes["success"] = "alert alert-success";
        MessageTypes["danger"] = "alert alert-danger";
        MessageTypes["warning"] = "alert alert-warning";
        MessageTypes["info"] = "alert alert-info";
        MessageTypes["light"] = "alert alert-light";
        MessageTypes["dark"] = "alert alert-dark";
    })(exports.MessageTypes || (exports.MessageTypes = {}));

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var User = /** @class */ (function () {
        function User() {
        }
        return User;
    }());

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    /**
     * Deep clones an object
     *
     * @param {object} obj to clone
     * @returns {string} any
     */
    var deepClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
    /**
     * Check if all entries have been loaded and are ready to use
     *
     * @param entries
     * @returns boolean
     */
    var ready = function (entries) {
        var areReady = true;
        entries.every(function (entry) {
            if (!entry) {
                areReady = false;
                return false;
            }
            if (Array.isArray(entry) && entry.length <= 0) {
                areReady = false;
                return false;
            }
            if (typeof entry === 'object' && Object.keys(entry).length <= 0) {
                areReady = false;
                return false;
            }
            return true;
        });
        return areReady;
    };
    /**
     * Pad all values of an object
     * Singular digit numbers will be padded/prefixed with a 0
     * e.g. numbers 1-9 will be padded with a 0 in front to 01-09
     *
     * @param {object} obj to pad
     * @returns {object} any
     */
    var padObjectValues = function (obj) {
        Object.keys(obj).forEach(function (key) {
            obj[key] = String(obj[key]).padStart(2, '0');
        });
        return obj;
    };
    /**
     * @param {object} obj to be checked
     * @returns {boolean} true/false
     * @description Returns true, if the object is empty
     */
    var emptyObject = function (obj) { return (obj && (Object.keys(obj).length === 0)); };

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    /**
     * Check if value is false
     *
     * @param {any} value to check
     * @returns {boolean} isFalse
     */
    var isFalse = function (value) { return (value === false || value === 'false'); };
    /**
     * Check if value is true
     *
     * @param {any} value to check
     * @returns {boolean} isFalse
     */
    var isTrue = function (value) { return (value === true || value === 'true'); };
    /**
     * Check if value is null or undefined
     *
     * @param {any} value to check
     * @returns {boolean} isVoid
     */
    var isVoid = function (value) { return (value === null || typeof value === 'undefined'); };
    /**
     * Check if value is an empty string
     *
     * @param {any} value to check
     * @returns {boolean} isEmptyString
     */
    var isEmptyString = function (value) { return (typeof value === 'string' && !value.trim()); };

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    var ALL_VIEW_MODES = ['detail', 'edit', 'list', 'create', 'massupdate', 'filter'];
    var EDITABLE_VIEW_MODES = ['edit', 'create', 'massupdate', 'filter'];

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    /**
     * Check if value is editable
     *
     * @param {string} value to check
     * @returns {boolean} isEditable
     */
    var isEditable = function (value) { return EDITABLE_VIEW_MODES.includes(value); };

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    exports.SortDirection = void 0;
    (function (SortDirection) {
        SortDirection["NONE"] = "NONE";
        SortDirection["ASC"] = "ASC";
        SortDirection["DESC"] = "DESC";
    })(exports.SortDirection || (exports.SortDirection = {}));
    exports.PageSelection = void 0;
    (function (PageSelection) {
        PageSelection["FIRST"] = "FIRST";
        PageSelection["PREVIOUS"] = "PREVIOUS";
        PageSelection["NEXT"] = "NEXT";
        PageSelection["LAST"] = "LAST";
    })(exports.PageSelection || (exports.PageSelection = {}));

    /**
     * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
     * Copyright (C) 2021 SalesAgility Ltd.
     *
     * This program is free software; you can redistribute it and/or modify it under
     * the terms of the GNU Affero General Public License version 3 as published by the
     * Free Software Foundation with the addition of the following permission added
     * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
     * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
     * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
     *
     * This program is distributed in the hope that it will be useful, but WITHOUT
     * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
     * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
     * details.
     *
     * You should have received a copy of the GNU Affero General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * In accordance with Section 7(b) of the GNU Affero General Public License
     * version 3, these Appropriate Legal Notices must retain the display of the
     * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
     * feasible for technical reasons, the Appropriate Legal Notices must display
     * the words "Supercharged by SuiteCRM".
     */
    exports.SelectionStatus = void 0;
    (function (SelectionStatus) {
        SelectionStatus["ALL"] = "ALL";
        SelectionStatus["SOME"] = "SOME";
        SelectionStatus["PAGE"] = "PAGE";
        SelectionStatus["NONE"] = "NONE";
    })(exports.SelectionStatus || (exports.SelectionStatus = {}));

    /*
     * Public API Surface of common
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ALL_VIEW_MODES = ALL_VIEW_MODES;
    exports.ActionHandler = ActionHandler;
    exports.BaseComponentRegistry = BaseComponentRegistry;
    exports.BaseField = BaseField;
    exports.Button = Button;
    exports.EDITABLE_VIEW_MODES = EDITABLE_VIEW_MODES;
    exports.OverridableMap = OverridableMap;
    exports.RecordMapperRegistry = RecordMapperRegistry;
    exports.User = User;
    exports.deepClone = deepClone;
    exports.emptyObject = emptyObject;
    exports.isEditable = isEditable;
    exports.isEmptyString = isEmptyString;
    exports.isFalse = isFalse;
    exports.isTrue = isTrue;
    exports.isVoid = isVoid;
    exports.padObjectValues = padObjectValues;
    exports.ready = ready;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=common.umd.js.map
