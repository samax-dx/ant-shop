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

export const AccountingService = ({
    fetchBalanceRequests: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/Accounting/listBalanceRequests`,
            { orderBy: "date DESC", ...payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )
        .then(response => {
            const { data } = response;
            console.log(data)

            if (data.payments) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ code: null, message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: data.error || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        }),
    handleBalanceRequest: (payload) => axios
        .post(
            `${SERVER_URL}/ofbiz-spring/api/Accounting/${balanceActionHandler(payload.action)}`,
            { paymentId: payload.paymentId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )
        .then(response => {
            const { data } = response;
            console.log(data)

            if (data.paymentId) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: data.error || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        }),
    addPartyBalance: (payload) =>console.log(payload) || axios
        .post(
            `${SERVER_URL}/Accounting/addPartyBalance`,
            { ...payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )
        .then(response => {
            const { data } = response;
            console.log(data)

            if (data.paymentId) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: data.error || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        })
});
