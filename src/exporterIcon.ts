import { randomRange, parseAttributes } from "./utils";
import { ConsoleExporterOptions } from "./types";

import { SpanExporter, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import {
  ExportResult,
  ExportResultCode,
  hrTimeToMilliseconds,
} from "@opentelemetry/core";

/* eslint-disable no-console */
export class ConsoleExporterIcon implements SpanExporter {
  private _min = 127791;
  private _max = 127891;

  private _isDetailed: boolean;
  private _numbers: Array<number>;
  private _spanCounter = 0;
  private _indexMap: Record<string, number> = {};
  private _parentMap: Record<string, string> = {};

  constructor(config: ConsoleExporterOptions) {
    this._isDetailed = config.isDetailed ?? false;
    this._numbers = randomRange(this._min, this._max);
  }

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

  // assign icons
  private _indexSpan(id: string): void {
    if (!this._indexMap[id]) {
      this._indexMap[id] = this._spanCounter;
      // if all icons have been used, shuffle and reuse
      if (this._spanCounter == this._max - this._min) {
        this._numbers = randomRange(this._min, this._max);
        this._spanCounter = 0;
      } else {
        this._spanCounter = this._spanCounter + 1;
      }
    }
  }

  // assign icons and record child-parent relations
  private _cacheSpan(span: ReadableSpan): void {
    const spanId = span.spanContext().spanId;
    this._indexSpan(spanId);
    const parentId = span.parentSpanId;
    if (parentId) {
      this._indexSpan(parentId);
      this._parentMap[spanId] = parentId;
    }
    this._indexSpan(span.spanContext().traceId);
  }

  private _formatIcons(span: ReadableSpan): string {
    const spanIcon = String.fromCodePoint(
      this._numbers[this._indexMap[span.spanContext().spanId]]
    );
    let path = spanIcon;
    let parentId = span.parentSpanId;
    while (parentId) {
      const parentIcon = String.fromCodePoint(
        this._numbers[this._indexMap[parentId]]
      );
      path = parentIcon + "-" + path;
      parentId = this._parentMap[parentId];
    }
    const traceIcon = String.fromCodePoint(
      this._numbers[this._indexMap[span.spanContext().traceId]]
    );
    path = traceIcon + ":" + path;
    const pathPadded = path.padEnd(60, "-") + ">";
    return pathPadded;
  }

  private _formatDuration(span: ReadableSpan): string {
    const duration = hrTimeToMilliseconds(span.duration).toString() + "ms";
    const durationPadded = duration.padStart(8);
    return durationPadded;
  }

  // icons - duration - span name
  private _formatSpanDetailed(span: ReadableSpan): string {
    const path = this._formatIcons(span);
    const duration = this._formatDuration(span);
    const label = span.name;
    const message = `${path} ${duration} - ${label}`;
    return message;
  }

  // duration - custom label (or span name)
  private _formatSpan(span: ReadableSpan): string {
    const path = this._formatIcons(span);
    const duration = this._formatDuration(span);
    let label;
    if (span.attributes.label) {
      try {
        label = JSON.parse(span.attributes.label as string);
      } catch {
        label = span.attributes.label;
      }
    } else {
      label = span.name;
    }
    const message = `${path} ${duration} - ${label}`;
    return message;
  }

  private _sendSpans(
    spans: ReadableSpan[],
    done: (result: ExportResult) => void
  ): void {
    // assign icons and record child-parent relations
    for (const span of spans) {
      this._cacheSpan(span);
    }
    // print logs to console
    if (this._isDetailed) {
      for (const span of spans) {
        console.debug(
          this._formatSpanDetailed(span),
          "\n",
          parseAttributes(span.attributes)
        );
      }
    } else {
      for (const span of spans) {
        console.debug(this._formatSpan(span));
      }
    }
    return done({ code: ExportResultCode.SUCCESS });
  }
}
