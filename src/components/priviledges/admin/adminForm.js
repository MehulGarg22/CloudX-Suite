import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Tooltip, Card, Form, Input, Space, ConfigProvider } from 'antd';
import './adminForm.css'; // Import the CSS file
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Notification from '../../features/notification';


export default function AdminForm(){

    const [initialValue, setInitialValue]=useState({ items: [{}] })
    const [loading, setLoading]=useState(false)
    const [type, setType]=useState("")
    const [message, setMessage]=useState("")
    const [description, setDescription]=useState("")
    const [form] = Form.useForm();

    const cardGetAPI="https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get"
    const cardPostAPI="https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/post"

    useEffect(()=>{
        axios.get(cardGetAPI).then((resp)=>{
            console.log("resp", resp.data)
            setInitialValue(resp.data)
        })
    },[])

    const handleSubmit=()=>{
        setType('');
        console.log(form.getFieldsValue())
        console.log(form.getFieldsValue())
        axios.post("https://q08qqknh16.execute-api.us-east-1.amazonaws.com/credit-card-details/post", (form.getFieldsValue()).items).then((res)=>{
            console.log("card details post response",res)
            setLoading(false)
            setMessage('Success!')
            setDescription('The information you provided has been successfully saved.')
            setType('success')
        }).catch((err)=>{
            console.log(err)
            setMessage('Oops! Something went wrong.')
            setDescription('We were unable to save your changes. Please try again later.')
            setType('error')
        })
    }



    return (
        <div style={{overflowX:'hidden', width:'100%', backgroundColor:'#EBE8DB', height:'92vh'}}>  
            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                form={form}
                name="dynamic_form_complex"
                style={{ maxWidth: 1300, width: '100%',marginLeft:'40px', paddingRight:'50px',alignItems:'center'}}
                autoComplete="off"
                initialValues={initialValue}
            >
                <Notification type={type} message={message} description={description} />
                <Form.List name="items">
                    {(fields, { add, remove }) => (
                    <div>
                        <div
                        style={{
                            display: 'flex',
                            marginTop:'10px',
                            flexWrap: 'wrap',
                            columnGap: 16,
                            rowGap: 16,
                        }}
                        >
                        {fields.map((field) => (
                            <Card
                            size="small"
                            title={`Credit Card ${field.name + 1}`}
                            key={field.key}
                            extra={
                                <CloseOutlined
                                onClick={() => {
                                    remove(field.name);
                                }}
                                />
                            }
                            className="responsive-card" // Apply the CSS class
                            >
                            <Form.Item label="Bank" name={[field.name, 'bank']} >
                                <div style={{display:'flex'}}>
                                    <Input  placeholder="Bank Name"/>
                                    <Tooltip placement="top" title="Enter credit card issuing bank" >
                                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                        <IoMdInformationCircleOutline/>
                                    </span>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Name" name={[field.name, 'name']} >
                                <div style={{display:'flex'}}>
                                    <Input  placeholder="Credit Card Name"/>
                                    <Tooltip placement="top" title="Enter credit card name" >
                                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                        <IoMdInformationCircleOutline/>
                                    </span>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Annual fee" name={[field.name, 'annualfee']} >
                                <div style={{display:'flex'}}>
                                    <Input  placeholder="Annual Fee"/>
                                    <Tooltip placement="top" title="Enter Annual Fee in INR which is charged every year" >
                                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                        <IoMdInformationCircleOutline/>
                                    </span>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Joining fee" name={[field.name, 'joiningfee']} >
                                <div style={{display:'flex'}}>
                                    <Input  placeholder="Annual Fee"/>
                                    <Tooltip placement="top" title="Enter Joining Fee in INR which is charged at the time of joining the card" >
                                    <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                        <IoMdInformationCircleOutline/>
                                    </span>
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Feature">
                                <Form.List name={[field.name, 'list']}>
                                {(subFields, subOpt) => (
                                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                    {subFields.map((subField) => (
                                        <Space key={subField.key}>
                                        <Form.Item noStyle name={[subField.name, 'featureName']}>
                                            <div style={{display:'flex'}}>
                                                <Input  placeholder="Feature"/>
                                                <Tooltip placement="top" title="Enter feature name" >
                                                <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                    <IoMdInformationCircleOutline/>
                                                </span>
                                                </Tooltip>
                                            </div>
                                        </Form.Item>
                                        <Form.Item noStyle name={[subField.name, 'featureValue']}>
                                            <div style={{display:'flex'}}>
                                                <Input  placeholder="Feature value"/>
                                                <Tooltip placement="top" title="Enter feature value" >
                                                <span style={{cursor:'pointer', marginLeft:'10px',fontSize:'20px'}}>
                                                    <IoMdInformationCircleOutline/>
                                                </span>
                                                </Tooltip>
                                            </div>
                                        </Form.Item>
                                        <CloseOutlined
                                            onClick={() => {
                                            subOpt.remove(subField.name);
                                            }}
                                        />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                        + Add Sub Item
                                    </Button>
                                    </div>
                                )}
                                </Form.List>
                            </Form.Item>
                            
                            </Card>
                        ))}
                        
                        </div>
                        <br/>
                        <div style={{display:'flex'}}>
                            <ConfigProvider
                                theme={{                                                    // To change color of antd buttons
                                token: {
                                    colorPrimary: '#a51d4a',
                                    borderRadius: 6,
                                    colorBgContainer: 'white',
                                },
                                }}
                            >
                                <Button type="dashed" onClick={() => add()} style={{marginBottom:'10px', width:'20%'}} block>
                                + Add Item
                                </Button>

                                <Button onClick={handleSubmit} variant="filled" loading={loading} style={{marginBottom:'10px', marginLeft:'10px', width:'20%'}}>
                                Submit
                                </Button>
                            </ConfigProvider>
                        </div>

                    </div>
                    )}
                </Form.List>
            </Form>
        </div>
    );
};