"use client";
import { DefaultOf, Slice } from "@shared/util-client";
import { Field } from "@shared/ui-web";
import { Utils } from "@shared/util";
import React, { ReactNode, useEffect } from "react";

interface DataEditFieldProps<T extends string, State, SL extends Slice<T, State>, M extends { id: string }> {
  slice: SL;
  renderTitle: (form: DefaultOf<M>) => string;
  children?: ReactNode;
}

export const DataEditField = <T extends string, State, SL extends Slice<T, State>, M extends { id: string }>({
  slice,
  children,
  renderTitle,
}: DataEditFieldProps<T, State, SL, M>) => {
  const modelForm = slice.use[`${slice.refName}Form` as any]();
  const modelSubmit = slice.use[`${slice.refName}Submit` as any]();
  useEffect(() => {
    slice.do[`check${Utils.capitalize(slice.refName)}Submitable` as any]();
  }, [modelForm]);

  return (
    <div>
      <Field.Container>
        {children}
        <button
          onClick={() => {
            slice.do[`submit${Utils.capitalize(slice.refName)}` as any]();
          }}
        >{`+ Add ${slice.refName}`}</button>
      </Field.Container>
    </div>
  );
};
