import IEntity from "../../../models/IEntity";
import { Nullable } from "../../../libs/customTypes";

export default interface IGetOutput extends IEntity {
  credential: string;
  dbName: Nullable<string>;
}
