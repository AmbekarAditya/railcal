import React, { ComponentType } from 'react';

interface WithFocusManagementProps {
  onFocusComplete: () => void;
}

function withFocusManagement<P>(WrappedComponent: ComponentType<P>) {
  return function WithFocusManagement(props: P & WithFocusManagementProps) {
    const { onFocusComplete, ...restProps } = props;

    const handleChange = (value: any) => {
      if (props.onChange) {
        props.onChange(value);
      }
      onFocusComplete();
    };

    return <WrappedComponent {...restProps as P} onChange={handleChange} />;
  };
}

export default withFocusManagement;