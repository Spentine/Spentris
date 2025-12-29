import { assertEquals } from "jsr:@std/assert";

import { JSONSerialization } from "../util/jsonSerialization.js";

Deno.test("stable stringify primitive 1", () => {
  const source = null;
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, "null");
});

Deno.test("stable stringify primitive 2", () => {
  const source = true;
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, "true");
});

Deno.test("stable stringify primitive 3", () => {
  const source = "hello world";
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, "\"hello world\"");
});

Deno.test("stable stringify single-depth 1", () => {
  const source = {
    b: 1,
    a: 2,
    d: 3,
    c: 4,
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    a: 2,
    b: 1,
    c: 4,
    d: 3,
  }));
});

Deno.test("stable stringify single-depth 2", () => {
  const source = {
    xyz: "test",
    foo: "bar",
    abc: 123,
    def: true,
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    abc: 123,
    def: true,
    foo: "bar",
    xyz: "test",
  }));
});

Deno.test("stable stringify single-depth 3", () => {
  const source = {
    "Apple": "case",
    "!exclaim": "symbols",
    "123": "numbers",
    "banana": "fruit",
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  /*
    JSON.stringify puts the fucking numbers first
  */
  assertEquals(result, `{"!exclaim":"symbols","123":"numbers","Apple":"case","banana":"fruit"}`);
});

Deno.test("stable stringify multi-depth 1", () => {
  const source = {
    a: {
      c: 3,
      b: 2,
    },
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    a: {
      b: 2,
      c: 3,
    },
  }));
});

Deno.test("stable stringify multi-depth 2", () => {
  const source = {
    c: {
      f: null,
      e: "\\"
    },
    a: {
      d: "\"",
      b: true
    },
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    a: {
      b: true,
      d: "\""
    },
    c: {
      e: "\\",
      f: null
    },
  }));
});

Deno.test("stable stringify multi-depth 3", () => {
  const source = {
    b: {
      i: {},
      d: {
        f: {},
        e: null
      },
      c: {
        h: 123,
        g: false
      },
    },
    a: {}
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    a: {},
    b: {
      c: {
        g: false,
        h: 123
      },
      d: {
        e: null,
        f: {}
      },
      i: {}
    }
  }));
});

Deno.test("stable stringify array 1", () => {
  const source = [
    { b: 2, a: 1 },
    { d: 4, c: 3 }
  ];
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify([
    { a: 1, b: 2 },
    { c: 3, d: 4 }
  ]));
});

Deno.test("stable stringify array 2", () => {
  const source = [
    [{ b: 2, a: 1 }, { d: 4, c: 3 }],
    [{ f: 6, e: 5 }, { h: 8, g: 7 }]
  ];
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify([
    [{ a: 1, b: 2 }, { c: 3, d: 4 }],
    [{ e: 5, f: 6 }, { g: 7, h: 8 }]
  ]));
});

Deno.test("stable stringify array 3", () => {
  const source = {
    c: [1, 2, 3],
    b: [{ d: 4, c: 3 }, { b: 2, a: 1 }],
    d: [[
      { h: 8, g: 7 },
      { f: 6, e: [[]]}
    ]]
  };
  
  const result = JSONSerialization.stableStringify(source);
  
  assertEquals(result, JSON.stringify({
    b: [{ c: 3, d: 4 }, { a: 1, b: 2 }],
    c: [1, 2, 3],
    d: [[{ g: 7, h: 8 }, { e: [[]], f: 6 }]]
  }));
});