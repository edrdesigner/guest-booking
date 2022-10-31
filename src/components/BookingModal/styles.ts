import styled from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

export const Content = styled(Dialog.Content)`
  min-width: 32rem;
  border-radius: 6px;
  padding: 2.5rem 3rem;
  background-color: ${({ theme }) => theme['gray-800']};

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  h2 {
    font-weight: bold;
    font-size: 1.2rem;
  }

  form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    span {
      color: ${({ theme }) => theme['red-300']};
      font-size: 0.85rem;
      margin-top: -0.5rem;
    }

    label {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: ${({ theme }) => theme['gray-300']};
      display: block;
    }

    input {
      border-radius: 6px;
      border: 0;
      background: ${({ theme }) => theme['gray-900']};
      color: ${({ theme }) => theme['gray-300']};
      padding: 1rem;
      width: 100%;

      &::placeholder {
        color: ${({ theme }) => theme['gray-500']};
      }

      &.has-error {
        box-shadow: 0 0 0 2px ${({ theme }) => theme['red-500']};
      }
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(0.5);
    }

    button[type='submit'] {
      height: 58px;
      border: 0;
      background: ${({ theme }) => theme['green-500']};
      color: ${({ theme }) => theme['white']};
      font-weight: bold;
      border-radius: 6px;
      margin-top: 1.5rem;
      cursor: pointer;

      &:hover {
        background: ${({ theme }) => theme['green-700']};
        transition: background-color 0.2s;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;

export const CloseButton = styled(Dialog.Close)`
  position: absolute;
  background: transparent;
  border: 0;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;
  line-height: 0;
  color: ${({ theme }) => theme['gray-500']};
`;
