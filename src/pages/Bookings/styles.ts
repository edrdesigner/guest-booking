import styled from 'styled-components';

export const BookingsContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
`;

export const BookingsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;

  th {
    text-align: left;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: ${(props) => props.theme['gray-400']};
    padding: 0.25rem 2rem;
  }

  td {
    padding: 1.25rem 2rem;
    background: ${(props) => props.theme['gray-700']};

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    &.actions {
      width: 10rem;
    }
  }

  button {
    border: 0;
    background: transparent;
    color: ${(props) => props.theme['gray-100']};
    margin: 0 0.25rem;
    padding: 0.25rem;
    opacity: 0.5;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
`;
