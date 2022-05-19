import { useActor } from "@xstate/react";
import { Menu } from "antd";

export function TopMenu({ actor }) {
    const [appState, sendApp] = [actor.getSnapshot(), actor.send];

    return <Menu mode="horizontal" className="menu" selectedKeys={[appState.value]} style={{direction: "rtl"}}>
        <Menu.Item key="logout" onClick={() => sendApp({ type: 'LOGOUT' })}>Logout</Menu.Item>
    </Menu>;
}
