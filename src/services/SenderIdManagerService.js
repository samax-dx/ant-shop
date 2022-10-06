import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";

export const SenderIdManagerService = {
    fetchRecords: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/Party/findParties`,
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

            if (data.parties === null) {
                data.parties = [];
            }

            if (data.parties) {
                return Promise.resolve(data);  //
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
    saveRecord: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/Party/createParty`,
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

            if (data.partyId) {
                console.log(data)
                return Promise.resolve({ ...response, partyId: data.partyId });
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
};
