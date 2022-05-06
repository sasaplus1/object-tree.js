"use strict";
/**
 * manage object by tree structure
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ObjectNode_instances, _ObjectNode_tree, _ObjectNode_addToObjectTree, _ObjectNode_getSibling, _ObjectTree_references, _ObjectTree_dereferences;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTree = exports.ObjectNode = void 0;
class ObjectNode {
    constructor({ tree, childNodes, parentNode, value }) {
        _ObjectNode_instances.add(this);
        _ObjectNode_tree.set(this, void 0);
        __classPrivateFieldSet(this, _ObjectNode_tree, tree, "f");
        this.childNodes = childNodes;
        this.id = Symbol();
        this.parentNode = parentNode;
        this.value = value;
    }
    after(...values) {
        const { parentNode } = this;
        if (parentNode === null) {
            return;
        }
        const siblings = parentNode.childNodes;
        const index = siblings.indexOf(this);
        if (index !== -1) {
            const ons = values.map((value) => __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_addToObjectTree).call(this, value));
            siblings.splice(index + 1, 0, ...ons);
        }
    }
    append(...values) {
        const ons = values.map((value) => __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_addToObjectTree).call(this, value));
        this.childNodes.push(...ons);
    }
    before(...values) {
        const { parentNode } = this;
        if (parentNode === null) {
            return;
        }
        const siblings = parentNode.childNodes;
        const index = siblings.indexOf(this);
        if (index !== -1) {
            const ons = values.map((value) => __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_addToObjectTree).call(this, value));
            siblings.splice(index, 0, ...ons);
        }
    }
    contains(value) {
        if (value === this.value) {
            return true;
        }
        const { childNodes } = this;
        for (let i = 0, len = childNodes.length; i < len; i += 1) {
            if (childNodes[i].contains(value)) {
                return true;
            }
        }
        return false;
    }
    get firstChild() {
        const child = this.childNodes[0];
        return child === undefined ? child : null;
    }
    getRootNode() {
        return __classPrivateFieldGet(this, _ObjectNode_tree, "f").root;
    }
    get lastChild() {
        const { childNodes } = this;
        const child = childNodes[childNodes.length - 1];
        return child === undefined ? child : null;
    }
    get parent() {
        return this.parentNode;
    }
    hasChildNodes() {
        return this.childNodes.length > 0;
    }
    insertBefore(newValue, referenceValue) {
        const { parentNode } = this;
        if (parentNode === null) {
            return;
        }
        const siblings = parentNode.childNodes;
        const referenceNode = __classPrivateFieldGet(this, _ObjectNode_tree, "f").find(referenceValue);
        const index = referenceNode !== null ? siblings.indexOf(referenceNode) : -1;
        const on = __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_addToObjectTree).call(this, newValue);
        siblings.splice(index === -1 ? 0 : index, 0, on);
    }
    get nextSibling() {
        return __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_getSibling).call(this, 1);
    }
    get previousSibling() {
        return __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_getSibling).call(this, -1);
    }
    prepend(...values) {
        const ons = values.map((value) => __classPrivateFieldGet(this, _ObjectNode_instances, "m", _ObjectNode_addToObjectTree).call(this, value));
        this.childNodes.unshift(...ons);
    }
    remove() {
        const { childNodes, parentNode } = this;
        __classPrivateFieldGet(this, _ObjectNode_tree, "f")._delete(this);
        for (let i = 0, len = childNodes.length; i < len; i += 1) {
            childNodes[i].remove();
        }
        if (parentNode !== null) {
            const index = parentNode.childNodes.indexOf(this);
            if (index !== -1) {
                parentNode.childNodes.splice(index, 1);
            }
        }
        this.childNodes = [];
        this.parentNode = null;
        this.value = null;
    }
}
exports.ObjectNode = ObjectNode;
_ObjectNode_tree = new WeakMap(), _ObjectNode_instances = new WeakSet(), _ObjectNode_addToObjectTree = function _ObjectNode_addToObjectTree(value) {
    const on = new ObjectNode({
        childNodes: [],
        parentNode: this,
        tree: __classPrivateFieldGet(this, _ObjectNode_tree, "f"),
        value
    });
    __classPrivateFieldGet(this, _ObjectNode_tree, "f")._add(on);
    return on;
}, _ObjectNode_getSibling = function _ObjectNode_getSibling(direction) {
    const { parentNode } = this;
    if (parentNode === null) {
        return null;
    }
    const siblings = parentNode.childNodes;
    const index = siblings.indexOf(this);
    const sibling = siblings[index + direction];
    return sibling || null;
};
class ObjectTree {
    constructor() {
        _ObjectTree_references.set(this, new Map());
        _ObjectTree_dereferences.set(this, new Map());
        this.root = new ObjectNode({
            tree: this,
            childNodes: [],
            parentNode: null,
            value: null
        });
    }
    find(value) {
        const id = __classPrivateFieldGet(this, _ObjectTree_dereferences, "f").get(value);
        if (id === undefined) {
            return null;
        }
        const on = __classPrivateFieldGet(this, _ObjectTree_references, "f").get(id);
        return on !== undefined ? on : null;
    }
    has(value) {
        return __classPrivateFieldGet(this, _ObjectTree_dereferences, "f").has(value);
    }
    _add(node) {
        const { id, value } = node;
        if (value === null) {
            return;
        }
        __classPrivateFieldGet(this, _ObjectTree_references, "f").set(id, node);
        __classPrivateFieldGet(this, _ObjectTree_dereferences, "f").set(value, id);
    }
    _delete(node) {
        const { value } = node;
        if (value === null) {
            return false;
        }
        const id = __classPrivateFieldGet(this, _ObjectTree_dereferences, "f").get(value);
        if (id === undefined) {
            return false;
        }
        const on = __classPrivateFieldGet(this, _ObjectTree_references, "f").get(id);
        if (on === undefined) {
            return false;
        }
        __classPrivateFieldGet(this, _ObjectTree_dereferences, "f").delete(value);
        return __classPrivateFieldGet(this, _ObjectTree_references, "f").delete(on.id);
    }
}
exports.ObjectTree = ObjectTree;
_ObjectTree_references = new WeakMap(), _ObjectTree_dereferences = new WeakMap();
//# sourceMappingURL=index.js.map