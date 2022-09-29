import axios from "axios";
import { SERVER_URL } from "../config";
import { XAuth } from "./XAuth";


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
        )|| Promise.resolve({userId:'1001',username:data.username,roles:data.roles})||Promise.reject({message:'user roles not found', code:"invalid_parameter"}))
        .then(user => {
            const {data} = user;
            if(data.userId) {
                return Promise.resolve(data.userId);
            }else{
                return Promise.reject({message:'user not valid'})
            }
            // return user
        })
        .catch(error => {
            return Promise.reject({message:error})
           // return error
        })
};
