import apiResponse from "../../common/utils/api-response.js";
import * as guestService from "./guest.service.js";

const registerGuest = async (req, res) => {
  const result = await guestService.registerGuest(req.body);
  apiResponse.created(res, "Guest registered successfully", result);
};

const getAllGuests = async (req, res) => {
  const { restaurantSlug, limit, skip } = req.query;
  const guests = await guestService.getAllGuests({
    restaurantSlug,
    limit: limit ? parseInt(limit) : 100,
    skip: skip ? parseInt(skip) : 0,
  });
  apiResponse.ok(res, "Guests fetched", guests);
};

export { registerGuest, getAllGuests };
