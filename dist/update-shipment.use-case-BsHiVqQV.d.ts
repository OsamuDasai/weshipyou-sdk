import { z } from 'zod';
import { Router } from 'express';

interface HttpRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}
interface HttpResponse<T = unknown> {
    status: number;
    data: T;
    headers: Record<string, string>;
}
interface IHttpClient {
    request<T>(config: HttpRequest): Promise<HttpResponse<T>>;
}

interface ITokenManager {
    setToken(token: string, exp: number): void;
    getToken(): string | null;
    isExpired(): boolean;
    clear(): void;
}

declare enum AcceptLanguage {
    EN_US = "en-US",
    ES_ES = "es-ES",
    PT_BR = "pt-BR"
}

interface AuthResponse {
    accessToken: string;
    exp?: number;
}
interface IAuthService {
    authenticate(username: string, password: string, lang?: AcceptLanguage): Promise<AuthResponse>;
}
declare class AuthService implements IAuthService {
    private readonly httpClient;
    private readonly tokenManager?;
    constructor(httpClient: IHttpClient, tokenManager?: ITokenManager | undefined);
    authenticate(username: string, password: string, lang?: AcceptLanguage): Promise<AuthResponse>;
}

interface PollingOptions {
    maxAttempts: number;
    baseDelayMs: number;
    abortSignal?: AbortSignal;
}
interface IPollingService {
    pollUntil<T>(fn: () => Promise<T>, condition: (result: T) => boolean, opts?: Partial<PollingOptions>): Promise<T>;
}

declare class PollingService implements IPollingService {
    pollUntil<T>(fn: () => Promise<T>, condition: (result: T) => boolean, opts?: Partial<PollingOptions>): Promise<T>;
}

interface CityState {
    name: string;
}
interface City {
    name: string;
    state: CityState;
}
interface RatesAddress {
    city: City;
    street: string;
    postalCode: string;
}
interface SenderRecipientBase {
    address: RatesAddress;
    country: {
        isoCode: string;
    };
}
type DimUnit = 'cm' | 'in';
type WeightUnit = 'gm' | 'kg' | 'oz' | 'lb';
type Incoterms = 'DDU' | 'DDP';
interface ParcelItemCategory {
    slug: string;
}
interface ParcelItemCurrency {
    name: string;
    code: string;
    prefix: string;
}
interface ParcelItem {
    sku?: string;
    description: string;
    category: ParcelItemCategory;
    price: number;
    qty: number;
    originCountry?: {
        isoCode: string;
    };
    weight?: number;
    currency: string | ParcelItemCurrency;
}
interface Parcel {
    dimUnit: DimUnit;
    width: number;
    length: number;
    height: number;
    weightUnit: WeightUnit;
    weight: number;
    parcel_items: ParcelItem[];
}
interface IRateRequest {
    accountId: string;
    totalValue: number;
    incoterms: Incoterms;
    insurance?: boolean;
    sender: SenderRecipientBase;
    recipient: SenderRecipientBase;
    parcels: Parcel[];
}
interface ShipmentSender {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    taxId?: string;
    taxIdCountry?: {
        isoCode: string;
    };
    address: RatesAddress;
    country: {
        isoCode: string;
    };
}
interface ShipmentRecipient {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    taxId?: string;
    taxIdCountry?: {
        isoCode: string;
    };
    address: RatesAddress;
    country: {
        isoCode: string;
    };
}
interface IShipmentRequest {
    accountId: string;
    totalValue: number;
    incoterms: Incoterms;
    insurance?: boolean;
    externalReferenceCode?: string;
    externalCustomerId?: string;
    sender: ShipmentSender;
    recipient: ShipmentRecipient;
    parcels: Parcel[];
}

