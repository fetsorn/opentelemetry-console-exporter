import { Span1, Span2, SpanDetails } from "./types";
import { parseAttributes } from "./utils";

import { SpanExporter, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import {
  ExportResult,
  ExportResultCode,
  hrTimeToMilliseconds,
} from "@opentelemetry/core";

/* eslint-disable no-console */
export class ConsoleExporterObject implements SpanExporter {
  private _min = 97;
  private _max = 122;

  private _objectMap: Record<string, Span1> = {};

  /**
   * Export spans.
   * @param spans
   * @param resultCallback
   */
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ): void {
    return this._sendSpans(spans, resultCallback);
  }

  /**
   * Shutdown the exporter.
   */
  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  private _formatLetters(index: number): string {
    let label = "";
    let num = index;
    if (num == 0) {
      label = String.fromCodePoint(this._min);
    } else {
      let range = 1 + this._max - this._min;
      while (num > 0) {
        let digit = (num % range);
        label = String.fromCodePoint(this._min + digit) + label;
        num = Math.floor(num / range);
      };
    }
    return label.padEnd(3)
  }

  private _formatDuration(span: ReadableSpan): string {
    const duration = hrTimeToMilliseconds(span.duration).toString() + "ms";
    const durationPadded = duration.padStart(8);
    return durationPadded;
  }

  private _groupSpans(spans: ReadableSpan[]): Span1[] {
    let rootSpans: Span1[] = [];
    for (const span of spans) {
      const spanId = span.spanContext().spanId;
      const obj: Span1 = this._objectMap[spanId] ?? {};
      const parentId = span.parentSpanId;
      const duration = this._formatDuration(span);
      const args = parseAttributes(span.attributes);
      if (parentId) {
        const parentSpan = this._objectMap[parentId] ?? {};
        const index = parentSpan.children?.length ?? 0;
        const letter = this._formatLetters(index);
        const label = `${letter} ${duration} - ${span.name}`;
        obj.name = label;
        obj.args = args;
        const parentChildren = parentSpan.children ?? [];
        parentChildren.push(obj);
        parentSpan.children = parentChildren;
        this._objectMap[parentId] = parentSpan;
      } else {
        const index = rootSpans.length;
        const letter = this._formatLetters(index);
        const label = `${letter} ${duration} - ${span.name}`;
        obj.name = label;
        obj.args = args;
        rootSpans.push(obj);
      }
    }
    return rootSpans
  }

  private _1to2(span: Span1): Span2 {
    let details: SpanDetails = { args: span.args };
    if (span.children) {
      details.children = span.children.map((s) => this._1to2(s))
    }
    let obj: Span2 = {};
    obj[span.name] = details;
    return obj
  }

  private _sendSpans(
    spans: ReadableSpan[],
    done: (result: ExportResult) => void
  ): void {
    let spans1 = this._groupSpans(spans);
    let spans2 = spans1.map((s) => this._1to2(s));
    for (const span of spans2) {
      console.debug(span)
    }
    return done({ code: ExportResultCode.SUCCESS });
  }
}
