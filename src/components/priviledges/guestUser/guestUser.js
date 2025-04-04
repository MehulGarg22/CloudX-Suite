import React, { useState, useContext, useEffect, Children } from "react"
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
          align: 'center',
          key: 'name',
        },
        {
          title: 'Card Issuer Bank',
          dataIndex: 'cardIssuer',
          align: 'center',
          key: 'cardIssuer',
        },
        {
            title: 'Fees',
            align: 'center',
            children:[

                {
                    title: 'Joining Fee',
                    dataIndex: 'joiningfee',
                    align: 'center',
                    key: 'joiningfee',
                    sorter: (a, b) => Number(a.joiningfee) - Number(b.joiningfee),
                },
                {
                    title: 'Annual Fee',
                    dataIndex: 'annualfee',
                    align: 'center',
                    key: 'annualfee',
                    sorter: (a, b) => Number(a.annualfee) - Number(b.annualfee),
                },
            ]
        },
        {
            title: 'Platform Spends',
            align: 'center',
            children:[

                {
                    title: 'Zomato',
                    dataIndex: 'zomato',
                    align: 'center',
                    key: 'zomato',
                    sorter: (a, b) => {
                        const zomatoA = a.zomato ? parseFloat(a.zomato.replace('%', '')) : 0;
                        const zomatoB = b.zomato ? parseFloat(b.zomato.replace('%', '')) : 0;
                        return zomatoA - zomatoB;
                    },
                },
                {
                    title: 'Swiggy',
                    align: 'center',
                    dataIndex: 'swiggy',
                    key: 'swiggy',
                    sorter: (a, b) => {
                        const swiggyA = a.swiggy ? parseFloat(a.swiggy.replace('%', '')) : 0;
                        const swiggyB = b.swiggy ? parseFloat(b.swiggy.replace('%', '')) : 0;
                        return swiggyA - swiggyB;
                    },
                },
                {
                    title: 'Big Basket',
                    dataIndex: 'bigbasket',
                    align: 'center',
                    key: 'bigbasket',
                    sorter: (a, b) => {
                        const bigbasketA = a.bigbasket ? parseFloat(a.bigbasket.replace('%', '')) : 0;
                        const bigbasketB = b.bigbasket ? parseFloat(b.bigbasket.replace('%', '')) : 0;
                        return bigbasketA - bigbasketB;
                    },
                },
            ]
        },



        {
          title: 'Rewards',
          key: 'features',
          align: 'center',
          render: (text, record) => (
            <div>            
                <Table
                  columns={[
                    { title: "Spend", dataIndex: 'featureName', key: 'featureName' },
                    { title: "Spend Benefit", dataIndex: 'featureValue', key: 'featureValue' },
                    { title: "Reward Capping", dataIndex: 'rewardCapping', key: 'rewardCapping' },
                    { title: "Information", dataIndex: 'remarks', key: 'remarks' },
                  ]}
                  dataSource={record.list}
                  pagination={false} // Disable pagination for nested table
                  size="small"
                  bordered
                />
            </div>
          ),
        },
        {
            title: 'Additional Details',
            dataIndex: 'comments',
            key: 'comments',
            align: 'center',
            width:'10%',
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