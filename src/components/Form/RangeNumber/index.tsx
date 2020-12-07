/* eslint-disable no-nested-ternary */
import React from 'react';
import { Input, InputNumber } from 'antd';
import styles from './index.less';

interface RangeNumberProps {
  value?: [number, number | undefined];
  onChange?: (value: [number, number | undefined]) => void;
  placeholder?: [string, string];
  min?: number;

  max?: number;
  style?: React.CSSProperties;
  unit?: string | React.ReactNode;
  size?: 'large' | 'small' | 'default';
}

class RangeNumber extends React.Component<RangeNumberProps, any> {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        start: nextProps.value
          ? nextProps.value[0] !== undefined
            ? nextProps.value[0]
            : undefined
          : undefined,
        end: nextProps.value
          ? nextProps.value[1] !== undefined
            ? nextProps.value[1]
            : undefined
          : undefined,
      };
    }
    return null;
  }

  constructor(props: RangeNumberProps) {
    super(props);
    this.state = {
      start: undefined,
      end: undefined,
    };
  }

  onChange = (key: 'start' | 'end', event) => {
    const { onChange } = this.props;
    if (onChange) {
      const { start, end } = this.state;
      if (key === 'start') {
        onChange([event, end]);
      } else {
        onChange([start, event]);
      }
    } else {
      this.setState({
        [key]: event,
      });
    }
  };

  render() {
    const { placeholder = ['请填写', '请填写'], min = 0, max, style: css, unit, size } = this.props;
    const { start, end } = this.state;
    return (
      <div className={styles.container} style={{ ...css }}>
        {/* <InputNumber
          className={style.inputLeft}
          min={min}
          max={max}
          placeholder={placeholder[0]}
          value={start}
          onChange={(event) => this.onChange('start', event)}
          size={size}
        />
        <span style={{ padding: '0 8px', color: '#BBBBBB', fontSize: '14px' }}>~</span>
        <InputNumber
          className={style.inputRight}
          min={min}
          max={max}
          placeholder={placeholder[1]}
          value={end}
          onChange={(event) => this.onChange('end', event)}
          size={size}
        /> */}

        <Input.Group compact className={styles.rangeNumber}>
          <InputNumber
            className={styles.inputLeft}
            min={min}
            max={max}
            placeholder={placeholder[1]}
            value={end}
            onChange={(event) => this.onChange('end', event)}
            size={size}
          />
          <Input
            className={styles.inputIcon}
            style={{
              width: 30,
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
            }}
            placeholder="~"
            disabled
          />
          <InputNumber
            className={styles.inputRight}
            min={min}
            max={max}
            placeholder={placeholder[0]}
            value={start}
            onChange={(event) => this.onChange('start', event)}
            size={size}
          />
        </Input.Group>
        {unit || null}
      </div>
    );
  }
}

export default RangeNumber;
