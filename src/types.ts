import { Attributes } from "@opentelemetry/api";

/**
 * Exporter config
 */
export interface ConsoleExporterOptions {
  /**
   * A detailed view boolean
   */
  isDetailed?: boolean;
}

export interface Span1 {
  name: string;
  args: Attributes;
  children?: Span1[];
}

export interface Span2 {
  [key: string]: SpanDetails;
}

export interface SpanDetails {
  args: Attributes;
  children?: Span2[];
}
