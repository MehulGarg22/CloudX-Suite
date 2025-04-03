import React, { useState, useContext, useEffect } from "react"
import axios from 'axios';
import { Table } from 'antd';

export default function GuestUser(){
    const [data, setData]= useState()
    const [loading, setLoading]= useState(false)

    useEffect(()=>{
        setLoading(true)
        axios.get("https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get").then((resp)=>{
            console.log("resp", resp.data)
            setData(resp.data.items)
            setLoading(false)
        }).catch((err)=>{
            console.log("Table error in GET call is: ", err)
            setLoading(false)
        })
    },[])
    const columns = [
        {
          title: 'Card Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Card Issuer Bank',
          dataIndex: 'cardIssuer',
          key: 'cardIssuer',
        },
        {
            title: 'Joining Fee',
            dataIndex: 'joiningfee',
            key: 'joiningfee',
            sorter: (a: Item, b: Item) => Number(a.joiningfee) - Number(b.joiningfee),
        },
        {
            title: 'Annual Fee',
            dataIndex: 'annualfee',
            key: 'annualfee',
            sorter: (a: Item, b: Item) => Number(a.annualfee) - Number(b.annualfee),
        },
        {
          title: 'Rewards',
          key: 'features',
          render: (text: any, record: Item) => (
            <Table
              columns={[
                {  dataIndex: 'featureName', key: 'featureName' },
                {  dataIndex: 'featureValue', key: 'featureValue' },
                {  dataIndex: 'rewardCapping', key: 'rewardCapping' },
                {  dataIndex: 'remarks', key: 'remarks' },
              ]}
              dataSource={record.list}
              pagination={false} // Disable pagination for nested table
              size="small"
            />
          ),
        },
      ];
    return(
        <Table
            dataSource={data}
            columns={columns}
            loading={loading}
            rowKey="id" // Add a unique key for each row
            className="data-table"
            style={{marginLeft:'20px', marginRight:'20px', marginBottom:'20px'}}
            bordered
        />
      );
}