import { ConsoleExporterIcon } from "../src/exporterIcon";
import * as utilsModule from "../src/utils";

import * as types from "@opentelemetry/api";
import { TraceFlags } from "@opentelemetry/api";
import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import { Resource } from "@opentelemetry/resources";
import { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import * as assert from "assert";
import * as sinon from "sinon";

describe("Console Exporter", () => {
  describe("constructor", () => {
    it("should construct an exporter", async () => {
      const exporter = new ConsoleExporterIcon({
        isDetailed: true,
      });

      assert.ok(exporter);
      const detail = (await exporter["_isDetailed"]) as boolean;
      assert.strictEqual(detail, true);
    });

    it("should construct an exporter", async () => {
      const exporter = new ConsoleExporterIcon({
        isDetailed: false,
      });

      assert.ok(exporter);
      const detail = (await exporter["_isDetailed"]) as boolean;
      assert.strictEqual(detail, false);
    });

    it("should construct exporter without args", async () => {
      const exporter = new ConsoleExporterIcon({});

      assert.ok(exporter);
      const detail = (await exporter["_isDetailed"]) as boolean;
      assert.strictEqual(detail, false);
    });
  });

  describe(".export()", () => {
    let consoleDebug: sinon.SinonSpy;

    beforeEach(() => {
      consoleDebug = sinon.spy(console, "debug");
      sinon.replace(utilsModule, "randomRange", (min: number, max: number) =>
        Array.from(Array(1 + max - min).keys()).map((v) => min + v)
      );
    });
    afterEach(() => {
      consoleDebug.restore();
      sinon.restore();
    });

    it("should export short log of spans with custom labels", async () => {
      const exporter = new ConsoleExporterIcon({});

      const readableSpan1: ReadableSpan = {
        attributes: {
          label: "customLabel",
        },
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c93",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };
      const readableSpan2: ReadableSpan = {
        attributes: {
          label: "customLabel",
        },
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        parentSpanId: "6e0c63257de34c93",
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c92",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };

      const result1 = await new Promise<ExportResult>((resolve) => {
        exporter.export([readableSpan2, readableSpan1], (result) => {
          resolve(result);
        });
      });

      assert.strictEqual(result1.code, ExportResultCode.SUCCESS);
      assert.deepStrictEqual(
        [
          "🌱:🌰-🌯---------------------------------------------------->  32800ms - customLabel",
        ],
        consoleDebug.args[0]
      );
      assert.deepStrictEqual(
        [
          "🌱:🌰------------------------------------------------------->  32800ms - customLabel",
        ],
        consoleDebug.args[1]
      );
    });

    it("should export short log of spans with fallback span names", async () => {
      const exporter = new ConsoleExporterIcon({});

      const readableSpan1: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c93",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };
      const readableSpan2: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        parentSpanId: "6e0c63257de34c93",
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c92",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };

      const result1 = await new Promise<ExportResult>((resolve) => {
        exporter.export([readableSpan2, readableSpan1], (result) => {
          resolve(result);
        });
      });

      assert.strictEqual(result1.code, ExportResultCode.SUCCESS);
      assert.deepStrictEqual(
        [
          "🌱:🌰-🌯---------------------------------------------------->  32800ms - my-span",
        ],
        consoleDebug.args[0]
      );
      assert.deepStrictEqual(
        [
          "🌱:🌰------------------------------------------------------->  32800ms - my-span",
        ],
        consoleDebug.args[1]
      );
    });

    it("should export detailed log of spans", async () => {
      const exporter = new ConsoleExporterIcon({ isDetailed: true });

      const readableSpan1: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c93",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };
      const readableSpan2: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        parentSpanId: "6e0c63257de34c93",
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c92",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };
      const readableSpan3: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        parentSpanId: "6e0c63257de34c92",
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c94",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };

      const result1 = await new Promise<ExportResult>((resolve) => {
        exporter.export(
          [readableSpan3, readableSpan2, readableSpan1],
          (result) => {
            resolve(result);
          }
        );
      });

      assert.strictEqual(result1.code, ExportResultCode.SUCCESS);
      assert.deepStrictEqual(
        [
          "🌱:🌲-🌰-🌯------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[0]
      );
      assert.deepStrictEqual(
        [
          "🌱:🌲-🌰---------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[1]
      );
      assert.deepStrictEqual(
        [
          "🌱:🌲------------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[2]
      );
    });

    it("should export detailed log of a span without a parent", async () => {
      const exporter = new ConsoleExporterIcon({ isDetailed: true });

      const readableSpan1: ReadableSpan = {
        attributes: {},
        duration: [32, 800000000],
        startTime: [1566156729, 709],
        endTime: [1566156731, 709],
        ended: true,
        events: [],
        kind: types.SpanKind.CLIENT,
        links: [],
        name: "my-span",
        spanContext: () => ({
          traceId: "d4cda95b652f4a1592b449d5929fda1b",
          spanId: "6e0c63257de34c93",
          traceFlags: TraceFlags.NONE,
          isRemote: true,
        }),
        status: { code: types.SpanStatusCode.OK },
        resource: Resource.empty(),
        instrumentationLibrary: { name: "default", version: "0.0.1" },
      };

      const result1 = await new Promise<ExportResult>((resolve) => {
        exporter.export([readableSpan1], (result) => {
          resolve(result);
        });
      });

      assert.strictEqual(result1.code, ExportResultCode.SUCCESS);
      assert.deepStrictEqual(
        [
          "🌰:🌯------------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[0]
      );
    });

    it("should reuse icons", async () => {
      const exporter = new ConsoleExporterIcon({ isDetailed: true });

      const readableSpan1 = (): ReadableSpan => {
        const traceId = Math.random().toString();
        const spanId = Math.random().toString();
        return {
          attributes: {},
          duration: [32, 800000000],
          startTime: [1566156729, 709],
          endTime: [1566156731, 709],
          ended: true,
          events: [],
          kind: types.SpanKind.CLIENT,
          links: [],
          name: "my-span",
          spanContext: () => ({
            traceId,
            spanId,
            traceFlags: TraceFlags.NONE,
            isRemote: true,
          }),
          status: { code: types.SpanStatusCode.OK },
          resource: Resource.empty(),
          instrumentationLibrary: { name: "default", version: "0.0.1" },
        };
      };

      const arr: Array<ReadableSpan> = [];
      for (let i = 0; i < 105; i++) {
        arr.push(readableSpan1());
      }

      const result1 = await new Promise<ExportResult>((resolve) => {
        exporter.export(arr, (result) => {
          resolve(result);
        });
      });

      assert.strictEqual(result1.code, ExportResultCode.SUCCESS);
      assert.deepStrictEqual(
        [
          "🌰:🌯------------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[0]
      );
      assert.deepStrictEqual(
        [
          "🌰:🌯------------------------------------------------------->  32800ms - my-span",
          "\n",
          {},
        ],
        consoleDebug.args[101]
      );
    });
  });

  describe(".shutdown()", () => {
    it("should do nothing", async () => {
      const consoleDebug = sinon.spy(console, "debug");
      const exporter = new ConsoleExporterIcon({});
      await exporter.shutdown();
      assert(consoleDebug.notCalled);
      consoleDebug.restore();
    });
  });
});
