import styled from 'styled-components';
interface ButtonProps {
  active: boolean;
}

export default styled.button<ButtonProps>`
  background-color: ${(props) => (props.active ? '#333' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border: 1px solid #eee;
`;
