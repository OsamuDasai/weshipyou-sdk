import { D as DomainEvent, I as IHttpClient, a as IShipmentRequest, A as AcceptLanguage, C as CreateShipmentUseCase, b as IEventStore, E as ExecuteRechargeUseCase, U as UpdateShipmentUseCase, S as SqliteEventStore, c as Services } from './update-shipment.use-case-BsHiVqQV.js';
import { Request, RequestHandler } from 'express';
import 'zod';

interface TenantContext {
    tenantId: string;
    accountId: string;
    permissions: string[];
    metadata?: Record<string, unknown>;
}
interface ITenantContextProvider {
    getCurrent(): TenantContext | null;
    set(context: TenantContext): void;
    clear(): void;
    isolate<T>(context: TenantContext, fn: () => Promise<T>): Promise<T>;
}

interface SchemaIsolationConfig {
    tenantId: string;
    schemaName: string;
    migrationStatements: string[];
}
declare class SchemaIsolationManager {
    private tenantProvider;
    private schemas;
    constructor(tenantProvider: ITenantContextProvider);
    register(tenantId: string, config: SchemaIsolationConfig): void;
    getCurrentSchema(): string | null;
    getSchemaFor(tenantId: string): string | null;
    deregister(tenantId: string): void;
}

interface ShipmentReadModel {
    id: string;
    tenantId: string;
    accountId: string;
    status: string;
    trackingNumber?: string;
    totalValue: number;
    incoterms: 'DDU' | 'DDP';
    senderName: string;
    recipientName: string;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown>;
}
interface IReadModel {
    init(): Promise<void>;
    close(): Promise<void>;
    upsert(shipment: ShipmentReadModel): Promise<void>;
    getById(id: string, tenantId: string): Promise<ShipmentReadModel | null>;
    query(filters: {
        tenantId: string;
        accountId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<ShipmentReadModel[]>;
}
interface IProjectionHandler {
    handle(event: DomainEvent): Promise<void>;
}

declare class RedisStreamsProjection {
    private client;
    private streamName;
    private groupName;
    private consumerName;
    constructor(redisUrl: string, streamName?: string, groupName?: string, consumerName?: string);
    init(): Promise<void>;
    publish(event: DomainEvent): Promise<void>;
    consume(handler: IProjectionHandler, timeout?: number): Promise<void>;
    close(): Promise<void>;
}

declare class ShipmentProjection implements IProjectionHandler {
    private readonly readModel;
    constructor(readModel: IReadModel);
    handle(event: DomainEvent): Promise<void>;
    private onShipmentCreated;
    private onStatusChanged;
}

interface AuditLogEntry extends DomainEvent {
    tenantId: string;
    actorId: string;
    actorType: 'user' | 'system' | 'api_key';
    action: string;
    resourceType: string;
    resourceId: string;
    ipAddress?: string;
    userAgent?: string;
    signature: string;
}
interface IAuditLogService {
    log(entry: Omit<AuditLogEntry, 'signature'>, privateKey: string): Promise<void>;
    verify(entry: AuditLogEntry, publicKey: string): boolean;
    query(filters: {
        tenantId: string;
        resourceType?: string;
        resourceId?: string;
        since?: string;
        until?: string;
    }): Promise<AuditLogEntry[]>;
}

type SiemFormat = 'json' | 'cef' | 'leef';
declare class SiemExporter {
    export(entries: AuditLogEntry[], format: SiemFormat): string;
    private toCEF;
    private toLEEF;
}

declare class AuditLogService {
    private readonly auditLog;
    private readonly tenantProvider;
    private readonly privateKey;
    constructor(auditLog: IAuditLogService, tenantProvider: ITenantContextProvider, privateKey: string);
    record(partial: {
        action: string;
        resourceType: string;
        resourceId: string;
        payload: Record<string, unknown>;
    }): Promise<void>;
}

type ChaosAttack = 'latency' | 'error' | 'timeout' | 'crash';
interface IChaosTester {
    inject(attack: ChaosAttack, durationMs?: number): Promise<void>;
    recover(): Promise<void>;
    isActive(): boolean;
}

declare class HttpChaosTester implements IChaosTester {
    private readonly httpClient;
    private active;
    constructor(httpClient: IHttpClient);
    inject(attack: ChaosAttack, durationMs?: number): Promise<void>;
    recover(): Promise<void>;
    isActive(): boolean;
    private injectLatency;
    private injectErrors;
    private injectTimeout;
    private injectCrash;
}

interface TenantExtractor {
    (req: Request): Promise<{
        tenantId: string;
        accountId: string;
    }>;
}
declare function createTenantMiddleware(tenantProvider: ITenantContextProvider, extractTenant: TenantExtractor): RequestHandler;

interface EnterpriseConfig {
    postgresUrl: string;
    redisUrl: string;
    auditPrivateKey: string;
    streamName?: string;
    consumerName?: string;
    chaosBaseUrl?: string;
}

interface ICommand<TResult = void> {
    readonly type: string;
}
interface ICommandHandler<TCommand extends ICommand<TResult>, TResult = void> {
    execute(command: TCommand): Promise<TResult>;
}
interface IQuery<TResult = unknown> {
    readonly type: string;
}
interface IQueryHandler<TQuery extends IQuery<TResult>, TResult = unknown> {
    execute(query: TQuery): Promise<TResult>;
}

interface CreateShipmentResult {
    shipmentId: string;
    trackingNumber?: string;
}
declare class CreateShipmentCommand implements ICommand<CreateShipmentResult> {
    readonly username: string;
    readonly password: string;
    readonly payload: IShipmentRequest;
    readonly lang: AcceptLanguage;
    readonly type = "CreateShipment";
    constructor(username: string, password: string, payload: IShipmentRequest, lang?: AcceptLanguage);
}
declare class CreateShipmentHandler implements ICommandHandler<CreateShipmentCommand, CreateShipmentResult> {
    private readonly createShipmentUseCase;
    private readonly eventStore;
    private readonly tenantId?;
    constructor(createShipmentUseCase: CreateShipmentUseCase, eventStore: IEventStore, tenantId?: string | undefined);
    execute(command: CreateShipmentCommand): Promise<CreateShipmentResult>;
}

interface CancelShipmentResult {
    success: boolean;
    shipmentId: string;
}
declare class CancelShipmentCommand implements ICommand<CancelShipmentResult> {
    readonly shipmentId: string;
    readonly tenantId: string;
    readonly accountId: string;
    readonly type = "CancelShipment";
    constructor(shipmentId: string, tenantId: string, accountId: string);
}
declare class CancelShipmentHandler implements ICommandHandler<CancelShipmentCommand, CancelShipmentResult> {
    private readonly httpClient;
    private readonly eventStore;
    constructor(httpClient: IHttpClient, eventStore: IEventStore);
    execute(command: CancelShipmentCommand): Promise<CancelShipmentResult>;
}

interface RechargeableProduct {
    id: number;
}
interface AccountRechargeableContact {
    name: string;
    accountNumber: string;
}
interface CreateRechargeRequest {
    paymentMethod: 'zelle' | 'credit_card' | 'balance';
    accountUid?: string;
    rechargeable_product: RechargeableProduct;
    scheduleDate?: string | null;
    amount: number;
    account_rechargeable_contact: AccountRechargeableContact;
}

interface ExecuteRechargeResult {
    transactionId: string;
    status: string;
}
declare class ExecuteRechargeCommand implements ICommand<ExecuteRechargeResult> {
    readonly username: string;
    readonly password: string;
    readonly payload: CreateRechargeRequest;
    readonly lang: AcceptLanguage;
    readonly type = "ExecuteRecharge";
    constructor(username: string, password: string, payload: CreateRechargeRequest, lang?: AcceptLanguage);
}
declare class ExecuteRechargeHandler implements ICommandHandler<ExecuteRechargeCommand, ExecuteRechargeResult> {
    private readonly executeRechargeUseCase;
    private readonly eventStore;
    constructor(executeRechargeUseCase: ExecuteRechargeUseCase, eventStore: IEventStore);
    execute(command: ExecuteRechargeCommand): Promise<ExecuteRechargeResult>;
}

interface UpdateShipmentResult {
    shipmentId: string;
}
declare class UpdateShipmentCommand implements ICommand<UpdateShipmentResult> {
    readonly username: string;
    readonly password: string;
    readonly shipmentId: string;
    readonly payload: Partial<IShipmentRequest>;
    readonly lang: AcceptLanguage;
    readonly type = "UpdateShipment";
    constructor(username: string, password: string, shipmentId: string, payload: Partial<IShipmentRequest>, lang?: AcceptLanguage);
}
declare class UpdateShipmentHandler implements ICommandHandler<UpdateShipmentCommand, UpdateShipmentResult> {
    private readonly updateShipmentUseCase;
    private readonly eventStore;
    private readonly tenantId?;
    constructor(updateShipmentUseCase: UpdateShipmentUseCase, eventStore: IEventStore, tenantId?: string | undefined);
    execute(command: UpdateShipmentCommand): Promise<UpdateShipmentResult>;
}

declare class GetShipmentQuery implements IQuery<ShipmentReadModel | null> {
    readonly shipmentId: string;
    readonly tenantId: string;
    readonly type = "GetShipment";
    constructor(shipmentId: string, tenantId: string);
}
declare class GetShipmentHandler implements IQueryHandler<GetShipmentQuery, ShipmentReadModel | null> {
    private readonly readModel;
    constructor(readModel: IReadModel);
    execute(query: GetShipmentQuery): Promise<ShipmentReadModel | null>;
}

interface ListShipmentsFilter {
    tenantId: string;
    accountId?: string;
    status?: string;
    limit?: number;
    offset?: number;
}
declare class ListShipmentsQuery implements IQuery<ShipmentReadModel[]> {
    readonly filter: ListShipmentsFilter;
    readonly type = "ListShipments";
    constructor(filter: ListShipmentsFilter);
}
declare class ListShipmentsHandler implements IQueryHandler<ListShipmentsQuery, ShipmentReadModel[]> {
    private readonly readModel;
    constructor(readModel: IReadModel);
    execute(query: ListShipmentsQuery): Promise<ShipmentReadModel[]>;
}

declare class GetShipmentHistoryQuery implements IQuery<DomainEvent[]> {
    readonly shipmentId: string;
    readonly sinceVersion?: number | undefined;
    readonly type = "GetShipmentHistory";
    constructor(shipmentId: string, sinceVersion?: number | undefined);
}
declare class GetShipmentHistoryHandler implements IQueryHandler<GetShipmentHistoryQuery, DomainEvent[]> {
    private readonly eventStore;
    constructor(eventStore: IEventStore);
    execute(query: GetShipmentHistoryQuery): Promise<DomainEvent[]>;
}

declare class AsyncLocalStorageTenantContext implements ITenantContextProvider {
    private storage;
    getCurrent(): TenantContext | null;
    set(context: TenantContext): void;
    clear(): void;
    isolate<T>(context: TenantContext, fn: () => Promise<T>): Promise<T>;
}

declare class PostgresReadModel implements IReadModel {
    private pool;
    constructor(connectionString: string, poolConfig?: {
        max?: number;
        idleTimeoutMillis?: number;
        connectionTimeoutMillis?: number;
    });
    init(): Promise<void>;
    upsert(shipment: ShipmentReadModel): Promise<void>;
    getById(id: string, tenantId: string): Promise<ShipmentReadModel | null>;
    query(filters: {
        tenantId: string;
        accountId?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<ShipmentReadModel[]>;
    close(): Promise<void>;
}

declare class ImmutableAuditLog implements IAuditLogService {
    private db;
    private readonly algorithm;
    constructor(dbPath?: string);
    log(entry: Omit<AuditLogEntry, 'signature'>, privateKey: string): Promise<void>;
    verify(entry: AuditLogEntry, key: string): boolean;
    query(filters: {
        tenantId: string;
        resourceType?: string;
        resourceId?: string;
        since?: string;
        until?: string;
    }): Promise<AuditLogEntry[]>;
    exportToSIEM(format: 'json' | 'cef' | 'leef'): Promise<string>;
    close(): void;
}

interface TenantConfig {
    tenantId: string;
    accountId: string;
    dbSchema?: string;
    features: {
        auditLog: boolean;
        readModel: boolean;
        webhookReplay: boolean;
    };
    rateLimits: {
        requestsPerMinute: number;
        concurrentShipments: number;
    };
}

interface EnterpriseServices {
    tenantProvider: ITenantContextProvider;
    schemaIsolation: SchemaIsolationManager;
    readModel: IReadModel;
    projection: RedisStreamsProjection;
    shipmentProjection: ShipmentProjection;
    eventStore: SqliteEventStore;
    auditLog: IAuditLogService;
    siemExporter: SiemExporter;
    auditService: AuditLogService;
    chaosTester: HttpChaosTester;
    tenantMiddleware: ReturnType<typeof createTenantMiddleware>;
    commands: {
        createShipment: CreateShipmentHandler;
        cancelShipment: CancelShipmentHandler;
        executeRecharge: ExecuteRechargeHandler;
        updateShipment: UpdateShipmentHandler;
    };
    queries: {
        getShipment: GetShipmentHandler;
        listShipments: ListShipmentsHandler;
        getShipmentHistory: GetShipmentHistoryHandler;
    };
}
declare function bootstrapEnterprise(base: Services, config: EnterpriseConfig): EnterpriseServices;

export { AsyncLocalStorageTenantContext, type AuditLogEntry, AuditLogService, CancelShipmentCommand, CancelShipmentHandler, type CancelShipmentResult, type ChaosAttack, CreateShipmentCommand, CreateShipmentHandler, type CreateShipmentResult, type EnterpriseConfig, type EnterpriseServices, ExecuteRechargeCommand, ExecuteRechargeHandler, type ExecuteRechargeResult, GetShipmentHandler, GetShipmentHistoryHandler, GetShipmentHistoryQuery, GetShipmentQuery, HttpChaosTester, type IAuditLogService, type IChaosTester, type ICommand, type ICommandHandler, type IProjectionHandler, type IQuery, type IQueryHandler, type IReadModel, type ITenantContextProvider, ImmutableAuditLog, ListShipmentsHandler, ListShipmentsQuery, PostgresReadModel, RedisStreamsProjection, SchemaIsolationManager, ShipmentProjection, type ShipmentReadModel, SiemExporter, type TenantConfig, type TenantContext, type TenantExtractor, UpdateShipmentCommand, UpdateShipmentHandler, type UpdateShipmentResult, bootstrapEnterprise, createTenantMiddleware };
