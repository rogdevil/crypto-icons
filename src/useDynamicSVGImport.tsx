import React, { useEffect, useRef, useState } from "react";
import { DynamicSVGImportOptions } from "./types/interfaces";
import DefaultIcon from "!!@svgr/webpack?+svgo,+titleProp,+ref!./assets/default.svg";

export default function useDynamicSVGImport(
    name: string,
    options: DynamicSVGImportOptions = {},
) {
    const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();
    const [exists, setExists] = useState(false);

    const { onCompleted, onError } = options;

    useEffect(() => {
        setLoading(true);
        const importIcon = async (): Promise<void> => {
            try {
                ImportedIconRef.current = (
                    await import(
                        `!!@svgr/webpack?+svgo,+titleProp,+ref!./assets/${name}.svg`
                    )
                ).default;
                onCompleted?.(name, ImportedIconRef.current);
                setExists(true);
            } catch (err) {
                console.log("ERROR", err.message);
                if (err.message.includes("Cannot find module")) {
                    ImportedIconRef.current = DefaultIcon;
                    onCompleted?.(name, ImportedIconRef.current);
                } else {
                    onError?.(err);
                    setError(err);
                }
            } finally {
                setLoading(false);
            }
        };
        importIcon();
    }, [name, onCompleted, onError]);

    return { exists, error, loading, SvgIcon: ImportedIconRef.current };
}
