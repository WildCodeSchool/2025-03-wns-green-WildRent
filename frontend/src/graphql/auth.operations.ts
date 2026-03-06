import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
query LoginUser($data: LoginInput!){
    login(data: $data)
}
`;