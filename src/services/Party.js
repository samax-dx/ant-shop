import axios from "axios";
import { XAuth } from "./XAuth";

const fetchParties = (ctx, ev) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/Party/findParties",
        { ...ev.data },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAuth.token()}`,
            }
        }
    ).then(response => {
        const { data } = response;

        if (data.parties === null) {
            data.parties = [];
        }

        if (data.parties) {
            return Promise.resolve(data);
        } else {
            return Promise.reject({ message: data.errorMessage });
        }
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return Promise.reject({ code, message: data.error || text });
    });

const createParty = (ctx, ev) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/Party/createParty",
        { ...ev.data },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAuth.token()}`,
            }
        }
    ).then(response => {
        const { data } = response;

        if (data.partyId) {
            return Promise.resolve(data);
        } else {
            return Promise.reject({ message: data.errorMessage });
        }
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return Promise.reject({ code, message: data.error || text });
    });

export const Party = {
    fetchParties,
    createParty
};
