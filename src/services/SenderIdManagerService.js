import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";
import {SpList} from "../Util";

export const SenderIdManagerService = {
    fetchRecords: (payload) => axios
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
            console.log(response)
            const { data } = response;
            data.page=1;
            data.limit=10;

            if (data.parties === null) {
                data.parties = [];
            }

            if (data.parties) {
                console.log(data)
                return Promise.resolve(data);  //
            } else {
                return Promise.reject({ code: null, message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            return Promise.reject({ code, message: data.error || text });
        }),
    saveRecord: (payload) => axios
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
            return Promise.reject({ code, message: data.error || text });
        })
};
