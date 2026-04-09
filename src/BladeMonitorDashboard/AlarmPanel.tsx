import React, { useState } from 'react';
import clsx from 'clsx';
import { Select, Table } from 'antd';
import { ALARMS, AlarmLevel, AlarmStatus } from './constant';
import styles from './style/index.modules.less';

const AntSelect = Select as React.ComponentType<any>;
const AntOption = Select.Option as React.ComponentType<any>;

const LEVEL_LABEL: Record<AlarmLevel, string> = { critical: '严重', warning: '警告', info: '信息' };
const LEVEL_CLASS: Record<AlarmLevel, string> = {
  critical: styles.levelCritical,
  warning: styles.levelWarning,
  info: styles.levelInfo,
};

const alarmColumns = [
  { title: '发生时间', dataIndex: 'time', key: 'time', width: 160 },
  { title: '对象', dataIndex: 'object', key: 'object', width: 80 },
  {
    title: '级别',
    dataIndex: 'level',
    key: 'level',
    width: 100,
    align: 'center' as const,
    render: (lv: AlarmLevel) => <span className={clsx(styles.levelTag, LEVEL_CLASS[lv])}>{LEVEL_LABEL[lv]}</span>,
  },
  { title: '报警类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '报警内容', dataIndex: 'content', key: 'content' },
  { title: '处置建议', dataIndex: 'desc', key: 'desc' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (s: AlarmStatus) => (
      <span className={s === 'active' ? styles.statusActive : styles.statusResolved}>
        {s === 'active' ? '● 未恢复' : '○ 已恢复'}
      </span>
    ),
  },
];

export default function AlarmPanel() {
  const [fLevel, setFLevel] = useState('全部级别');
  const [fType, setFType] = useState('全部类型');

  return (
    <div className={styles.alarmSection}>
      <div className={styles.alarmFilterRow}>
        <AntSelect
          className="ofm-dark-select"
          dropdownClassName="ofm-select-popup"
          value={fLevel}
          onChange={setFLevel}
          style={{ width: 140 }}>
          <AntOption value="全部级别">全部级别</AntOption>
          <AntOption value="critical">严重</AntOption>
          <AntOption value="warning">警告</AntOption>
        </AntSelect>
        <AntSelect
          className="ofm-dark-select"
          dropdownClassName="ofm-select-popup"
          value={fType}
          onChange={setFType}
          style={{ width: 140 }}>
          <AntOption value="全部类型">全部类型</AntOption>
          <AntOption value="振动">振动</AntOption>
          <AntOption value="过载">过载</AntOption>
        </AntSelect>
      </div>
      <Table
        className="ofm-table"
        columns={alarmColumns}
        dataSource={ALARMS}
        pagination={false}
        scroll={{ y: 'calc(100vh - 350px)' }}
        rowKey="id"
        size="middle"
      />
    </div>
  );
}
