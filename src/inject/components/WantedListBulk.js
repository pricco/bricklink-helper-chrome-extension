import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Menu, Dropdown, Button, Modal, Form, Input, Select, Progress } from 'antd';
import { DownOutlined, MergeCellsOutlined, DeleteOutlined } from '@ant-design/icons';

import { showWarning } from '../../utils';
import { useConfiguration } from '../../Configuration';
import { getWantedListItems, createWantedList, deleteWantedList, addItemsToWantedList } from '../../api';


const getContainer = () => document.querySelector('#bhce-containers')


const Status = ({ step, steps, message }) => {
  return (
    <Modal
      visible
      closable={false}
      maskClosable={false}
      closeIcon={null}
      getContainer="#bhce-containers"
      centered
      footer={null}
    >
      <div>
        <p>{message}</p>
        <Progress percent={Math.round((step / steps) * 100)} />
      </div>
    </Modal>
  );
};


const MergeAction = ({ onCancel, onFinish, lists }) => {
  const [form] = Form.useForm();
  const [progress, setProgress] = useState(null);
  const configuration = useConfiguration();

  const handleOk = () => {
    form.submit();
  }

  const handleCancel = () => {
    onCancel();
  };

  const handleMerge = async ({ name, condition, maxprice, qwant, qhave, notify }) => {
    const steps = lists.length + 2;
    let step = 0;
    const mergedItems = {};
    for (const list of lists) {
      setProgress({ step, steps, message: `Fetching wanted list "${list.name}"...`});
      const items = await getWantedListItems(list.id);
      items.forEach(item => {
        const key = `I${item.itemID}C${item.colorID}`;
        if (key in mergedItems) {
          const merged = mergedItems[key];
          // wantedNew
          if (merged.wantedNew !== item.wantedNew) {
            merged.wantedNew = {new: 'N', any: 'X', used: 'U'}[condition];
          }
          // wantedQty
          if (item.wantedQty !== -1) {
            if (merged.wantedQty === -1) {
              merged.wantedQty = item.wantedQty;
            } else {
              if (qwant === 'sum') {
                merged.wantedQty += item.wantedQty;
              } else if (qwant === 'kmin') {
                merged.wantedQty = Math.min(item.wantedQty, merged.wantedQty);
              } else if (qwant === 'kmax') {
                merged.wantedQty = Math.max(item.wantedQty, merged.wantedQty);
              }

            }
          }
          // wantedQtyFilled
          if (item.wantedQtyFilled !== -1) {
            if (merged.wantedQtyFilled === -1) {
              merged.wantedQtyFilled = item.wantedQtyFilled;
            } else {
              if (qhave === 'sum') {
                merged.wantedQtyFilled += item.wantedQtyFilled;
              } else if (qhave === 'kmin') {
                merged.wantedQtyFilled = Math.min(item.wantedQtyFilled, merged.wantedQtyFilled);
              } else if (qhave === 'kmax') {
                merged.wantedQtyFilled = Math.max(item.wantedQtyFilled, merged.wantedQtyFilled);
              }
            }
          }
          // wantedPrice
          if (item.wantedPrice !== -1) {
            if (merged.wantedPrice === -1) {
              merged.wantedPrice = item.wantedPrice;
            } else {
              if (qwant === 'kmin') {
                merged.wantedPrice = Math.min(item.wantedPrice, merged.wantedPrice);
              } else if (qwant === 'kmax') {
                merged.wantedPrice = Math.max(item.wantedPrice, merged.wantedPrice);
              }
            }
          }
          // wantedRemarks
          if (item.wantedRemarks) {
            if (!merged.wantedRemarks) {
              merged.wantedRemarks = item.wantedRemarks;
            } else {
              merged.wantedRemarks = `${merged.wantedRemarks}\n${item.wantedRemarks}`;
            }
          }
          // wantedNotify
          if (merged.wantedNotify !== item.wantedNotify) {
            merged.wantedNotify = {no: 'N', yes: 'Y'}[notify];
          }
        } else {
          mergedItems[key] = {
            itemID: item.itemID,
            colorID: item.colorID,
            wantedQty: item.wantedQty,
            wantedQtyFilled: item.wantedQtyFilled,
            wantedNew: item.wantedNew,
            wantedNotify: item.wantedNotify,
            wantedRemarks: item.wantedRemarks,
            wantedPrice: item.wantedPrice,
          };
        }
      });
      step += 1;
    }
    setProgress({ step, steps, message: `Creating new wanted list "${name}"...`});
    step += 1
    const newWantedListId = await createWantedList(name);

    setProgress({ step, steps, message: `Adding items to the new wanted list...`});
    step += 1;
    await addItemsToWantedList(newWantedListId, Object.values(mergedItems));

    setProgress({ step, steps, message: `Done. Redirecting to the wanted list page...`});
    window.location.href = `/v2/wanted/search.page?wantedMoreID=${newWantedListId}&pageSize=${configuration.wantedListPageSize}`;
    onFinish();
  };

  return (
    <>
      <Modal
        title="Merge Wanted Lists"
        visible
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer="#bhce-containers"
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="ok" onClick={handleOk} type="primary">Merge</Button>,
        ]}
      >
        <Form
          form={form}
          layout="horizonal"
          initialValues={{
            condition: 'any',
            notify: 'no',
            maxprice: 'kmax',
            qwant: 'sum',
            qhave: 'kmax',
          }}
          labelCol={{span: 6}}
          wrapperCol={{span: 12}}
          onFinish={handleMerge}
        >
          <Form.Item
            label="Name"
            name="name"
            hasFeedback
            rules={[{ required: true, message: 'List name is required.' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Condition"
            name="condition"
          >
            <Select getPopupContainer={getContainer}>
              <Select.Option value="any">If ≠ → set as Any</Select.Option>
              <Select.Option value="new">If ≠ → set as New</Select.Option>
              <Select.Option value="used">If ≠ → set as Used</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Max Price"
            name="maxprice"
          >
            <Select getPopupContainer={getContainer}>
              <Select.Option value="kmax">Keep max value</Select.Option>
              <Select.Option value="kmin">Keep min value</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity Want"
            name="qwant"
          >
            <Select getPopupContainer={getContainer}>
              <Select.Option value="sum">Sum values</Select.Option>
              <Select.Option value="kmin">Keep min value</Select.Option>
              <Select.Option value="kmax">Keep max value</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity Have"
            name="qhave"
          >
            <Select getPopupContainer={getContainer}>
              {/*
                <Select.Option value="sum">Sum values</Select.Option>
                <Select.Option value="kmin">Keep min value</Select.Option>
                <Select.Option value="kmax">Keep max value</Select.Option>
              */}
              <Select.Option value="kmax">Not supported yet.</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Notify"
            name="notify"
          >
            <Select getPopupContainer={getContainer}>
              <Select.Option value="no">If ≠ → set as No</Select.Option>
              <Select.Option value="yes">If ≠ → set as Yes</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {progress && <Status {...progress} />}
    </>
  );
}

const DeleteAction = ({ onCancel, onFinish, lists }) => {
  const [progress, setProgress] = useState(null);

  const handleCancel = () => {
    onCancel();
  };

  const handleDelete = async () => {
    const steps = lists.length;
    let step = 0;
    for (const list of lists) {
      setProgress({ step, steps, message: `Deleting wanted list "${list.name}"...`});
      await deleteWantedList(list.id);
      step += 1;
    }

    setProgress({ step, steps, message: `Done. Reloading page.` });
    window.location.href = '/v2/wanted/list.page';
    onFinish();
  };

  return (
    <>
      <Modal
        title="Delete Wanted Lists"
        visible
        onOk={handleDelete}
        onCancel={handleCancel}
        getContainer="#bhce-containers"
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="ok" onClick={handleDelete} type="primary" danger>{`Delete ${lists.length} wanted lists`}</Button>,
        ]}
      >
        Are you sure you want to delete these wanted lists?
      </Modal>
      {progress && <Status {...progress} />}
    </>
  );
}

