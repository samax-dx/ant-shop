import axios from "axios";
import { XAuth } from "./XAuth";

const fetchParties = (ctx, { data: searchData }) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/Party/findParties",
        {
            name: searchData,
            name_op: "contains"
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAuth.token()}`,
            }
        }
    ).then(response => {
        const { data } = response;
        return data ? Promise.resolve(data): Promise.reject("Unkonwn result");
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return Promise.reject({ code, message: data.error || text });
    });

const createParty = (ctx, { data: party }) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/Party/createParty",
        { ...party },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAuth.token()}`,
            }
        }
    ).then(response => {
        const { data } = response;

        if (data.id) {
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
