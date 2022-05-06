import assert = require('assert');

import { ObjectTree, ObjectNode } from '.';

type Value = { id: number };

describe('ObjectNode', function () {
  describe('after', function () {});
  describe('append', function () {});
  describe('before', function () {});
  describe('contains', function () {});
  describe('firstChild', function () {});
  describe('getRootNode', function () {});
  describe('lastChild', function () {});
  describe('parent', function () {});
  describe('hasChildNodes', function () {});
  describe('insertBefore', function () {});
  describe('nextSibling', function () {});
  describe('previousSibling', function () {});
  describe('prepend', function () {});
  describe('remove', function () {});
});

describe('ObjectTree', function () {
  describe('find', function () {
    it('should return value if find value', function () {
      const ot = new ObjectTree<Value>();
      const v: Value = { id: 1 };

      ot.root.append(v);

      const on = ot.find(v);

      assert(on !== null);
      assert(on.value === v);
    });
    it('should return null if cannot find value', function () {
      const ot = new ObjectTree<Value>();
      const v: Value = { id: 1 };

      const on = ot.find(v);

      assert(on === null);
    });
  });
  describe('has', function () {
    it('should return true if has value', function () {
      const ot = new ObjectTree<Value>();
      const v: Value = { id: 1 };

      ot.root.append(v);

      assert(ot.has(v));
    });
    it('should return false if has not value', function () {
      const ot = new ObjectTree<Value>();
      const v: Value = { id: 1 };

      assert(!ot.has(v));
    });
  });
});
