import React, { useContext, useEffect, useState } from 'react'
import { useGetOrderDataQuery } from '../../../../services/orderService';
import { useAppDispatch } from '../../../../hooks';
import { setOrderData, setOrderLoading } from '../../../../store/order/order.reducer';
import { OrderItem } from '../../../../store/order/order.type';
import { useAppSelector } from '../../../../hooks';
import { selectOrderArrange, selectOrdersLoading } from '../../../../store/order/order.selector';
import { Button, Flex, Form, Input, Table, Tag, TableProps, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useUpdateOrderDataMutation, useDeleteOrderDataMutation } from '../../../../services/orderService';
import { CatchErrorMessage } from '../../../../interface';
import { setError } from '../../../../store/common/common.reducer';
import { OrderContext } from '../../../../store';
import { useTranslation } from 'react-i18next';
import { paymethod, transArraySeats, transDateString, transMovieTitleName } from '../../../../helper/transform.language';


const getColor = (data: string) => {
  switch (data) {
    case '信用卡':
      return 'volcano';
    case '綠界科技-Credit_CreditCard':
      return 'green';
    case '綠界科技-WebATM_TAISHIN':
      return 'purple';
    default:
      return 'lime';
  }
}

export const Ordertable: React.FC = () => {
  const { t } = useTranslation()
  const { language } = useAppSelector(state => state.common)
  const storeDispatch = useAppDispatch()
  const { data, error, isLoading } = useGetOrderDataQuery({ parameter: 'dataForManagement', daterange: 'all' })
  const { isError } = useAppSelector(state => state.common.error)
  const [payMethodTitle, setPayMethodTitle] = useState({ title: '付款方式', count: 0 })
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [updateOrderData] = useUpdateOrderDataMutation()
  const [deleteOrderData] = useDeleteOrderDataMutation()
  const orderData = useAppSelector(selectOrderArrange)
  const loading = useAppSelector(selectOrdersLoading)
  const [form] = Form.useForm()
  const [deleteCheck, setDeleteCheck] = useState(false)
  const antPopconfirmElement = document.querySelector('.ant-popover.ant-popconfirm') as HTMLDivElement
  const [state] = useContext(OrderContext);
  const userRole = (state.orderList.role) ? state.orderList.role : ''
  const confirmTipText = (userRole === 'view') ? `${t("admin_page.common.view_mode_notice_delete_text")}` : ''
  const isView = (userRole === 'view') ? true : false
  const isMoblieScreen = useAppSelector(state => state.common.isMoblieScreen);
  // const { orders } = useAppSelector(selectOrderReducer)

  useEffect(() => {
    if (data?.data.dataForManagement) {
      storeDispatch(setOrderData(data.data.dataForManagement as OrderItem[]));
    }
  }, [data]);


  const enableEditRow = (record: OrderItem, index: number) => {
    setEditingRow(index)
    form.setFieldsValue({
      'index': record.index,
      'quantity': record.quantity,
      'total': record.total,
    })
  }

  /*當篩選器裡的選項被選擇時, 透過onChange來監控其選擇了哪些選項*/
  const onChange: TableProps<OrderItem>['onChange'] = (pagination, filters, sorter, extra,) => {
    setEditingRow(null)
    if (filters.payMethod) {
      setPayMethodTitle({ title: '總共筆數', count: extra.currentDataSource.length })
    } else {
      setPayMethodTitle({ title: '付款方式', count: 0 })
    }
  }


  /*修改狀態 - 按下儲存按鈕後*/
  const submitHandler = async (values: OrderItem) => {
    const { quantity, total } = values
    const formattedValues = {
      ...orderData[values.index as number],
      quantity: Number(quantity),
      total: Number(total),
    }
    // setEditingRow(null)

    try {
      /*這裡由於RTK-Query 的標籤機制，可以用來自動重新觸發getOrderData的API
        因此就不再需將新的資料寫入到store，也不需後端回傳新的資料回來，
        所以這裡的useGetOrderDataQuery會自動再去抓取後端的資料，並更新到store裡
      */
      await updateOrderData(formattedValues).unwrap();
      storeDispatch(setOrderLoading(true))
      setEditingRow(null)

    } catch (error) {
      const catchError = error as CatchErrorMessage
      console.log('catchError => ', catchError.data?.message)
      storeDispatch(setOrderLoading(false))
      storeDispatch(setError({ isError: !isError, errorMessage: `${catchError.data?.message}` }))
    }

  }

  /*按下確定刪除的按鈕後*/
  const deleteHandler = async (record: OrderItem) => {
    setDeleteCheck(false)
    storeDispatch(setOrderLoading(true));

    /*因為暫時找不到可以在執行try catch之前關閉ant design的Popconfirm的方法, 我猜測它可能是在執行Promise時會強制開啟Popconfirm
    所以只能先用hardcore的方式直接修改DOM來改變其style，下面用的是切換加入ant-popover-hidden的CSS class，
    ant-popover-hidden 為ant-desing內建的display none CSS*/
    (antPopconfirmElement) ? antPopconfirmElement.classList.toggle("ant-popover-hidden") : ''
    try {
      await deleteOrderData(record).unwrap();
    } catch (error) {
      const catchError = error as CatchErrorMessage
      console.log('catchError => ', catchError.data?.message)
      storeDispatch(setOrderLoading(false))
      storeDispatch(setError({ isError: !isError, errorMessage: `${catchError.data?.message}` }))
      setDeleteCheck(false)
    }
    // 在這裡處理刪除邏輯，您可以使用record來獲取相關數據
  }


  const columns: ColumnsType<OrderItem> = [
    {
      title: t("admin_page.order_mamagement_page.id_number"),
      dataIndex: '_id',
      ellipsis: true,
    },
    {
      title: t("admin_page.order_mamagement_page.booking_date_time"),
      dataIndex: 'createTime',
      sorter: (record1, record2) => {
        return record1.createTime.localeCompare(record2.createTime);
      },
      ellipsis: true,
      width: 150
    },
    {
      title: t("admin_page.order_mamagement_page.movie_name"),
      dataIndex: 'movieName',
      width: 180,
      ellipsis: true,
      render: (data: string) => {
        return transMovieTitleName(language, data)
      }

    },
    {
      title: t("admin_page.order_mamagement_page.data"),
      dataIndex: 'moviePlayDate',
      width: 140,
      render: (data) => {
        return <span>{transDateString(language, data)}</span>;
      }
    },
    {
      title: t("admin_page.order_mamagement_page.seats"),
      dataIndex: 'seatOrdered',
      width: 85,
      ellipsis: true,
      render: (seatDatas: [], record, index: number) => {
        return <span>{transArraySeats(language, seatDatas)}</span>;
      }
    },
    {
      title: t("admin_page.order_mamagement_page.playing_time"),
      dataIndex: 'moviePlayTime',
      width: 90,
      ellipsis: true,
    },
    {
      title: t("admin_page.order_mamagement_page.booking_mehtod"),
      dataIndex: 'status',
      ellipsis: true,
      width: 100,
      render: (data: string, record: OrderItem, index: number) => {

        let colorStatus = (data === 'member') ?
          { status: t("admin_page.order_mamagement_page.member_login"), color: 'blue' } :
          { status: t("admin_page.order_mamagement_page.quick_booking"), color: 'cyan' }
        return (
          <Tag color={colorStatus.color} key={index}>{colorStatus.status}</Tag>
        )
      }
    },
    {
      title: `${t("admin_page.order_mamagement_page.payment_mehtod")} ${(payMethodTitle.count > 0 ? `(${payMethodTitle.count})` : '')}`,
      dataIndex: 'payMethod',
      width: 200,
      render: (data: string) => {
        const color = getColor(data)
        return (
          <Tag color={color}>{paymethod(language, data)}</Tag>
        )
      },
      filters: [
        { text: paymethod(language, '信用卡'), value: '信用卡' },
        { text: paymethod(language, '綠界科技-Credit_CreditCard'), value: '綠界科技-Credit_CreditCard' },
        { text: paymethod(language, '綠界科技-WebATM_TAISHIN'), value: '綠界科技-WebATM_TAISHIN' },
      ],
      onFilter: (value, record) => {
        return record.payMethod === value
      },

    },
    {
      title: t("admin_page.order_mamagement_page.tickets_number"),
      dataIndex: 'quantity',
      ellipsis: true,
      // width: 80,
      render: (data: number, record: OrderItem, index: number) => {
        if (editingRow === index) {
          return (
            <Form.Item
              style={{ margin: 0 }}
              name='quantity'
            >
              <Input style={{ width: '40px' }} />
            </Form.Item>
          )
        } else {
          return <span>{data}</span>
        }
      }
    },
    {
      title: t("admin_page.order_mamagement_page.total"),
      dataIndex: 'total',
      ellipsis: true,
      // width: 100,
      render: (data: number, record: OrderItem, index: number) => {
        if (editingRow === index) {
          return (
            <Form.Item
              style={{ margin: 0 }}
              name='total'
            >
              <Input style={{ width: '70px' }} />
            </Form.Item>
          )
        } else {
          return <span>{data}</span>
        }
      }
    },
    {
      title: t("admin_page.order_mamagement_page.action"),
      fixed: 'right' as const,
      width: 150,
      render: (data: string, record: OrderItem, index: number) => {
        if (editingRow === index) {
          return (
            <Flex wrap gap={10}>
              <Button className='btn_primary'
                style={{ padding: "0px 7px" }}
                htmlType='submit'
              >{t("button.save")}
              </Button>

              <Button className='btn_primary'
                onClick={() => setEditingRow(null)}
                style={{ padding: "0px 7px" }}>{t("button.cancel")}
              </Button>
            </Flex>
          )
        } else {
          return <>
            <EditOutlined
              style={{ color: '#E7C673', fontSize: 16 }}
              onClick={() => { enableEditRow(record, index) }}
            />
            <Popconfirm
              title=<span>{t("admin_page.common.confirm_delete_message")} <span style={{ color: '#aaa', fontSize: '12px' }}>{confirmTipText}</span></span>
              onConfirm={() => deleteHandler(record)}
              onCancel={() => setDeleteCheck(false)}
              disabled={deleteCheck}
              okButtonProps={{ loading: false, disabled: isView }}
              okText={t("button.confirm")}
            >
              <DeleteOutlined
                style={{ color: '#fd8686', fontSize: 16, marginLeft: 12 }}
                onClick={() => setDeleteCheck(true)}
              />
            </Popconfirm>
          </>
        }
      }
    },
  ]

  return (
    <>
      <Flex justify={'end'} style={{ marginBottom: 16 }}>
        <Button className='btn_primary'>{t("admin_page.order_mamagement_page.export_order")}</Button>
      </Flex>
      <Form
        form={form}
        className='editOrderForm'
        onFinish={submitHandler}
      >
        <Form.Item
          name='index'
          style={{ display: 'none' }}
        >
          <Input type='hidden' />
        </Form.Item>
        <Table
          rowKey={'_id'}
          className='memberTable'
          columns={columns}
          dataSource={orderData}
          onChange={onChange}
          showSorterTooltip={{ target: 'sorter-icon' }}
          locale={{
            filterConfirm: t("button.confirm"),
            filterReset: t("button.reset"),
          }}
          scroll={{ x: isMoblieScreen ? 'max-content' : '100%' }}
          pagination={{
            position: ['bottomLeft'],
            pageSize: 10,
          }}
          loading={loading}
        ></Table>
      </Form>
    </>
  );
}
