import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
mutation LoginUser($data: LoginInput!){
    login(data: $data){
        name
    }
}
`;