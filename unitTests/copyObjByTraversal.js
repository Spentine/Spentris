import { assertEquals } from "jsr:@std/assert";

// testing copyObjByTraversal function
import { copyObjByTraversal } from "../engine/util.js";

Deno.test("single-depth key copy 1", () => {
  const source = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  };
  
  const copy = {
    b: 1,
    d: 1,
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: 0,
    b: 1,
    c: 0,
    d: 1,
  });
});

Deno.test("single-depth key copy 2", () => {
  const source = {
    a: false,
    b: 0,
    c: 0,
    d: 0,
  };
  
  const copy = {
    a: true,
    c: false,
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: true,
    b: 0,
    c: false,
    d: 0,
  });
});

Deno.test("single-depth key copy 3", () => {
  const source = {
    a: "yes",
  };
  
  const copy = {
    a: "no",
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: "no",
  });
});

Deno.test("single-depth key copy with disallowed 1", () => {
  const source = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  };
  
  const copy = {
    b: 1,
    c: 1,
    d: 1,
  };
  
  const disallowed = {
    d: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 0,
    b: 1,
    c: 1,
    d: 0,
  });
});

Deno.test("single-depth key copy with disallowed 2", () => {
  const source = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  
  const copy = {
    a: true,
    c: true,
    d: true,
  };
  
  const disallowed = {
    a: true,
    b: true,
    d: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 1,
    b: 2,
    c: true,
    d: 4,
  });
});

Deno.test("single-depth key copy with disallowed 3", () => {
  const source = {
    a: "a",
    b: "b",
    c: "c",
    d: "d",
  };
  
  const copy = {
    a: "A",
    b: "B",
  };
  
  const disallowed = {
    a: true,
    b: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: "a",
    b: "b",
    c: "c",
    d: "d",
  });
});

Deno.test("single-depth key copy with addition 1", () => {
  const source = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  
  const copy = {
    a: 10,
    e: 11,
    abc: 12,
    "123": 13,
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: 10,
    b: 2,
    c: 3,
    d: 4,
    e: 11,
    abc: 12,
    "123": 13,
  });
});

Deno.test("single-depth key copy with addition 2", () => {
  const source = {
    
  };
  
  const copy = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  });
});

Deno.test("single-depth key copy with addition 3", () => {
  const source = {
    a: 1,
  };
  
  const copy = {
    b: 1,
  };
  
  const result = copyObjByTraversal(source, copy);
  
  assertEquals(result, {
    a: 1,
    b: 1,
  });
});

Deno.test("single-depth key copy with disallowed and addition 1", () => {
  const source = {
    a: 0,
  };
  
  const copy = {
    b: 1,
  };
  
  const disallowed = {
    b: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 0,
  });
});

Deno.test("single-depth key copy with disallowed and addition 2", () => {
  const source = {
    a: 0,
  };
  
  const copy = {
    b: 1,
  };
  
  const disallowed = {
    a: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 0,
    b: 1,
  });
});

Deno.test("single-depth key copy with disallowed and addition 3", () => {
  const source = {
    
  };
  
  const copy = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  };
  
  const disallowed = {
    a: true,
    c: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    b: 1,
    d: 3,
  });
});

Deno.test("single-depth disallowed addition array copy 1", () => {
  const source = {
    a: [1, 2, 3],
    b: [4, 5, 6],
    c: [7, 8, 9],
    d: [10, 11, 12],
  };
  
  const copy = {
    a: 0,
    b: 1,
    c: [0, 1, 2],
    d: [3, 4, 5],
  };
  
  const disallowed = {
    a: true,
    c: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: [1, 2, 3],
    b: 1,
    c: [7, 8, 9],
    d: [3, 4, 5],
  });
});

Deno.test("single-depth disallowed addition array copy 2", () => {
  const source = {
    a: [1, 2, 3],
    b: [4, 5, 6],
    c: [7, 8, 9],
    d: [10, 11, 12],
  };
  
  const copy = {
    e: [13, 14, 15],
    f: [16, 17, 18],
  };
  
  const disallowed = {
    e: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: [1, 2, 3],
    b: [4, 5, 6],
    c: [7, 8, 9],
    d: [10, 11, 12],
    f: [16, 17, 18],
  });
});

Deno.test("single-depth disallowed addition array copy 3", () => {
  const source = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  
  const copy = {
    a: [13, 14, 15],
    e: [16, 17, 18],
  };
  
  const disallowed = {
    a: true,
    b: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: [16, 17, 18],
  });
});

Deno.test("general copy 1", () => {
  const source = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4, 5],
    },
    e: [6, 7, 8],
  };
  
  const copy = {
    a: 10,
    b: {
      c: 20,
      d: [30, 40, 50],
      f: [60, 70, 80],
      g: {
        h: 90,
      },
    },
    e: [60, 70, 80],
    i: {
      j: 100,
      k: [110, 120, 130],
    },
    l: {
      m: 140,
    },
  };
  
  const disallowed = {
    a: true,
    b: {
      c: true,
      f: true,
      g: {
        h: true,
      },
    },
    i: {
      j: true,
      m: true,
    },
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    a: 1,
    b: {
      c: 2,
      d: [30, 40, 50],
      g: {},
    },
    e: [60, 70, 80],
    i: {
      k: [110, 120, 130],
    },
    l: {
      m: 140,
    },
  });
});

Deno.test("general copy 2", () => {
  const source = {
    1: 0,
    2: {
      3: {
        4: {
          5: 0,
        },
        6: {
        },
      },
    },
    7: {
      8: {
      },
    },
  };
  
  const copy = {
    2: {
      3: {
        6: {
        },
        10: {
        },
        11: {
          12: {
            13: 2,
          },
        },
      },
    },
    7: {
      8: {
      },
    },
    14: {
      15: {
        16: {
          17: {
          },
        },
      },
    },
  };
  
  const disallowed = {
    2: {
      3: {
        6: true,
        11: {
          12: true,
        },
      },
    },
    7: {
      8: {
        9: true,
      },
    },
    14: {
      15: {
        16: {
          17: true,
        },
      },
    },
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    1: 0,
    2: {
      3: {
        4: {
          5: 0,
        },
        6: {
        },
        10: {
        },
        11: {
        },
      },
    },
    7: {
      8: {
      },
    },
    14: {
      15: {
        16: {
        },
      },
    },
  });
});

Deno.test("general copy 3", () => {
  const source = {
    
  };
  
  const copy = {
    x: {
      y: 0,
      z: 0,
    },
    a: {
      b: 0,
      c: 0,
    },
  };
  
  const disallowed = {
    a: true,
  };
  
  const result = copyObjByTraversal(source, copy, disallowed);
  
  assertEquals(result, {
    x: {
      y: 0,
      z: 0,
    },
  });
});