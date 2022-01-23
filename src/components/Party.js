import { useActor } from "@xstate/react";

import { PartyList } from "./PartyList";
import { PartyView } from "./PartyView";
import { PartyEdit } from "./PartyEdit";


export const Party = ({ actor }) => {
    const [current, send] = useActor(actor);

    return (<>
        <PartyList actor={current.context.data} />
        {current.matches("itemView") && <PartyView actor={current.context.actor} />}
        {["itemEdit", "itemAdd"].includes(current.value) && <PartyEdit actor={current.context.actor} />}
    </>);
};