const Toolbar = () => {
  const ACTION_MERGE = 'M';
  const ACTION_DELETE = 'D';
  const [action, setAction] = useState(null);
  const [selected, setSelected] = useState([]);

  const handleMenuClick = (e) => {
    const newSelected = Array
      .apply(null, window.document.querySelectorAll('.list-container .wl-overview-list-table tr'))
      .filter(tr => tr.querySelector('td') !== null && tr.querySelector('input').checked)
      .map(tr => {
        const id = parseInt(/wantedMoreID=(\d+)/.exec(tr.querySelector('a').getAttribute('href'))[1])
        const name = tr.querySelector('a span').textContent;
        return {
          id,
          name,
        };
      });
    if (newSelected.length > 1) {
      setSelected(newSelected);
      setAction(e.key);
    } else {
      showWarning('Please select at least 2 lists to apply a bulk action.');
    }
  };

  const handleActionCancel = () => {
    setAction(null);
  };

  const handleActionFinish = () => {
    setAction(null);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={ACTION_MERGE}>
        <MergeCellsOutlined />
        Merge lists
      </Menu.Item>
      <Menu.Item key={ACTION_DELETE}>
        <DeleteOutlined />
        Delete lists
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} getPopupContainer={getContainer}>
        <Button>
          Bulk <DownOutlined />
        </Button>
      </Dropdown>
      {action === ACTION_MERGE  && <MergeAction lists={selected} onCancel={handleActionCancel} onFinish={handleActionFinish} />}
      {action === ACTION_DELETE  && <DeleteAction lists={selected} onCancel={handleActionCancel} onFinish={handleActionFinish} />}
    </>
  );
};

