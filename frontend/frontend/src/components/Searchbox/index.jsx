import React from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";

import styles from "./Searchbox.module.css";

/* 
Usage

options - in the form [{ value: 'value', label: 'label' }]
leftControl - if some component needs to be added at the start of the searchbox
rightControl - if some component needs to be added at the end of the searchbox
 */

const Control = ({ children, selectProps, ...props }) => {
  const { leftControl, rightControl } = selectProps;
  return (
    <components.Control {...props} className={styles.selectContainer}>
      <div className={styles.smallerContainer}>{leftControl}</div>
      {children}
      <div className={styles.smallerContainer}>{rightControl}</div>
    </components.Control>
  );
};

const Searchbox = ({
  creatable,
  options,
  leftControl,
  rightControl,
  ...restProps
}) => {
  const SelectComponent = creatable ? CreatableSelect : Select;
  return (
    <SelectComponent
      isClearable
      options={options}
      rightControl={rightControl}
      leftControl={leftControl}
      components={{
        Control,
        DropdownIndicator: null,
      }}
      {...restProps}
    />
  );
};

export default Searchbox;
