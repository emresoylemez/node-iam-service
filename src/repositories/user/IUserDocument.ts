import { Document } from "mongoose";
import IEntity from "../../models/IEntity";

export default interface IUserDocument extends Document, IEntity {
  id: string;
  createdAt: Date;
  deletedAt: Date;
  firstName: string;
  lastName: string;
  originalId: string;
  password: string;
  username: string;
  tenantId: string;
  accessToken: string;
}
