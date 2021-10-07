import { gql } from "@apollo/client";

// export const COUNTRY = gql`
//   fragment Country on Country {
//     code
//     name
//     native
//     phone
//     continent {
//       code
//       name
//     }
//     capital
//     currency
//     languages {
//       code
//       name
//       native
//     }
//     emoji
//     emojiU
//     states {
//       name
//     }
//   }
// `;

export const GET_COUNTRIES = gql`
  query countriesQuery {
    countries {
      code
      name

      states {
        name
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query countryQuery($code: String) {
    country(code: $code) {
      code
      name
      native
      phone
      continent {
        code
        name
      }
      capital
      currency
      languages {
        code
        name
        native
      }
      emoji
      emojiU
      states {
        name
      }
    }
  }
`;
