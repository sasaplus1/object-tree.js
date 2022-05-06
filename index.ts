/**
 * manage object by tree structure
 */

type Id = Symbol;

export class ObjectNode<T extends Object> {
  #tree: ObjectTree<T>;
  childNodes: ObjectNode<T>[];
  id: Id;
  parentNode: ObjectNode<T> | null;
  value: T | null;

  constructor({
    tree,
    childNodes,
    parentNode,
    value
  }: { tree: ObjectTree<T> } & Pick<
    ObjectNode<T>,
    'childNodes' | 'parentNode' | 'value'
  >) {
    this.#tree = tree;
    this.childNodes = childNodes;
    this.id = Symbol();
    this.parentNode = parentNode;
    this.value = value;
  }

  after(...values: NonNullable<T>[]): void {
    const { parentNode } = this;

    if (parentNode === null) {
      return;
    }

    const siblings = parentNode.childNodes;
    const index = siblings.indexOf(this);

    if (index !== -1) {
      const ons = values.map((value) => this.#addToObjectTree(value));

      siblings.splice(index + 1, 0, ...ons);
    }
  }

  append(...values: NonNullable<T>[]): void {
    const ons = values.map((value) => this.#addToObjectTree(value));

    this.childNodes.push(...ons);
  }

  before(...values: NonNullable<T>[]): void {
    const { parentNode } = this;

    if (parentNode === null) {
      return;
    }

    const siblings = parentNode.childNodes;
    const index = siblings.indexOf(this);

    if (index !== -1) {
      const ons = values.map((value) => this.#addToObjectTree(value));

      siblings.splice(index, 0, ...ons);
    }
  }

  contains(value: NonNullable<T>): boolean {
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

  get firstChild(): ObjectNode<T> | null {
    const child = this.childNodes[0];

    return child === undefined ? child : null;
  }

  getRootNode(): ObjectNode<T> {
    return this.#tree.root;
  }

  get lastChild(): ObjectNode<T> | null {
    const { childNodes } = this;
    const child = childNodes[childNodes.length - 1];

    return child === undefined ? child : null;
  }

  get parent(): ObjectNode<T> | null {
    return this.parentNode;
  }

  hasChildNodes(): boolean {
    return this.childNodes.length > 0;
  }

  insertBefore(newValue: NonNullable<T>, referenceValue: NonNullable<T>): void {
    const { parentNode } = this;

    if (parentNode === null) {
      return;
    }

    const siblings = parentNode.childNodes;

    const referenceNode = this.#tree.find(referenceValue);
    const index = referenceNode !== null ? siblings.indexOf(referenceNode) : -1;

    const on = this.#addToObjectTree(newValue);

    siblings.splice(index === -1 ? 0 : index, 0, on);
  }

  get nextSibling(): ObjectNode<T> | null {
    return this.#getSibling(1);
  }

  get previousSibling(): ObjectNode<T> | null {
    return this.#getSibling(-1);
  }

  prepend(...values: NonNullable<T>[]): void {
    const ons = values.map((value) => this.#addToObjectTree(value));

    this.childNodes.unshift(...ons);
  }

  remove(): void {
    const { childNodes, parentNode } = this;

    this.#tree._delete(this);

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

  // replaceChild
  // replaceChildren
  // replaceWith

  #addToObjectTree(value: NonNullable<T>): ObjectNode<T> {
    const on = new ObjectNode({
      childNodes: [],
      parentNode: this,
      tree: this.#tree,
      value
    });

    this.#tree._add(on);

    return on;
  }

  #getSibling(direction: -1 | 1): ObjectNode<T> | null {
    const { parentNode } = this;

    if (parentNode === null) {
      return null;
    }

    const siblings = parentNode.childNodes;

    const index = siblings.indexOf(this);
    const sibling = siblings[index + direction];

    return sibling || null;
  }
}

export class ObjectTree<T extends Object> {
  #references = new Map<Id, ObjectNode<T>>();
  #dereferences = new Map<T, Id>();

  root = new ObjectNode<T>({
    tree: this,
    childNodes: [],
    parentNode: null,
    value: null
  });

  find(value: NonNullable<T>): ObjectNode<T> | null {
    const id = this.#dereferences.get(value);

    if (id === undefined) {
      return null;
    }

    const on = this.#references.get(id);

    return on !== undefined ? on : null;
  }

  has(value: NonNullable<T>): boolean {
    return this.#dereferences.has(value);
  }

  _add(node: ObjectNode<T>): void {
    const { id, value } = node;

    if (value === null) {
      return;
    }

    this.#references.set(id, node);
    this.#dereferences.set(value, id);
  }

  _delete(node: ObjectNode<T>): boolean {
    const { value } = node;

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
