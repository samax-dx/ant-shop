import {createOrUpdateMocked, findListMocked} from "../Util";
import axios from "axios";
import {SERVER_URL} from "../config";
import {XAuth} from "./XAuth";



export const SenderIdService = {
   fetchRecords: (payload) =>  console.log(payload) || axios
       .post(
           `${SERVER_URL}/SenderId/getAllSenderIds`,
           { ...payload },
           {
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${XAuth.token()}`,
               }
           }
       )
       // Promise.resolve(findListMocked(senderIds, payload, "senderId", "senderIds"))//senderId.includes(payload.senderId)))
       .then(response => {
           const { data } = response;
           console.log(data)

           if (data.senderIds) {
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
       }),
   saveRecord: (payload) => console.log(payload) || axios
       .post(
           `${SERVER_URL}/SenderId/saveSenderId`,
           { ...payload },
           {
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${XAuth.token()}`,
               }
           }
       )
       //createOrUpdateMocked(senderIds, "senderId", payload).then(({record}) => ({ data: record }))
       .then(response => {
           const { data } = response;
           console.log(data)

           if (data.senderId) {
               return Promise.resolve(data/*{ ...response, senderIdId: data.senderIdId }*/);
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
       }),
    removeRecord: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/SenderId/deleteSenderId`,
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

            if (data.status.toString() === "Success") {
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
        })
};
