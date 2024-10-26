import { Button, Input } from "antd";
import styled from "styled-components";

export const WrapperLoginContainer = styled.div`
max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`
export const WrapperButton = styled(Button)`
width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`
export const WrapperInput = styled(Input)`
width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`
export const WrapperLinkButton = styled(Button)`
background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
`
export const WrapperBackToLogin = styled.div`
text-align: center;
  margin-top: 15px;
`