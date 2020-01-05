import React from 'react';
import { Spin } from 'antd';
import './Spinner.css';
import 'antd/dist/antd.css';

const Spinner = () => {
  return (
    <div className="example">
      <Spin size={'large'}/>
    </div>
  );
};

export default Spinner;