import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";

export const RatePlanAssignService = {
    fetchRecords: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/RatePlan/getRatePlanAssign`,
            { ...payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )
        .then(response => {
            console.log(response);
            const { data } = response;
            console.log(data)

            // if (data.ratePlanAssignments === null) {
            //     data.ratePlanAssignments = [];
            // }
            // if (data.ratePlanAssignments) {
            //     return Promise.resolve(data);
            // } else {
            //     return Promise.reject({ message: data.errorMessage });
            // }
            return data;
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: (typeof data === "string" ? data : data.error) || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        }),

    saveRecord: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/RatePlan/saveRatePlanAssign`,
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

            if (data) {
                console.log(data);
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: data.errorMessage });
            }
        })
        .catch(error => {
            const response = error.response || { data: { error: error.message } };
            const { status: code, statusText: text, data } = response;
            const errorEx = { code, message: (typeof data === "string" ? data : data.error) || text };
            console.log(errorEx);

            return Promise.reject(errorEx);
        }),
    removeRecord: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/RatePlan/removeRatePlanAssign`,
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

            if (+data.deleteCount) {
                return Promise.resolve(data);
            } else {
                return Promise.reject({ message: (typeof data === "string" ? data : data.errorMessage) });
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
