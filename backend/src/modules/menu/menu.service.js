import MenuItem from "./menu.model.js";
import ApiError from "../../common/utils/api-error.js";

const getAllMenuItems = async (restaurantSlug, { onlyAvailable = false } = {}) => {
  const filter = { restaurantSlug };
  if (onlyAvailable) filter.isAvailable = true;
  return MenuItem.find(filter).sort({ category: 1, createdAt: 1 });
};

const getMenuItemById = async (id) => {
  const item = await MenuItem.findById(id);
  if (!item) throw ApiError.notfound("Menu item not found");
  return item;
};

const createMenuItem = async (data) => {
  return MenuItem.create(data);
};

const updateMenuItem = async (id, data) => {
  const item = await MenuItem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) throw ApiError.notfound("Menu item not found");
  return item;
};

const deleteMenuItem = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id);
  if (!item) throw ApiError.notfound("Menu item not found");
};

const toggleAvailability = async (id) => {
  const item = await MenuItem.findById(id);
  if (!item) throw ApiError.notfound("Menu item not found");
  item.isAvailable = !item.isAvailable;
  await item.save();
  return item;
};

export {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
