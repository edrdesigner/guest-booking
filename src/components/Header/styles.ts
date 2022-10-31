import styled from 'styled-components';

export const HeaderContainer = styled.header`
  background: ${(props) => props.theme['gray-900']};
  padding: 1rem 0;
`;

export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  H2 {
    color: ${(props) => props.theme['green-500']};
    font-weight: bold;
    font-size: 1.5rem;

    span {
      color: ${(props) => props.theme['gray-100']};
    }
  }
`;

export const NewButton = styled.button`
  height: 50px;
  border: 0;
  background: ${(props) => props.theme['green-500']};
  color: ${(props) => props.theme.white};
  font-weight: bold;
  padding: 0 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  

  &:hover {
    background: ${(props) => props.theme['green-700']};
    transition: background-color 0.2s linear;
  }
`;
