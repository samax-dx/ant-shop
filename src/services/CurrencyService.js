import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";

export const CurrencyService = {
    fetchRecords: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/RatePlan/getCurrency`,
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

            if (data.currency === null) {
                data.currency = [];
            }

            if (data.currency) {
                return Promise.resolve(data);  //
            } else {
                return Promise.reject({ code: null, message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: (typeof data === "string" ? data : data.error) || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        })
};