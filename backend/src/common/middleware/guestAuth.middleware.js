import { validateGuestToken } from "../../modules/guest/guest.service.js";

/**
 * Middleware to authenticate guest requests using the raw session token
 * sent in the `x-guest-token` header.
 *
 * Attaches `req.guest` with the full Guest document on success.
 */
const authenticateGuest = async (req, res, next) => {
  const rawToken = req.headers["x-guest-token"];
  req.guest = await validateGuestToken(rawToken);
  next();
};

export { authenticateGuest };