interface IShipmentService {
    getRates(payload: IRateRequest, lang?: AcceptLanguage): Promise<unknown>;
    createShipment(payload: IShipmentRequest, lang?: AcceptLanguage): Promise<unknown>;
    updateShipment(id: string, payload: Partial<IShipmentRequest>, lang?: AcceptLanguage): Promise<unknown>;
    getCountryCategories(countryCode: string, lang?: AcceptLanguage): Promise<unknown>;
}
declare class ShipmentService implements IShipmentService {
    private readonly httpClient;
    private categoryCache;
    constructor(httpClient: IHttpClient);
    getRates(payload: IRateRequest, lang?: AcceptLanguage): Promise<unknown>;
    createShipment(payload: IShipmentRequest, lang?: AcceptLanguage): Promise<unknown>;
    updateShipment(id: string, payload: Partial<IShipmentRequest>, lang?: AcceptLanguage): Promise<unknown>;
    getCountryCategories(countryCode: string, lang?: AcceptLanguage): Promise<unknown>;
}

declare class GetRatesUseCase {
    private readonly authService;
    private readonly shipmentService;
    constructor(authService: IAuthService, shipmentService: IShipmentService);
    execute(username: string, password: string, payload: IRateRequest, lang?: AcceptLanguage): Promise<unknown>;
}

declare class CreateShipmentUseCase {
    private readonly authService;
    private readonly shipmentService;
    constructor(authService: IAuthService, shipmentService: IShipmentService);
    execute(username: string, password: string, payload: IShipmentRequest, lang?: AcceptLanguage): Promise<unknown>;
}

declare const AddSubAccountSchema: z.ZodObject<{
    accountUid: z.ZodOptional<z.ZodString>;
    externalAccountNumber: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    displayName: z.ZodString;
    systemUnits: z.ZodEnum<["imperial", "metric"]>;
    email: z.ZodString;
    notificationEmail: z.ZodString;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodString;
    emergencyPhone: z.ZodString;
    taxId: z.ZodOptional<z.ZodString>;
    taxIdCountry: z.ZodOptional<z.ZodObject<{
        isoCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        isoCode: string;
    }, {
        isoCode: string;
    }>>;
    isBusiness: z.ZodDefault<z.ZodBoolean>;
    allowBankAccountPayments: z.ZodDefault<z.ZodBoolean>;
    address: z.ZodOptional<z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        countryIsoCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        countryIsoCode: string;
    }, {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        countryIsoCode: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    displayName: string;
    systemUnits: "imperial" | "metric";
    email: string;
    notificationEmail: string;
    phone: string;
    emergencyPhone: string;
    isBusiness: boolean;
    allowBankAccountPayments: boolean;
    accountUid?: string | undefined;
    externalAccountNumber?: string | undefined;
    website?: string | undefined;
    taxId?: string | undefined;
    taxIdCountry?: {
        isoCode: string;
    } | undefined;
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        countryIsoCode: string;
    } | undefined;
}, {
    name: string;
    displayName: string;
    systemUnits: "imperial" | "metric";
    email: string;
    notificationEmail: string;
    phone: string;
    emergencyPhone: string;
    accountUid?: string | undefined;
    externalAccountNumber?: string | undefined;
    website?: string | undefined;
    taxId?: string | undefined;
    taxIdCountry?: {
        isoCode: string;
    } | undefined;
    isBusiness?: boolean | undefined;
    allowBankAccountPayments?: boolean | undefined;
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        countryIsoCode: string;
    } | undefined;
}>;
type AddSubAccountInput = z.infer<typeof AddSubAccountSchema>;

interface IAccountService {
    addSubAccount(payload: AddSubAccountInput, lang?: AcceptLanguage): Promise<unknown>;
    addFunds(payload: {
        paymentMethod?: string;
        accountUid?: string;
        transaction: {
            zelleTransaction: string;
            amount: number;
        };
    }, lang?: AcceptLanguage): Promise<unknown>;
}
declare class AccountService implements IAccountService {
    private readonly httpClient;
    constructor(httpClient: IHttpClient);
    addSubAccount(payload: AddSubAccountInput, lang?: AcceptLanguage): Promise<unknown>;
    addFunds(payload: {
        paymentMethod?: string;
        accountUid?: string;
        transaction: {
            zelleTransaction: string;
            amount: number;
        };
    }, lang?: AcceptLanguage): Promise<unknown>;
}

