import React from "react";
import { WORD_LENGTH } from "./constants";
import { blankArray } from "./helpers";

export function NextWordRow() {
    return <div className="NextWordRow">
        {blankArray(WORD_LENGTH).map((_, i) =>
            <span key={i} className="cell">
                &nbsp;
            </span>
        )}
    </div>;
}
