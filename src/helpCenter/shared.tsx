import React from 'react';
import { Icon as AntdIcon, Select } from 'antd';

export const Icon = AntdIcon as unknown as React.ComponentType<{
  type: string;
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
}>;

const { Option } = Select;
export { Option };

export const SelectInput = Select as unknown as React.ComponentType<{
  defaultValue?: string;
  value?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
}>;
