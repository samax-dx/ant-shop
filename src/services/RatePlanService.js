import {createOrUpdateMocked, findListMocked} from "../Util";
import axios from "axios";
import {SERVER_URL} from "../config";
import {XAuth} from "./XAuth";


export const RatePlanService = {
   fetchRecords: (payload) =>  console.log(payload) || axios
       .post(
           `${SERVER_URL}/RatePlan/getRatePlans`,
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

           if (data.ratePlans) {
               return Promise.resolve(data);
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
           `${SERVER_URL}/RatePlan/saveRatePlan`,
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
               return Promise.resolve(data);
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
    removeRecord: (payload) => console.log(payload) || axios
        .post(
            `${SERVER_URL}/RatePlan/removeRatePlan`,
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
