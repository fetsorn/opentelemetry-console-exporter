import { randomRange, shuffle, parseAttributes } from "../src/utils";

import { Attributes } from "@opentelemetry/api";
import * as assert from "assert";

describe("Utils", () => {
  describe("shuffle", () => {
    const range = [100, 101, 102, 103, 104, 105];

    it("should return different numbers each time", async () => {
      const range1 = shuffle(range);
      const range2 = shuffle(range);
      assert.notDeepEqual(range, range1);
      assert.notDeepEqual(range, range2);
      assert.notDeepEqual(range1, range2);
    });

    it("should return empty array as is", async () => {
      assert.deepStrictEqual([], shuffle([]));
    });
  });

  describe("randomRange", () => {
    const min = 100;
    const max = 105;

    it("should number of elements equal to range length", async () => {
      assert.strictEqual(randomRange(min, max).length, 1 + max - min);
    });
    it("should return numbers in range", async () => {
      for (const num of randomRange(min, max)) {
        assert(num >= min);
        assert(num <= max);
      }
    });
    it("should return different numbers each time", async () => {
      const range1 = randomRange(min, max);
      const range2 = randomRange(min, max);
      assert.notDeepEqual(range1, range2);
    });
    it("should return when min > max", async () => {
      assert.deepStrictEqual(randomRange(max, min), []);
    });
    it("should return when min == max", async () => {
      assert.deepStrictEqual(randomRange(max, max), [max]);
    });
  });

  describe("parseAttributes", () => {
    it("should parse stringified attribute values", async () => {
      const attributes: Attributes = {
        key: '{"key": "value"}',
      };
      assert.deepStrictEqual(parseAttributes(attributes), {
        key: { key: "value" },
      });
    });

    it("should fallback to value when fails to parse json", async () => {
      const attributes: Attributes = {
        key: '{"key: "value"}',
      };
      assert.deepStrictEqual(parseAttributes(attributes), {
        key: '{"key: "value"}',
      });
    });
  });
});
