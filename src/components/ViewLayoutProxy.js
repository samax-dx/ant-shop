import { useActor } from '@xstate/react';
import React from 'react';

export const ViewLayoutProxy = ({ render: ViewContent, actor }) => {
    const [current, send] = useActor(actor);
    return (<ViewContent actor={current.context.actor} />);
};
