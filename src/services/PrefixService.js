import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";

export const PrefixService = {
    fetchRecords: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/Prefix/listPrefixes`,
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



            if (data.prefixes === null) {
                data.prefixes = [];
            }
            if (data.prefixes) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        }),
    saveRecord: (payload) => axios
        .post(
            `${SERVER_URL}/Prefix/savePrefix`,
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
            console.log(data);

            if (data.prefix) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        })
};
