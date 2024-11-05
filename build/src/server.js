"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const AppError_1 = require("./errors/AppError");
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("../swagger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ type: 'application/json' }));
app.use(routes_1.router);
// Tratamento de erro
app.use((err, req, res, next) => {
    // Erros instanciados na classe AppError, ex throw new AppError(lalala)
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    console.log(err);
    // Erro sem instanciar na classe App Error ex Throw new Error(lalala)
    return res.status(500).json({
        status: 'error',
        message: `⛔ Internal Server Error: ${err.message}⛔`
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.listen(8081, () => console.log('System working... 🦥'));
