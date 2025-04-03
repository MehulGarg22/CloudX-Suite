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
            title: 'Zomato',
            dataIndex: 'zomato',
            key: 'zomato',
            sorter: (a: Item, b: Item) => {
                const zomatoA = a.zomato ? parseFloat(a.zomato.replace('%', '')) : 0;
                const zomatoB = b.zomato ? parseFloat(b.zomato.replace('%', '')) : 0;
                return zomatoA - zomatoB;
            },
        },
        {
            title: 'Swiggy',
            dataIndex: 'swiggy',
            key: 'swiggy',
            sorter: (a: Item, b: Item) => {
                const swiggyA = a.swiggy ? parseFloat(a.swiggy.replace('%', '')) : 0;
                const swiggyB = b.swiggy ? parseFloat(b.swiggy.replace('%', '')) : 0;
                return swiggyA - swiggyB;
            },
        },
        {
            title: 'Big Basket',
            dataIndex: 'bigbasket',
            key: 'bigbasket',
            sorter: (a: Item, b: Item) => {
                const bigbasketA = a.bigbasket ? parseFloat(a.bigbasket.replace('%', '')) : 0;
                const bigbasketB = b.bigbasket ? parseFloat(b.bigbasket.replace('%', '')) : 0;
                return bigbasketA - bigbasketB;
            },
        },
        {
            title: 'Additional Details',
            dataIndex: 'comments',
            key: 'comments',
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
        <div style={{ overflowX: 'hidden', width: '100%', backgroundColor: '#EBE8DB', height: '92vh' }}>
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="id" // Add a unique key for each row
                className="data-table"
                style={{margin:'20px'}}
                bordered
            />
        </div>
      );
}