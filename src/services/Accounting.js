import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";

const balanceActionHandler = action => {
    const endpoint = {
        confirm: "addPartyBalanceConfirm",
        cancel: "addPartyBalanceCancel"
    }[action];

    return endpoint ? endpoint : "__404__";
}

export const Accounting = ({
    fetchBalanceRequests: (ctx, ev) => axios
        .post(
            `${SERVER_URL}/Accounting/listBalanceRequests`,
            { ...ev.data },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        ).then(response => {
            const { data } = response;

            if (data.payments) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        }).catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        }),
    handleBalanceRequest: (ctx, ev) => axios
        .post(
            `https://localhost:8443/ofbiz-spring/api/Accounting/${balanceActionHandler(ev.action)}`,
            { paymentId: ev.data.paymentId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        ).then(response => {
            const { data } = response;

            if (data.paymentId) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        }).catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        }),
    addPartyBalance: (ctx, ev) => axios
        .post(
            `${SERVER_URL}/Accounting/addPartyBalance`,
            { ...ev.data },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        ).then(response => {
            const { data } = response;

            if (data.paymentId) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        }).catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        })
});
