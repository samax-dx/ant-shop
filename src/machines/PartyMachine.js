import { assign, createMachine, send, spawn } from "xstate";
import { Party } from "../services/Party";
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
            const actor = ctx._listViewActor || spawn(FetchMachine.withConfig(
                {
                    services: { doFetch: Party.fetchParties }
                },
                {
                    error: { message: "Waiting for Party Search" }
                }
            ));

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
                spawn(FetchMachine.withConfig(
                    {
                        services: { doFetch: Party.createParty }
                    },
                    { error: null }
                )),
            ];

            return { actor };
        }),
        assignItemAddActor: assign((ctx, ev) => {
            const actor = [
                spawn(EditorMachine.withContext({
                    ...EditorMachine.context, record: {}
                })),
                spawn(FetchMachine.withConfig(
                    {
                        services: { doFetch: Party.createParty }
                    },
                    { error: null }
                )),
            ];

            return { actor };
        }),
    }
});
