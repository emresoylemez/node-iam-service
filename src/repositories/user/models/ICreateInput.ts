import { IVersionableCreateInput } from "../../versionable/models";

export default interface ICreateInput extends IVersionableCreateInput {
  username: string;
  password: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  accessToken?: string;
}
