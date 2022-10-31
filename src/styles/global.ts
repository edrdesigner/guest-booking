import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
 * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
 }

:focus {
  outline: 0;
  box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
}

 body {
  background: ${(props) => props.theme['gray-800']};
  color: ${(props) => props.theme['gray-100']};;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
 }

 body, input, textarea, button, h2 {
  font: 400 1rem 'Roboto', sans-serif;
 }
`;
