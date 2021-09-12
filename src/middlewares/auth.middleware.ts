import { NextFunction, Request, Response } from "express";
import config from "config";

const allowedDomains: string[] = config.get("domains");

const checkHost = (req: Request, res: Response, next: NextFunction) => {
  // wildcard enabled, accept from all hosts
  if (!allowedDomains.includes("*")) {
    const host = req.headers["x-host"];

    if (!host || allowedDomains.findIndex((i) => (host as string).match(new RegExp(i))) === -1) {
      // check if any hostname does not match any regexp from config
      res.sendStatus(401);
      return;
    }
  }
  next();
};

export default checkHost;
