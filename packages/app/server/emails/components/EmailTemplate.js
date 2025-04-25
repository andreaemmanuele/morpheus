import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from './Header.js';
import { Container } from './Container.js';
import { Content } from './Content.js';
export const EmailTemplate = ({ title = '', content = '', }) => (_jsxs("html", { children: [_jsx(Header, { title: title }), _jsx("body", { style: {
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1.6,
                background: '#f8f8f8',
                color: '#333',
                margin: 0,
                padding: 0,
            }, children: _jsxs(Container, { children: [_jsx(Content, { children: _jsx("div", { style: {
                                marginBottom: '25px',
                                fontSize: '18px',
                            }, children: content }) }), _jsx("footer", { style: {
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '100px',
                            paddingBottom: '20px',
                        }, children: _jsxs("p", { children: ["Morpheus \u00A9 ", new Date().getFullYear(), ". All rights reserved."] }) })] }) })] }));
