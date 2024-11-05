"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRoutes = void 0;
const express_1 = require("express");
const createNotificationsController_1 = require("../modules/notifications/useCases/Notifications/createNotifications/createNotificationsController");
const notificationsRoutes = (0, express_1.Router)();
exports.notificationsRoutes = notificationsRoutes;
const createNotificationsController = new createNotificationsController_1.CreateNotificationsController();
notificationsRoutes.post('/create', createNotificationsController.handle);
