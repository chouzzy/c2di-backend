"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRoutes = void 0;
const express_1 = require("express");
const CreateNotificationsController_1 = require("../modules/notifications/useCases/Notifications/createNotifications/CreateNotificationsController");
const ListNotificationsController_1 = require("../modules/notifications/useCases/Notifications/listNotifications/ListNotificationsController");
const ReadNotificationsController_1 = require("../modules/notifications/useCases/Notifications/readNotifications/ReadNotificationsController");
const ListUserNotificationsController_1 = require("../modules/notifications/useCases/Notifications/listUserNotifications/ListUserNotificationsController");
const notificationsRoutes = (0, express_1.Router)();
exports.notificationsRoutes = notificationsRoutes;
const createNotificationsController = new CreateNotificationsController_1.CreateNotificationsController();
notificationsRoutes.post('/create', createNotificationsController.handle);
const listNotificationsController = new ListNotificationsController_1.ListNotificationsController();
notificationsRoutes.get('/list/:id', listNotificationsController.handle);
const listUserNotificationsController = new ListUserNotificationsController_1.ListUserNotificationsController();
notificationsRoutes.get('/users/list', listUserNotificationsController.handle);
const readNotificationsController = new ReadNotificationsController_1.ReadNotificationsController();
notificationsRoutes.put('/update/:id', readNotificationsController.handle);
