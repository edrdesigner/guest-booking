import * as Dialog from '@radix-ui/react-dialog';
import { HeaderContainer, HeaderContent, NewButton } from './styles';

interface HeaderProps {
  onNew: () => void;
}

export function Header({ onNew }: HeaderProps) {
  return (
    <HeaderContainer>
      <HeaderContent>
        <h2>Simple<span>.Bookings</span></h2>
        <NewButton onClick={onNew}>New booking</NewButton>
      </HeaderContent>
    </HeaderContainer>
  );
}