declare class CreateSubAccountUseCase {
    private readonly authService;
    private readonly accountService;
    constructor(authService: IAuthService, accountService: IAccountService);
    execute(username: string, password: string, payload: unknown, lang?: AcceptLanguage): Promise<unknown>;
}

declare const CreateRechargeSchema: z.ZodObject<{
    paymentMethod: z.ZodDefault<z.ZodEnum<["zelle", "credit_card", "balance"]>>;
    accountUid: z.ZodOptional<z.ZodString>;
    rechargeable_product: z.ZodObject<{
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: number;
    }, {
        id: number;
    }>;
    scheduleDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    amount: z.ZodNumber;
    account_rechargeable_contact: z.ZodObject<{
        name: z.ZodString;
        accountNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        accountNumber: string;
    }, {
        name: string;
        accountNumber: string;
    }>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "zelle" | "credit_card" | "balance";
    rechargeable_product: {
        id: number;
    };
    amount: number;
    account_rechargeable_contact: {
        name: string;
        accountNumber: string;
    };
    accountUid?: string | undefined;
    scheduleDate?: string | null | undefined;
}, {
    rechargeable_product: {
        id: number;
    };
    amount: number;
    account_rechargeable_contact: {
        name: string;
        accountNumber: string;
    };
    accountUid?: string | undefined;
    paymentMethod?: "zelle" | "credit_card" | "balance" | undefined;
    scheduleDate?: string | null | undefined;
}>;
type CreateRechargeInput = z.infer<typeof CreateRechargeSchema>;

interface IMobileRechargeService {
    createRecharge(payload: CreateRechargeInput, lang?: AcceptLanguage): Promise<unknown>;
    getRecharges(limit?: number, lang?: AcceptLanguage): Promise<unknown>;
}
declare class MobileRechargeService implements IMobileRechargeService {
    private readonly httpClient;
    constructor(httpClient: IHttpClient);
    createRecharge(payload: CreateRechargeInput, lang?: AcceptLanguage): Promise<unknown>;
    getRecharges(limit?: number, lang?: AcceptLanguage): Promise<unknown>;
}

