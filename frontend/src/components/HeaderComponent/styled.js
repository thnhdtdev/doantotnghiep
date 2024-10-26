import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`

padding:10px 120px;
background-color: #;
align-items: center;
text-align:center;
`

export const WrapperTextHeader = styled.span`
font-size: 25px;
color: #224F71;
font-weight: bold
`

export const WrapperAcccount = styled.div`
display: flex;
align-item: center;
font-size: 9px;
text-align: center;
padding-left: 20px
`

export const WrapperTextHeaderSmall = styled.span`
font-size: 9px;
`
export const WrapperContentPopup = styled.p`
cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`
