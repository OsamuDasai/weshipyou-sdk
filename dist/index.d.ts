import { I as IHttpClient, d as ITokenManager, H as HttpRequest, e as HttpResponse, f as ICircuitBreaker, g as CircuitState, h as IRateLimiter, i as ITracer, j as ISpan, D as DomainEvent, b as IEventStore } from './update-shipment.use-case-BsHiVqQV.js';
export { k as AccountService, l as AuthService, C as CreateShipmentUseCase, m as CreateSubAccountUseCase, n as DimUnit, E as ExecuteRechargeUseCase, G as GetRatesUseCase, o as HandleWebhookUseCase, p as IPollingService, q as IRateRequest, a as IShipmentRequest, r as IWebhookEvent, s as IWebhookHandler, t as Incoterms, M as MetricsCollector, u as MobileRechargeService, P as Parcel, v as ParcelItem, w as PollingOptions, x as PollingService, R as RatesAddress, y as SenderRecipientBase, c as Services, z as ShipmentRecipient, B as ShipmentSender, F as ShipmentService, J as ShipmentStatus, S as SqliteEventStore, T as TrackShipmentUseCase, U as UpdateShipmentUseCase, W as WebhookConfig, K as WeightUnit, L as bootstrap } from './update-shipment.use-case-BsHiVqQV.js';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { Options } from 'express-rate-limit';
import { NodeSDK } from '@opentelemetry/sdk-node';
import 'zod';

interface ISecurityMiddleware {
    getHandler(): RequestHandler;
}

interface IPaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    skip: number;
}
interface IQueryPagination {
    limit?: number;
    skip?: number;
}

type SdkEnvironment = 'test' | 'production';

interface Shutdownable {
    close(): Promise<void>;
}
declare function gracefulShutdown(server: Server, deps: Shutdownable[], timeout?: number): () => Promise<void>;

declare class AxiosHttpClient implements IHttpClient {
    private client;
    private tokenManager;
    private retries;
    private baseDelayMs;
    private refreshTokenFn?;
    private refreshPromise;
    private idempotencyPaths;
    private onRateLimit?;
    lastRateLimit: {
        remaining: number;
        limit: number;
        reset: number;
    } | null;
    constructor(baseURL: string, tokenManager: ITokenManager, refreshTokenFn?: () => Promise<{
        accessToken: string;
        exp: number;
    }>, retries?: number, baseDelayMs?: number, idempotencyPaths?: RegExp[], onRateLimit?: (info: {
        remaining: number;
        limit: number;
        reset: number;
    }) => void);
    getRateLimitInfo(): {
        remaining: number;
        limit: number;
        reset: number;
    } | null;
    request<T>(config: HttpRequest): Promise<HttpResponse<T>>;
}

declare class InMemoryTokenManager implements ITokenManager {
    private token;
    private exp;
    setToken(token: string, exp: number): void;
    getToken(): string | null;
    isExpired(): boolean;
    clear(): void;
}

declare class CircuitBreaker implements ICircuitBreaker {
    private state;
    private failures;
    private failureThreshold;
    private resetTimeoutMs;
    private lastFailureTime;
    constructor(failureThreshold?: number, resetTimeoutMs?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): CircuitState;
    reset(): void;
    private onSuccess;
    private onFailure;
}

declare class OpossumCircuitBreaker implements ICircuitBreaker {
    private breaker;
    constructor(options?: {
        timeout?: number;
        errorThresholdPercentage?: number;
        resetTimeout?: number;
    });
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): CircuitState;
    reset(): void;
    getMetrics(): {
        success: number;
        failure: number;
        timeout: number;
        rejection: number;
    };
}

declare class ExpressRateLimiter implements IRateLimiter {
    private limiter;
    constructor(opts?: Partial<Options>);
    consume(_key: string, _tokens?: number): Promise<{
        remaining: number;
        limit: number;
        retryAfter?: number;
    }>;
    getMiddleware(): (req: Request, res: Response, next: NextFunction) => unknown;
    close(): Promise<void>;
}

declare class OtelTracer implements ITracer {
    private tracer;
    startSpan(name: string, attributes?: Record<string, string | number | boolean>): ISpan;
    close(): Promise<void>;
}

declare function initOpenTelemetry(serviceName?: string): NodeSDK;
declare function shutdownOpenTelemetry(): Promise<void>;

declare class HelmetCspMiddleware implements ISecurityMiddleware {
    getHandler(): RequestHandler;
}

declare class ShipmentCreatedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        accountId: string;
        trackingNumber?: string;
    };
    readonly timestamp: string;
    readonly version: number;
    readonly type = "shipment.created";
    constructor(eventId: string, aggregateId: string, payload: {
        accountId: string;
        trackingNumber?: string;
    }, timestamp?: string, version?: number);
}
declare class ShipmentStatusChangedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        status: string;
        previousStatus: string;
        updatedAt: string;
    };
    readonly timestamp: string;
    readonly version: number;
    readonly type = "shipment.status_changed";
    constructor(eventId: string, aggregateId: string, payload: {
        status: string;
        previousStatus: string;
        updatedAt: string;
    }, timestamp?: string, version?: number);
}
declare class ShipmentUpdatedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        accountId: string;
        fields: string[];
    };
    readonly timestamp: string;
    readonly version: number;
    readonly type = "shipment.updated";
    constructor(eventId: string, aggregateId: string, payload: {
        accountId: string;
        fields: string[];
    }, timestamp?: string, version?: number);
}

declare class WebhookReceivedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        eventType: string;
        signature: string;
        body: string;
    };
    readonly timestamp: string;
    readonly version: number;
    readonly type = "webhook.received";
    constructor(eventId: string, aggregateId: string, payload: {
        eventType: string;
        signature: string;
        body: string;
    }, timestamp?: string, version?: number);
}
declare class WebhookProcessedEvent implements DomainEvent {
    readonly eventId: string;
    readonly aggregateId: string;
    readonly payload: {
        eventType: string;
        success: boolean;
        error?: string;
    };
    readonly timestamp: string;
    readonly version: number;
    readonly type = "webhook.processed";
    constructor(eventId: string, aggregateId: string, payload: {
        eventType: string;
        success: boolean;
        error?: string;
    }, timestamp?: string, version?: number);
}

declare class ShipmentReconciliationSaga {
    private readonly eventStore;
    private readonly httpClient;
    constructor(eventStore: IEventStore, httpClient: IHttpClient);
    onShipmentCreated(event: ShipmentCreatedEvent): Promise<void>;
    onShipmentStatusChanged(event: ShipmentStatusChangedEvent): Promise<void>;
    onWebhookReceived(event: DomainEvent): Promise<void>;
}

declare const SDK_VERSION = "1.0.0";

export { AxiosHttpClient, CircuitBreaker, CircuitState, DomainEvent, ExpressRateLimiter, HelmetCspMiddleware, HttpRequest, HttpResponse, ICircuitBreaker, IEventStore, IHttpClient, type IPaginatedResponse, type IQueryPagination, IRateLimiter, type ISecurityMiddleware, ISpan, ITokenManager, ITracer, InMemoryTokenManager, OpossumCircuitBreaker, OtelTracer, SDK_VERSION, type SdkEnvironment, ShipmentCreatedEvent, ShipmentReconciliationSaga, ShipmentStatusChangedEvent, ShipmentUpdatedEvent, type Shutdownable, WebhookProcessedEvent, WebhookReceivedEvent, gracefulShutdown, initOpenTelemetry, shutdownOpenTelemetry };
