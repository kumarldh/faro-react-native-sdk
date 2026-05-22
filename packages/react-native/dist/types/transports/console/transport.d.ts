import { BaseTransport } from '@grafana/faro-core';
import type { TransportItem } from '@grafana/faro-core';
import type { ConsoleTransportOptions } from './types';
export declare class ConsoleTransport extends BaseTransport {
    private options;
    readonly name = "@grafana/faro-react-native:transport-console";
    readonly version = "2.3.1";
    constructor(options?: ConsoleTransportOptions);
    send(item: TransportItem): void;
}
