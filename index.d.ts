/**
 * manage object by tree structure
 */
declare type Id = Symbol;
export declare class ObjectNode<T extends Object> {
    #private;
    childNodes: ObjectNode<T>[];
    id: Id;
    parentNode: ObjectNode<T> | null;
    value: T | null;
    constructor({ tree, childNodes, parentNode, value }: {
        tree: ObjectTree<T>;
    } & Pick<ObjectNode<T>, 'childNodes' | 'parentNode' | 'value'>);
    after(...values: NonNullable<T>[]): void;
    append(...values: NonNullable<T>[]): void;
    before(...values: NonNullable<T>[]): void;
    contains(value: NonNullable<T>): boolean;
    get firstChild(): ObjectNode<T> | null;
    getRootNode(): ObjectNode<T>;
    get lastChild(): ObjectNode<T> | null;
    get parent(): ObjectNode<T> | null;
    hasChildNodes(): boolean;
    insertBefore(newValue: NonNullable<T>, referenceValue: NonNullable<T>): void;
    get nextSibling(): ObjectNode<T> | null;
    get previousSibling(): ObjectNode<T> | null;
    prepend(...values: NonNullable<T>[]): void;
    remove(): void;
}
export declare class ObjectTree<T extends Object> {
    #private;
    root: ObjectNode<T>;
    find(value: NonNullable<T>): ObjectNode<T> | null;
    has(value: NonNullable<T>): boolean;
    _add(node: ObjectNode<T>): void;
    _delete(node: ObjectNode<T>): boolean;
}
export {};
