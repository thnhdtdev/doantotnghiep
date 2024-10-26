import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: center;
    height: 44px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
boder: 1px solid #dfe01a;
background: #dfe01a;
color: #032552;
font-weight: 600;
padding: 12px 30px 12px;
font-size:16px
align-item: end;
`

export const WrapperProduct = styled.div`
display:flex;
justify-content:center;
gap:15px;
margin-top:20px;
flex-wrap:wrap;

`