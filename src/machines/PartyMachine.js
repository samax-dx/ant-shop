import axios from "axios";
import { assign, createMachine, send, spawn } from "xstate";
import { EditorMachine } from "./EditorMachine";
import { FetchMachine } from "./FetchMachine";
import { NullMachine } from "./NullMachine";


export const PartyMachine = createMachine({
    states: {
        start: {
            entry: send({ type: "VIEW_LIST" })
        },
        listView: {},
        itemView: {},
        itemEdit: {},
        itemAdd: {},
    },
    on: {
        "VIEW_LIST": { target: "listView", actions: ["assignListViewActor"] },
        "VIEW_ITEM": { target: "itemView", actions: ["assignItemViewActor"] },
        "EDIT_ITEM": { target: "itemEdit", actions: ["assignItemEditActor"] },
        "ADD_ITEM": { target: "itemAdd", actions: ["assignItemAddActor"] },
    },
    context: {
        actor: null,
    },
    initial: "start"
}, {
    actions: {
        assignListViewActor: assign((ctx, ev) => {
            const actor = ctx._listViewActor || spawn(FetchMachine.withConfig({
                services: { doFetch: fetchParties }
            }));

            return { actor, _listViewActor: actor };
        }),
        assignItemViewActor: assign((ctx, ev) => {
            const actor = spawn(NullMachine.withContext({
                ...NullMachine.context, party: ev.data
            }));

            return { actor };
        }),
        assignItemEditActor: assign((ctx, ev) => {
            const actor = [
                spawn(EditorMachine.withContext({
                    ...EditorMachine.context, record: ev.data
                })),
                spawn(FetchMachine.withConfig({
                    services: { doFetch: createParty }
                })),
            ];

            return { actor };
        }),
        assignItemAddActor: assign((ctx, ev) => {
            const actor = [
                spawn(EditorMachine.withContext({
                    ...EditorMachine.context, record: {}
                })),
                spawn(FetchMachine.withConfig({
                    services: { doFetch: createParty }
                })),
            ];

            return { actor };
        }),
    }
});

const fetchParties = (ctx, { data: searchData }) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/runService",
        {
            method: "performFind",
            params: {
                entityName: "PartyNameView",
                inputFields: {
                    groupName: searchData,
                    groupName_op: "contains"
                }
            }
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(response => {
        const { result, error = null } = response.data;
        return error ? Promise.reject(error) : result && result.listIt;
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return Promise.reject({ code, message: data.error || text });
    });

const createParty = (ctx, { data: party }) =>
    axios.post(
        "https://localhost:8443/ofbiz-spring/api/runService",
        {
            "method": "spCreateParty",
            "params": {
                "name": party.groupName,
                "role.roleTypeId": "CUSTOMER",
                "contactMech.countryCode": "880",
                "contactMech.areaCode": "",
                "contactMech.contactNumber": "1717590703",
                "contactMech.extension": ""
            }
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(response => {
        const { result, error = null } = response.data;
        return error ? Promise.reject(error) : result;
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return Promise.reject({ code, message: data.error || text });
    });
