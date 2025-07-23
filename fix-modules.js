const fs = require('fs');
const path = require('path');

// Directorios a crear
const dirsToCreate = [
  'dist/logs',
  'dist/logs/dto',
  'dist/logs/enums',
  'dist/logs/interceptors'
];

// Crear directorios
dirsToCreate.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
});

// Crear archivos básicos para solucionar errores de importación
const filesToCreate = [
  {
    path: 'dist/logs/logs.module.js',
    content: `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModule = void 0;
const common_1 = require("@nestjs/common");
const logs_service_1 = require("./logs.service");
const logs_controller_1 = require("./logs.controller");
const typeorm_1 = require("@nestjs/typeorm");
const log_entity_1 = require("./log.entity");
const logger_helper_service_1 = require("./logger-helper.service");
let LogsModule = class LogsModule {
};
exports.LogsModule = LogsModule;
exports.LogsModule = LogsModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, typeorm_1.TypeOrmModule).forFeature([log_entity_1.Log])],
        controllers: [logs_controller_1.LogsController],
        providers: [logs_service_1.LogsService, logger_helper_service_1.LoggerHelperService],
        exports: [logs_service_1.LogsService, logger_helper_service_1.LoggerHelperService],
    })
], LogsModule);
`
  },
  {
    path: 'dist/logs/logs.service.js',
    content: `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const log_entity_1 = require("./log.entity");
const typeorm_2 = require("typeorm");
let LogsService = class LogsService {
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async create(createLogDto) {
        const log = this.logRepository.create(createLogDto);
        return this.logRepository.save(log);
    }
    async logUserAction(userId, action, entityType, entityId, details = {}) {
        const log = {
            userId,
            action,
            entityType,
            entityId,
            details,
        };
        return this.create(log);
    }
    async logLogin(userId, ipAddress, userAgent) {
        return this.logUserAction(
            userId,
            log_entity_1.LogAction.LOGIN,
            log_entity_1.EntityType.USER,
            userId,
            { ipAddress, userAgent }
        );
    }
    async findAll() {
        return this.logRepository.find({ order: { createdAt: 'DESC' } });
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(log_entity_1.Log)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LogsService);
`
  },
  {
    path: 'dist/logs/logs.controller.js',
    content: `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsController = void 0;
const common_1 = require("@nestjs/common");
const logs_service_1 = require("./logs.service");
let LogsController = class LogsController {
    constructor(logsService) {
        this.logsService = logsService;
    }
    findAll() {
        return this.logsService.findAll();
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findAll", null);
exports.LogsController = LogsController = __decorate([
    (0, common_1.Controller)('logs'),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LogsController);
`
  },
  {
    path: 'dist/logs/logger-helper.service.js',
    content: `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHelperService = void 0;
const common_1 = require("@nestjs/common");
const logs_service_1 = require("./logs.service");
const log_entity_1 = require("./log.entity");
let LoggerHelperService = class LoggerHelperService {
    constructor(logsService) {
        this.logsService = logsService;
    }
    async logLogin(userId, ipAddress, userAgent) {
        return this.logsService.logLogin(userId, ipAddress, userAgent);
    }
    async logLogout(userId, ipAddress) {
        return this.logsService.logUserAction(
            userId,
            log_entity_1.LogAction.LOGOUT,
            log_entity_1.EntityType.USER,
            userId,
            { ipAddress }
        );
    }
    async logReviewCreated(userId, reviewId, productId, rating) {
        return this.logsService.logUserAction(
            userId,
            log_entity_1.LogAction.CREATE,
            log_entity_1.EntityType.REVIEW,
            reviewId,
            { productId, rating }
        );
    }
};
exports.LoggerHelperService = LoggerHelperService;
exports.LoggerHelperService = LoggerHelperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LoggerHelperService);
`
  },
  {
    path: 'dist/logs/log.entity.js',
    content: `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.EntityType = exports.LogAction = void 0;
var LogAction;
(function (LogAction) {
    LogAction["CREATE"] = "CREATE";
    LogAction["UPDATE"] = "UPDATE";
    LogAction["DELETE"] = "DELETE";
    LogAction["LOGIN"] = "LOGIN";
    LogAction["LOGOUT"] = "LOGOUT";
    LogAction["VIEW"] = "VIEW";
    LogAction["EXPORT"] = "EXPORT";
    LogAction["IMPORT"] = "IMPORT";
    LogAction["APPROVE"] = "APPROVE";
    LogAction["REJECT"] = "REJECT";
    LogAction["UPLOAD"] = "UPLOAD";
    LogAction["DOWNLOAD"] = "DOWNLOAD";
    LogAction["ERROR"] = "ERROR";
})(LogAction || (exports.LogAction = LogAction = {}));
var EntityType;
(function (EntityType) {
    EntityType["USER"] = "user";
    EntityType["PRODUCT"] = "product";
    EntityType["ORDER"] = "order";
    EntityType["CATEGORY"] = "category";
    EntityType["REVIEW"] = "review";
    EntityType["CART"] = "cart";
    EntityType["INVOICE"] = "invoice";
})(EntityType || (exports.EntityType = EntityType = {}));
class Log {
}
exports.Log = Log;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Log.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LogAction }),
    __metadata("design:type", String)
], Log.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Log.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EntityType }),
    __metadata("design:type", String)
], Log.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Log.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Log.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "userAgent", void 0);
exports.Log = Log = __decorate([
    (0, typeorm_1.Entity)('logs'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['entityType', 'entityId']),
    (0, typeorm_1.Index)(['createdAt'])
], Log);
`
  }
];

filesToCreate.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  fs.writeFileSync(filePath, file.content, 'utf8');
  console.log(`Created file: ${filePath}`);
});

console.log('Module fix completed successfully!');
