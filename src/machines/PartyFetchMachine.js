import { createFetchMachine } from "./FetchMachine";

export const PartyFetchMachine = createFetchMachine(async searchData => {
    try {
        const response = await fetch("http://localhost:3005/ofbiz", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            },
            body: JSON.stringify({
                method: "performFind",
                params: {
                    entityName: "PartyNameView",
                    inputFields: {
                        groupName: searchData,
                        groupName_op: "contains"
                    }
                },
                mode: 'cors',
            })
        });

        const { ok: success, status: code, statusText: message } = response;
        const { result } = await (success ? response.json() : {});
        const error = success ? null : { code, message };

        return { result: result && result.listIt, error };
    } catch (error) {
        return { result: null, error };
    }
}, { message: "Waiting for Party Search" });
