/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface LoginMutationVariables {
  username: string,
  password: string,
};

export interface LoginMutation {
  login:  {
    token: string | null,
    user:  {
      firstName: string | null,
      lastName: string | null,
    } | null,
  } | null,
};
