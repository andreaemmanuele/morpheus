import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { EmailTemplate } from '../components/EmailTemplate.js';
import { Button } from '../components/Button.js';
export const AccountLocked = ({ token = '' }) => (_jsx(EmailTemplate, { title: "ACCOUNT SUSPENDED", content: _jsxs(_Fragment, { children: [_jsxs("p", { children: ["Your account has been blocked for ", _jsx("strong", { children: "suspicious activity" }), ". If it wasn't you, please, unlock your account by clicking the button below."] }), _jsx("p", { children: "We recommend strongly to change your password." }), _jsx("div", { style: { paddingTop: '50px' }, children: _jsx(Button, { href: `${process.env.BASE_URL}/api/auth/unlock-account/${token}`, children: "Unlock your account" }) })] }) }));