const WantedListBulk = () => {

  const [toolbarNode, setToolbarNode] = useState(null);

  useEffect(
    () => {
      let arrive = null;
      if (toolbarNode === null) {
         arrive = (searchNode) => {
          const newToolbarNode = document.createElement('span');
          newToolbarNode.setAttribute('id', 'bhce-wantedlist-bulk');
          searchNode.appendChild(newToolbarNode);
          setToolbarNode(newToolbarNode);
        };
        window.document.arrive('.list-container .search-group', {existing: true}, arrive);
      }
      return () => {
        if (arrive) {
          window.unbindArrive(arrive);
        }
      };
    },
    [toolbarNode],
  );

  useEffect(
    () => {
      const arrive = (trNode) => {
        const tdNode = window.document.createElement(trNode.firstElementChild.tagName);
        const inputNode = window.document.createElement('input');
        inputNode.setAttribute('type', 'checkbox');
        tdNode.appendChild(inputNode);
        if (trNode.firstElementChild.tagName === 'TH') {
          trNode.firstElementChild.style.width = '38%';
          tdNode.style.width = '5%';
          inputNode.addEventListener('change', () => {
            trNode.parentElement.querySelectorAll('td input').forEach(i => {
              i.checked = inputNode.checked;
            });
          });
        } else {
          inputNode.addEventListener('change', () => {
            const inputs = Array.apply(null, trNode.parentElement.querySelectorAll('td input'));
            const trues = inputs.reduce((a, i) => a + (i.checked ? 1 : 0), 0);
            trNode.parentElement.querySelector('th input').checked = trues === inputs.length;
            trNode.parentElement.querySelector('th input').indeterminate = trues > 0 && trues < inputs.length;
          });
        }
        trNode.insertAdjacentElement('afterbegin', tdNode);
      };
      window.document.arrive('.list-container .wl-overview-list-table tr', {existing: true}, arrive);
      return () => {
        window.unbindArrive(arrive);
      };
    },
    [],
  );

  if (toolbarNode) {
    return ReactDOM.createPortal(
      <Toolbar />,
      toolbarNode,
    );
  } else {
    return (null);
  }
};

export default WantedListBulk;
