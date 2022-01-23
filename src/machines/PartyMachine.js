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
        actor: [],
        data: null,
    },
    initial: "start"
}, {
    actions: {
        assignListViewActor: assign((ctx, ev) => {
            const actor = ctx.data || spawn(FetchMachine.withConfig({
                services: { doFetch: fetchParties }
            }));

            return { actor, data: actor };
        }),
        assignItemViewActor: assign((ctx, ev) => {
            const actor = spawn(FetchMachine.withConfig({
                services: { doFetch: fetchParty }
            }));

            actor.send({ type: "LOAD", data: ev.data.partyId });

            return { actor };
        }),
        assignItemEditActor: assign((ctx, ev) => {
            const actor = [
                spawn(EditorMachine.withContext({
                    record: ev.data
                })),
                spawn(FetchMachine.withConfig({
                    services: { doFetch: createParty }
                })),
            ];

            return { actor };
        }),
        assignItemAddActor: assign((ctx, ev) => {
            const actor = spawn(EditorMachine.withContext({
                record: {}
            }));

            return { actor };
        }),
    }
});

const fetchParties = (ctx, { data: searchData }) =>
    axios.post(
        "http://localhost:3005/ofbiz",
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
        return { result: result && result.listIt, error };
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return { result: null, error: { code, message: data.error || text } };
    });

const fetchParty = (ctx, { data: searchData }) =>
    axios.post(
        "http://localhost:3005/ofbiz",
        {
            method: "performFind",
            params: {
                entityName: "Party",
                inputFields: {
                    partyId: searchData,
                    partyId_op: "equals"
                }
            }
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(response => {
        const { result, error = null } = response.data;
        return { result: result && result.listIt[0], error };
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return { result: null, error: { code, message: data.error || text } };
    });

const createParty = (ctx, { data: party }) =>
    axios.post(
        "http://localhost:3005/ofbiz",
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
        return { result, error };
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return { result: null, error: { code, message: data.error || text } };
    });