declare class ExecuteRechargeUseCase {
    private readonly authService;
    private readonly rechargeService;
    constructor(authService: IAuthService, rechargeService: IMobileRechargeService);
    execute(username: string, password: string, payload: unknown, lang?: AcceptLanguage): Promise<unknown>;
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF-OPEN';
interface ICircuitBreaker {
    execute<T>(fn: () => Promise<T>): Promise<T>;
    getState(): CircuitState;
    reset(): void;
}

interface ShipmentStatus {
    id: string;
    status: string;
    trackingNumber?: string;
    updatedAt: string;
}
declare class TrackShipmentUseCase {
    private readonly httpClient;
    private readonly pollingService;
    private readonly circuitBreaker;
    constructor(httpClient: IHttpClient, pollingService: IPollingService, circuitBreaker: ICircuitBreaker);
    execute(shipmentId: string, targetStatus: string, abortSignal?: AbortSignal, lang?: AcceptLanguage): Promise<ShipmentStatus>;
}

interface IWebhookEvent {
    eventType: string;
    payload: unknown;
    timestamp: string;
}
interface IWebhookHandler {
    verifySignature(rawBody: string, signature: string, secret?: string, algorithm?: string): boolean;
    handle(event: IWebhookEvent): Promise<void>;
}

declare class HandleWebhookUseCase implements IWebhookHandler {
    private readonly secret;
    private readonly algorithm;
    constructor(secret: string, algorithm?: string);
    verifySignature(rawBody: string, signature: string, secret?: string, algorithm?: string): boolean;
    handle(event: IWebhookEvent): Promise<void>;
}

interface MetricsSnapshot {
    totalRequests: number;
    failedRequests: number;
    circuitBreakerTrips: number;
    averageResponseTimeMs: number;
}
declare class MetricsCollector {
    private totalRequests;
    private failedRequests;
    private circuitBreakerTrips;
    private responseTimes;
    private readonly maxSamples;
    recordRequest(durationMs: number, success: boolean): void;
    recordCircuitBreakerTrip(): void;
    snapshot(): MetricsSnapshot;
    reset(): void;
}

interface IRateLimiter {
    consume(key: string, tokens?: number): Promise<{
        remaining: number;
        limit: number;
        retryAfter?: number;
    }>;
    getMiddleware(): (req: any, res: any, next: any) => void;
}

interface ITracer {
    startSpan(name: string, attributes?: Record<string, string | number | boolean>): ISpan;
}
interface ISpan {
    setAttribute(key: string, value: string | number | boolean): void;
    end(): void;
}

interface Services {
    auth: AuthService;
    httpClient: IHttpClient;
    getRates: GetRatesUseCase;
    createShipment: CreateShipmentUseCase;
    createSubAccount: CreateSubAccountUseCase;
    executeRecharge: ExecuteRechargeUseCase;
    trackShipment: TrackShipmentUseCase;
    webhookHandler: HandleWebhookUseCase;
    pollingService: PollingService;
    circuitBreaker: ICircuitBreaker;
    metricsCollector: MetricsCollector;
    rateLimiter: IRateLimiter;
    tracer: ITracer;
    router: Router;
}
interface WebhookConfig {
    secret: string;
    algorithm?: string;
}
declare function bootstrap(baseURL: string, webhookConfig?: WebhookConfig | string, otelEndpoint?: string): Services;

interface DomainEvent {
    eventId: string;
    aggregateId: string;
    type: string;
    payload: Record<string, unknown>;
    timestamp: string;
    version: number;
}
interface IEventStore {
    append(aggregateId: string, events: DomainEvent[]): Promise<void>;
    getByAggregate(aggregateId: string, sinceVersion?: number): Promise<DomainEvent[]>;
    replay(sinceTimestamp?: string, handler?: (event: DomainEvent) => Promise<void>): Promise<void>;
}

declare class SqliteEventStore implements IEventStore {
    private db;
    constructor(dbPath?: string);
    append(aggregateId: string, events: DomainEvent[]): Promise<void>;
    getByAggregate(aggregateId: string, sinceVersion?: number): Promise<DomainEvent[]>;
    replay(sinceTimestamp?: string, handler?: (event: DomainEvent) => Promise<void>): Promise<void>;
    close(): void;
}

declare class UpdateShipmentUseCase {
    private readonly authService;
    private readonly shipmentService;
    constructor(authService: IAuthService, shipmentService: IShipmentService);
    execute(username: string, password: string, shipmentId: string, payload: Partial<IShipmentRequest>, lang?: AcceptLanguage): Promise<unknown>;
}

export { AcceptLanguage as A, type ShipmentSender as B, CreateShipmentUseCase as C, type DomainEvent as D, ExecuteRechargeUseCase as E, ShipmentService as F, GetRatesUseCase as G, type HttpRequest as H, type IHttpClient as I, type ShipmentStatus as J, type WeightUnit as K, bootstrap as L, MetricsCollector as M, type Parcel as P, type RatesAddress as R, SqliteEventStore as S, TrackShipmentUseCase as T, UpdateShipmentUseCase as U, type WebhookConfig as W, type IShipmentRequest as a, type IEventStore as b, type Services as c, type ITokenManager as d, type HttpResponse as e, type ICircuitBreaker as f, type CircuitState as g, type IRateLimiter as h, type ITracer as i, type ISpan as j, AccountService as k, AuthService as l, CreateSubAccountUseCase as m, type DimUnit as n, HandleWebhookUseCase as o, type IPollingService as p, type IRateRequest as q, type IWebhookEvent as r, type IWebhookHandler as s, type Incoterms as t, MobileRechargeService as u, type ParcelItem as v, type PollingOptions as w, PollingService as x, type SenderRecipientBase as y, type ShipmentRecipient as z };
