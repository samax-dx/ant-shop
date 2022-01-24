import { useActor } from "@xstate/react";

import { PartyList } from "./PartyList";
import { PartyView } from "./PartyView";
import { PartyEdit } from "./PartyEdit";


export const Party = ({ actor }) => {
    const [partyState, sendParty] = useActor(actor);

    return (<>
        <PartyList actor={partyState.context.data} />
        {partyState.matches("itemView") && <PartyView actor={partyState.context.actor} />}
        {["itemEdit", "itemAdd"].includes(partyState.value) && <PartyEdit actor={partyState.context.actor} />}
    </>);
};
