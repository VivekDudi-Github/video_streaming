// import { Router } from 'express';
// import {
//     getSubscribedChannels,
//     getUserChannelSubscribers,
//     toggleSubscription,
// } from "../controllers/subscription.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const subscriptionRouter = Router();
// subscriptionRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// subscriptionRouter.route("/c/: channel_id")
//       .get(getSubscribedChannels)
//       .post(toggleSubscription);

// subscriptionRouter.route("/u/: subscriberId").get(getUserChannelSubscribers);

// export default subscriptionRouter

import { Router } from 'express';
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


router.route("/c/channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/u/subscriberId").get(getUserChannelSubscribers);

export default router;