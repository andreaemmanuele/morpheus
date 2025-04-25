import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container } from './Container.js';
import { Content } from './Content.js';
export const Header = ({ title = '' }) => (_jsx("header", { style: {
        backgroundColor: '#FFF',
        borderBottom: '1px solid #EAEAEA',
    }, children: _jsx(Container, { children: _jsxs(Content, { children: [_jsx("img", { width: "160px", src: "https://res.cloudinary.com/dnftznvvt/image/upload/v1745334024/morpheus-logo_s5qfxz.png", alt: "" }), _jsx("h1", { style: {
                        fontSize: '35px',
                        color: '#000',
                        lineHeight: 1,
                        margin: '15px 0 0 0',
                    }, children: title })] }) }) }));
