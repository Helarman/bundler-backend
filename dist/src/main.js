"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const fs_1 = require("fs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: [
                    "'self'",
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:8080",
                    "https://api.mainnet-beta.solana.com",
                    "https://api.jup.ag",
                    "85.239.147.232:3000"
                ]
            }
        }
    }));
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001', 'https://bundler-frontend-tlkm.onrender.com', "85.239.147.232:3000"],
        credentials: true,
        allowedHeaders: [
            'Authorization',
            'Content-Type',
            'X-Requested-With'
        ],
        exposedHeaders: ['Authorization']
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Bundler API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    (0, fs_1.writeFileSync)('./swagger-spec.json', JSON.stringify(document, null, 2));
    await app.listen(5000);
}
bootstrap();
