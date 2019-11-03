import * as mongoose from "mongoose";

import IUserDocument from "./IUserDocument";
import UserSchema from "./UserSchema";

/**
 * Client Schema
 */
const userSchema = new UserSchema(
  {
    id: String
  },
  {
    collection: "Users",
    versionKey: false
  }
);

/**
 * indexes
 */
userSchema.index({ username: 1, tenantId: 1, deletedAt: 1 }, { unique: true });

/**
 * @typedef User
 */
export const userModel: mongoose.Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);
