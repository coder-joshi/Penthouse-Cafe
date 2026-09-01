import apiResponse from "../../common/utils/api-response.js";
import * as menuService from "./menu.service.js";

const getAllMenuItems = async (req, res) => {
  const { restaurantSlug, onlyAvailable } = req.query;
  const items = await menuService.getAllMenuItems(restaurantSlug || "penthouse-cafe", {
    onlyAvailable: onlyAvailable === "true",
  });
  apiResponse.ok(res, "Menu items fetched", items);
};

const getMenuItemById = async (req, res) => {
  const item = await menuService.getMenuItemById(req.params.id);
  apiResponse.ok(res, "Menu item fetched", item);
};

const createMenuItem = async (req, res) => {
  const item = await menuService.createMenuItem(req.body);
  apiResponse.created(res, "Menu item created", item);
};

const updateMenuItem = async (req, res) => {
  const item = await menuService.updateMenuItem(req.params.id, req.body);
  apiResponse.ok(res, "Menu item updated", item);
};

const deleteMenuItem = async (req, res) => {
  await menuService.deleteMenuItem(req.params.id);
  apiResponse.ok(res, "Menu item deleted");
};

const toggleAvailability = async (req, res) => {
  const item = await menuService.toggleAvailability(req.params.id);
  apiResponse.ok(res, `Menu item ${item.isAvailable ? "enabled" : "disabled"}`, item);
};

export {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
