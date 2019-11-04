export default interface ISignupInput {
  body: {
    firstName: string;
    lastName: string;
    password: string;
    tenantId: string;
    username: string;
  };
}
