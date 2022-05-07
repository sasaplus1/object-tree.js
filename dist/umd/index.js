(function(global, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "exports"
        ], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.index = mod.exports;
    }
})(this, function(_exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    class ObjectNode {
        #tree;
        constructor({ tree , childNodes , parentNode , value  }){
            this.#tree = tree;
            this.childNodes = childNodes;
            this.id = Symbol();
            this.parentNode = parentNode;
            this.value = value;
        }
        after(...values) {
            this.#insertAdjacent(1, ...values);
        }
        append(...values) {
            const ons = values.map((value)=>this.#addToObjectTree(value)
            );
            this.childNodes.push(...ons);
        }
        before(...values) {
            this.#insertAdjacent(0, ...values);
        }
        contains(value) {
            if (value === this.value) {
                return true;
            }
            const { childNodes  } = this;
            for(let i = 0, len = childNodes.length; i < len; i += 1){
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
            return this.#tree.root;
        }
        get lastChild() {
            const { childNodes  } = this;
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
            const { parentNode  } = this;
            if (parentNode === null) {
                return;
            }
            const siblings = parentNode.childNodes;
            const referenceNode = this.#tree.find(referenceValue);
            const index = referenceNode !== null ? siblings.indexOf(referenceNode) : -1;
            const on = this.#addToObjectTree(newValue);
            siblings.splice(index === -1 ? 0 : index, 0, on);
        }
        get nextSibling() {
            return this.#getSibling(1);
        }
        get previousSibling() {
            return this.#getSibling(-1);
        }
        prepend(...values) {
            const ons = values.map((value)=>this.#addToObjectTree(value)
            );
            this.childNodes.unshift(...ons);
        }
        remove() {
            const { childNodes , parentNode  } = this;
            this.#tree._delete(this);
            for(let i = 0, len = childNodes.length; i < len; i += 1){
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
        // replaceChild
        // replaceChildren
        // replaceWith
         #addToObjectTree(value1) {
            const on = new ObjectNode({
                childNodes: [],
                parentNode: this,
                tree: this.#tree,
                value: value1
            });
            this.#tree._add(on);
            return on;
        }
         #getSibling(direction) {
            const { parentNode  } = this;
            if (parentNode === null) {
                return null;
            }
            const siblings = parentNode.childNodes;
            const index = siblings.indexOf(this);
            const sibling = siblings[index + direction];
            return sibling || null;
        }
         #insertAdjacent(direction1, ...values) {
            const { parentNode  } = this;
            if (parentNode === null) {
                return;
            }
            const siblings = parentNode.childNodes;
            const index = siblings.indexOf(this);
            if (index !== -1) {
                const ons = values.map((value)=>this.#addToObjectTree(value)
                );
                siblings.splice(index + direction1, 0, ...ons);
            }
        }
    }
    _exports.ObjectNode = ObjectNode;
    class ObjectTree {
        #references = new Map();
        #dereferences = new Map();
        root = new ObjectNode({
            tree: this,
            childNodes: [],
            parentNode: null,
            value: null
        });
        find(value) {
            const id = this.#dereferences.get(value);
            if (id === undefined) {
                return null;
            }
            const on = this.#references.get(id);
            return on !== undefined ? on : null;
        }
        has(value) {
            return this.#dereferences.has(value);
        }
        _add(node) {
            const { id , value  } = node;
            if (value === null) {
                return;
            }
            this.#references.set(id, node);
            this.#dereferences.set(value, id);
        }
        _delete(node) {
            const { value  } = node;
            if (value === null) {
                return false;
            }
            const id = this.#dereferences.get(value);
            if (id === undefined) {
                return false;
            }
            const on = this.#references.get(id);
            if (on === undefined) {
                return false;
            }
            this.#dereferences.delete(value);
            return this.#references.delete(on.id);
        }
    }
    _exports.ObjectTree = ObjectTree;
});

//# sourceMappingURL=index.js.map