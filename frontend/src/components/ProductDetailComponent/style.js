import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

// export const WrapperStyleImageSmall = styled(Image)`
//     height: 64px;
//     width: 64px
//     justify-content: space-between;
//  `

// export const WrapperStyleNameProduct = styled.h1`
//     font-size: 30px;
//     letter-spacing: 0;
//     margin-bottom: 30px;
//     border: 0;
//     color: #103152;
//  `
export const WrapperStylePrice = styled.div`
    display: flex;
    padding: 20px 10px;
    border: 2px solid #a0abb9;
    border-radius: 10px;
    margin-bottom: 30px;
 `
export const WrapperStylePriceCompare = styled.div`
    
    display: flex;
    text-align: center;
    flex-wrap: wrap;
    gap: 10px;
    `
export const WrapperStylePriceSingle = styled.div`
    flex: 0 0 40%;
    max-width: 40%;
 `
export const WrapperStyleCurPrice = styled.span`
    font-size: 25px;
    font-weight: 600;
    flex: 0 0 100%;
    max-width: 100%;
 `
export const WrapperStylePolicy = styled.div`
    display: flex;
    align-items: center;
 `
export const WrapperStylePolicyText = styled.div`
    padding-left: 10px;
    color: #2d2e7f;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    padding-top: 20px
`
export const WrapperStyleAddToCart = styled.div`

    height: auto;
    font-size: 18px;
    line-height: 1;
    padding: 15px 15px 12px;
    letter-spacing: 0;
    text-transform: unset;
    font-weight: 600;
    cursor:pointer;
`






export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120)
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 10px;
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`
