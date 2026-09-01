import crypto from "crypto";
import Guest from "./guest.model.js";
import ApiError from "../../common/utils/api-error.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateSessionToken = () => crypto.randomBytes(32).toString("hex");

/**
 * Register a guest at a table. Creates a Guest document and returns a raw
 * session token for the client (the hashed version is stored in the DB).
 */
const registerGuest = async ({
  name,
  email,
  phone,
  tableNumber,
  restaurantSlug,
  isCouple = false,
  partnerName,
  partnerEmail,
  partnerPhone,
}) => {
  const rawToken = generateSessionToken();
  const hashedToken = hashToken(rawToken);

  const guest = await Guest.create({
    name,
    email,
    phone,
    tableNumber,
    restaurantSlug,
    isCouple,
    partnerName: isCouple ? partnerName : null,
    partnerEmail: isCouple ? partnerEmail : null,
    partnerPhone: isCouple ? partnerPhone : null,
    sessionToken: hashedToken,
  });

  return {
    guestId: guest._id,
    guestName: guest.name,
    tableNumber: guest.tableNumber,
    restaurantSlug: guest.restaurantSlug,
    sessionToken: rawToken, // raw token goes to client
  };
};

/**
 * Validate a raw session token. Returns the guest document or throws.
 * Used by guestAuth middleware.
 */
const validateGuestToken = async (rawToken) => {
  if (!rawToken) throw ApiError.unauthorized("Guest session token missing");

  const hashedToken = hashToken(rawToken);
  const guest = await Guest.findOne({ sessionToken: hashedToken }).select(
    "+sessionToken"
  );

  if (!guest) throw ApiError.unauthorized("Invalid or expired guest session");
  return guest;
};

/**
 * List all guests — admin use only (marketing / analytics).
 */
const getAllGuests = async ({ restaurantSlug, limit = 100, skip = 0 } = {}) => {
  const filter = {};
  if (restaurantSlug) filter.restaurantSlug = restaurantSlug;
  return Guest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export { registerGuest, validateGuestToken, getAllGuests };
