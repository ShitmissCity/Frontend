import { Tooltip as BsTooltip } from 'bootstrap';
import { useEffect, useRef, cloneElement, ReactElement } from 'react';

export default function Tooltip(props: { text: string, children: ReactElement }) {
    const childRef = useRef<Element>();

    useEffect(() => {
        const tooltip = new BsTooltip(childRef.current!, {
            title: props.text,
            placement: 'bottom',
            trigger: 'hover'
        })
        return () => tooltip.dispose();
    }, [props.text]);

    return cloneElement(props.children, { ref: childRef });
}