import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";
import {SpList} from "../Util";


export const Party = {
    fetchParties: (ctx, ev) => axios
        .post(
            `${SERVER_URL}/Party/findParties`,
            { ...ev.data },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )
        .then(response => {
            const { data } = response;

            if (data.parties === null) {
                data.parties = [];
            }

            if (data.parties) {
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
    createParty: (ctx, ev) => axios
        .post(
            `${SERVER_URL}/Party/createParty`,
            { ...ev.data },
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
    createUser: (data) => (console
    .log(
            `${SERVER_URL}/Party/createUser`,
            { ...data },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )|| Promise.resolve({ data: { user: {userId:Date.now()+'',username:data.username,roles:data.roles} } })||Promise.reject({ error: { response: { data: {message:"Invalid data", code:"invalid_parameter"} } } }))
        .then(response => {
            console.log(response);
            const { data: result } = response;
            if(!result.error){
                console.log(result.user)
                return result.user;
            }else {
                return result.error
            }
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            return error;
        }),
    findUsers: (data) => (console
        .log(
            `${SERVER_URL}/Party/findUsers`,
            { ...data },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${XAuth.token()}`,
                }
            }
        )|| !Promise.resolve({userId:Date.now()+'',username:data.username,roles:data.roles})||Promise.reject({message:"Invalid data", code:"invalid_parameter"}))
        .then(response => {
            // console.log(response.data);
            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);

            const { data: result } = response;

            if (!result.error) {
                return SpList.create(result.users, result.count);
            } else {
                return result.error;
            }
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            return error;
        })
};
