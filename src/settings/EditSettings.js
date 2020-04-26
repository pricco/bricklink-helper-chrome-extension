import React, { useContext, useEffect } from 'react';
import { Form, InputNumber, Button } from 'antd';

import { ConfigurationContext, DEFAULTS } from '../Configuration';
import { showSuccess } from '../utils';


const EditSettings = () => {
  const { value: configuration, update } = useContext(ConfigurationContext);
  const [form] = Form.useForm();

  useEffect(
    () => {
      form.setFieldsValue({
        wantedListPageSizee: configuration.wantedListPageSize,
      });
      return () => {};
    },
    [configuration, form],
  );

  const onFinish = async (values) => {
    configuration.wantedListPageSize = values.wantedListPageSize;
    await update(configuration);
    showSuccess('Saved');
  };

  return (
    <Form
       labelCol={{span: 6}}
       wrapperCol={{span: 12}}
       form={form}
       initialValues={{...DEFAULTS, ...configuration}}
       onFinish={onFinish}
     >
       <Form.Item
         name="wantedListPageSize"
         label="Wanted List Page Size"
         hasFeedback
         rules={[{ required: true, message: 'This field is required.' }]}
       >
        <InputNumber min={0} max={10000} step={25} precision={0} />
      </Form.Item>
      <Form.Item
        wrapperCol={{ offset: 6, span: 12 }}
      >
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EditSettings;
