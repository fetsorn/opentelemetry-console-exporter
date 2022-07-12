# OpenTelemetry Console Trace Exporter
[![NPM Published Version][npm-img]][npm-url]

OpenTelemetry Console Trace Exporter allows the user to send collected traces to console.debug.

## Setup

Google Cloud Trace is a managed service provided by Google Cloud Platform.

## Installation

```bash
npm install --save @fetsorn/opentelemetry-console-exporter
```

## Usage
Install the exporter on your application, register the exporter, and start tracing. 
```js
const { ConsoleExporter } = require('@fetsorn/opentelemetry-console-exporter');

const exporter = new TraceExporter({
  // If you want more detailed view, you will need to specify `isDetailed = true` here
});
```

Now, register the exporter.

```js
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
```

Exporter requires `BatchSpanProcessor` to analyze the trace hierarchy.

- [BatchSpanProcessor](https://github.com/open-telemetry/opentelemetry-specification/blob/v1.4.0/specification/trace/sdk.md#batching-processor): The implementation of the `SpanProcessor` that batches ended spans and pushes them to the configured `SpanExporter`.


## Useful links
- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
- Check out how this exporter is used in Polywrap: <https://github.com/polywrap/monorepo>

[npm-url]: https://www.npmjs.com/package/@fetsorn/opentelemetry-console-exporter
[npm-img]: https://badge.fury.io/js/%40fetsorn%2Fopentelemetry-console-exporter.svg
[license-url]: https://github.com/fetsorn/opentelemetry-console-exporter/blob/main/LICENSE
[license-image]: https://img.shields.io/npm/l/@fetsorn/opentelemetry-console-exporter
