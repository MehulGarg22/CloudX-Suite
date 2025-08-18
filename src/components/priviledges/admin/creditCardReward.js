import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Tooltip, Card, Form, Input, Space, ConfigProvider, Typography, Divider } from 'antd';
import './creditCardReward.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Notification from '../../features/notification';
import { Skeleton } from 'antd';
import ModernSkeleton from "../../ModernSkeleton";
import AdminNavbar from './adminNavbar';

const { Title } = Typography;

export default function CreditCardReward() {
    const [initialValue, setInitialValue] = useState({ items: [{}] });
    const [cards, setCards] = useState([{}]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [description, setDescription] = useState("");
    const [form] = Form.useForm();

    const cardGetAPI = "https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get";
    const cardPostAPI = "https://q08qqknh16.execute-api.us-east-1.amazonaws.com/credit-card-details/post";
    const cardDeleteAPI = "https://maqwhoyk0g.execute-api.us-east-1.amazonaws.com/credit-card-details/delete";

    const cardetailsFromDatabase = () => {
        setInitialLoad(true);
        axios.get(cardGetAPI).then((resp) => {
            console.log("resp.data:", resp.data);
            const fetchedItems = resp.data.items || [];
            setCards(fetchedItems);

            console.log("cards:", fetchedItems);
            console.log("cards[0]?.cardIssuer:", fetchedItems?.cardIssuer);

            if (fetchedItems.length > 0) {
                form.setFieldsValue({
                    items: fetchedItems.map(item => ({
                        id: item.id,
                        cardIssuer: item.cardIssuer,
                        name: item.name,
                        annualfee: item.annualfee,
                        joiningfee: item.joiningfee,
                        annualFeeWaiver: item.annualFeeWaiver,
                        domesticLoungeAccess: item.domesticLoungeAccess,
                        internationalLoungeAccess: item.internationalLoungeAccess,
                        fuelDiscount: item.fuelDiscount,
                        flipkart: item.flipkart,
                        swiggy: item.swiggy,
                        zomato: item.zomato,
                        bigbasket: item.bigbasket,
                        amazon: item.amazon,
                        uber: item.uber,
                        ola: item.ola,
                        rapido: item.rapido,
                        myntra: item.myntra,
                        comments: item.comments,
                        list: item.list || []
                    }))
                });
                console.log("form.getFieldsValue():", form.getFieldsValue());
                setInitialLoad(false);
            }
        }).catch((err) => console.log("Error is: ", err));
    };

    useEffect(() => {
        cardetailsFromDatabase();
    }, []);

    const deleteCard = (index) => {
        console.log("inside delete function: ", index);
        axios.delete(cardDeleteAPI, {
            data: {
                id: index
            }
        }).then((res) => {
            console.log(res);
            cardetailsFromDatabase();
            setMessage('Success!');
            setDescription('The card detail successfully deleted');
            setType('success');
        }).catch((err) => {
            console.log(err);
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to delete the card detail. Please try again later.');
            setType('error');
        });
    };

    const rewardFields = [
        { label: "Annual Fee Waiver", key: "annualFeeWaiver", placeholder: "Annual Fee Waiver" },
        { label: "Domestic Lounge", key: "domesticLoungeAccess", placeholder: "Domestic Lounge Access" },
        { label: "International Lounge", key: "internationalLoungeAccess", placeholder: "International Lounge Access" },
        { label: "Fuel Discount", key: "fuelDiscount", placeholder: "Fuel Discount" },
        { label: "Amazon", key: "amazon", placeholder: "Amazon Rewards" },
        { label: "Big Basket", key: "bigbasket", placeholder: "Bigbasket Rewards" },
        { label: "Flipkart", key: "flipkart", placeholder: "Flipkart Rewards" },
        { label: "Myntra", key: "myntra", placeholder: "Myntra Rewards" },
        { label: "Ola", key: "ola", placeholder: "Ola Rewards" },
        { label: "Rapido", key: "rapido", placeholder: "Rapido Rewards" },
        { label: "Swiggy", key: "swiggy", placeholder: "Swiggy Rewards" },
        { label: "Uber", key: "uber", placeholder: "Uber Rewards" },
        { label: "Zomato", key: "zomato", placeholder: "Zomato Rewards" },
    ];

    const handleSubmit = () => {
        setType('');
        console.log(form.getFieldsValue());
        setLoading(true);
        axios.post(cardPostAPI, form.getFieldsValue().items).then((res) => {
            console.log("card details post response", res);
            setLoading(false);
            cardetailsFromDatabase();
            setMessage('Success!');
            setDescription('The information you provided has been successfully saved.');
            setType('success');
        }).catch((err) => {
            cardetailsFromDatabase();
            console.log(err);
            setLoading(false);
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to save your changes. Please try again later.');
            setType('error');
        });
    };

    // Modern ConfigProvider theme
    const modernTheme = {
        token: {
            colorPrimary: '#1677ff',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            colorInfo: '#1677ff',
            colorText: '#1f1f1f',
            colorTextSecondary: '#6b7280',
            colorTextTertiary: '#9ca3af',
            colorBgContainer: '#ffffff',
            colorBgElevated: '#ffffff',
            colorBgLayout: '#f8fafc',
            colorBorder: '#e5e7eb',
            colorBorderSecondary: '#f3f4f6',
            borderRadius: 8,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            fontSize: 14,
            fontSizeHeading1: 32,
            fontSizeHeading2: 24,
            fontSizeHeading3: 20,
            lineHeight: 1.5,
        },
        components: {
            Button: {
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 500,
                primaryShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
            },
            Card: {
                borderRadiusLG: 12,
                paddingLG: 24,
                boxShadowTertiary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            },
            Input: {
                borderRadius: 8,
                controlHeight: 40,
                colorBgContainer: '#f9fafb',
                activeBorderColor: '#1677ff',
                hoverBorderColor: '#4096ff',
            },
            Form: {
                labelFontSize: 14,
                labelColor: '#374151',
                labelFontWeight: 500,
            },
            Typography: {
                titleMarginBottom: '0.5em',
                titleMarginTop: '1.2em',
            }
        },
    };

    return (
        <ConfigProvider theme={modernTheme}>
            <div className="admin-layout">
                <AdminNavbar />
                <div className="main-content">
                    <div className="content-header">
                        <Title level={2} className="page-title">
                            Credit Card Management
                        </Title>
                    </div>

                    {initialLoad ? (
                        <ModernSkeleton mode="section" />
                    ) : (
                        <div className="form-container">
                            <Form
                                form={form}
                                name="credit-card-form"
                                layout="vertical"
                                autoComplete="off"
                                className="modern-form"
                            >
                                <Notification type={type} message={message} description={description} />
                                
                                <Form.List name="items">
                                    {(fields, { add, remove }) => (
                                        <div className="form-content">
                                            <div className="cards-grid">
                                                {fields.map((field, index) => (
                                                    <Card
                                                        key={field.key}
                                                        className="credit-card-form"
                                                        title={
                                                            <span className="card-title">
                                                                Credit Card {field.name + 1}
                                                            </span>
                                                        }
                                                        extra={
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<CloseOutlined />}
                                                                onClick={() => {
                                                                    remove(index);
                                                                    deleteCard(cards[field?.key]?.id);
                                                                    console.log("close: ", cards[field?.key]);
                                                                }}
                                                                className="delete-button"
                                                            />
                                                        }
                                                    >
                                                        {/* Basic Information Section */}
                                                        <div className="form-section">
                                                            <Title level={5} className="section-title">Basic Information</Title>
                                                            
                                                            <Form.Item 
                                                                label="Card Issuer Bank" 
                                                                name={[field.name, 'cardIssuer']} 
                                                                initialValue={cards[index]?.cardIssuer}
                                                            >
                                                                <div className="input-with-tooltip">
                                                                    <Input 
                                                                        defaultValue={cards[index]?.cardIssuer} 
                                                                        placeholder="Card Issuer Name" 
                                                                        size="large"
                                                                    />
                                                                    <Tooltip placement="top" title="Enter credit card issuing bank">
                                                                        <span className="info-icon">
                                                                            <IoMdInformationCircleOutline />
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            </Form.Item>

                                                            <Form.Item 
                                                                label="Card Name" 
                                                                name={[field.name, 'name']} 
                                                                initialValue={cards[index]?.name}
                                                            >
                                                                <div className="input-with-tooltip">
                                                                    <Input 
                                                                        defaultValue={cards[index]?.name} 
                                                                        placeholder="Credit Card Name" 
                                                                        size="large"
                                                                    />
                                                                    <Tooltip placement="top" title="Enter credit card name">
                                                                        <span className="info-icon">
                                                                            <IoMdInformationCircleOutline />
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            </Form.Item>

                                                            <div className="fee-inputs">
                                                                <Form.Item 
                                                                    label="Annual Fee" 
                                                                    name={[field.name, 'annualfee']} 
                                                                    initialValue={cards[index]?.annualfee}
                                                                >
                                                                    <div className="input-with-tooltip">
                                                                        <Input 
                                                                            defaultValue={cards[index]?.annualfee} 
                                                                            placeholder="Annual Fee" 
                                                                            size="large"
                                                                        />
                                                                        <Tooltip placement="top" title="Enter Annual Fee in INR which is charged every year">
                                                                            <span className="info-icon">
                                                                                <IoMdInformationCircleOutline />
                                                                            </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>

                                                                <Form.Item 
                                                                    label="Joining Fee" 
                                                                    name={[field.name, 'joiningfee']} 
                                                                    initialValue={cards[index]?.joiningfee}
                                                                >
                                                                    <div className="input-with-tooltip">
                                                                        <Input 
                                                                            defaultValue={cards[index]?.joiningfee} 
                                                                            placeholder="Joining Fee" 
                                                                            size="large"
                                                                        />
                                                                        <Tooltip placement="top" title="Enter Joining Fee in INR which is charged at the time of joining the card">
                                                                            <span className="info-icon">
                                                                                <IoMdInformationCircleOutline />
                                                                            </span>
                                                                        </Tooltip>
                                                                    </div>
                                                                </Form.Item>
                                                            </div>
                                                        </div>

                                                        <Divider />

                                                        {/* Rewards Section */}
                                                        <div className="form-section">
                                                            <Title level={5} className="section-title">Rewards & Benefits</Title>
                                                            
                                                            <div className="rewards-grid">
                                                                {rewardFields.map(({ label, key, placeholder }) => (
                                                                    <Form.Item 
                                                                        key={key} 
                                                                        label={label} 
                                                                        name={[field.name, key]} 
                                                                        initialValue={cards[index]?.[key]}
                                                                    >
                                                                        <div className="input-with-tooltip">
                                                                            <Input 
                                                                                defaultValue={cards[index]?.[key]} 
                                                                                placeholder={placeholder}
                                                                                size="large"
                                                                            />
                                                                            <Tooltip placement="top" title={`Enter ${label} data`}>
                                                                                <span className="info-icon">
                                                                                    <IoMdInformationCircleOutline />
                                                                                </span>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </Form.Item>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <Divider />

                                                        {/* Additional Information */}
                                                        <div className="form-section">
                                                            <Form.Item 
                                                                label="Additional Comments" 
                                                                name={[field.name, 'comments']} 
                                                                initialValue={cards[index]?.comments}
                                                            >
                                                                <div className="input-with-tooltip">
                                                                    <Input.TextArea 
                                                                        defaultValue={cards[index]?.comments} 
                                                                        placeholder="Additional information" 
                                                                        rows={3}
                                                                        size="large"
                                                                    />
                                                                    <Tooltip placement="top" title="Enter Additional Information">
                                                                        <span className="info-icon">
                                                                            <IoMdInformationCircleOutline />
                                                                        </span>
                                                                    </Tooltip>
                                                                </div>
                                                            </Form.Item>

                                                            <Form.Item label="Custom Rewards">
                                                                <Form.List name={[field.name, 'list']}>
                                                                    {(subFields, subOpt) => (
                                                                        <div className="custom-rewards-section">
                                                                            {subFields.map((subField, subIndex) => (
                                                                                <div key={subField.key} className="reward-item">
                                                                                    <div className="reward-inputs">
                                                                                        <Form.Item noStyle name={[subField.name, 'featureName']}>
                                                                                            <div className="input-with-tooltip">
                                                                                                <Input 
                                                                                                    defaultValue={cards[index]?.list?.[subIndex]?.featureName} 
                                                                                                    placeholder="Feature"
                                                                                                    size="large"
                                                                                                />
                                                                                                <Tooltip placement="top" title="Enter feature name">
                                                                                                    <span className="info-icon">
                                                                                                        <IoMdInformationCircleOutline />
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        </Form.Item>
                                                                                        
                                                                                        <Form.Item noStyle name={[subField.name, 'featureValue']}>
                                                                                            <div className="input-with-tooltip">
                                                                                                <Input 
                                                                                                    defaultValue={cards[index]?.list?.[subIndex]?.featureValue} 
                                                                                                    placeholder="Feature value"
                                                                                                    size="large"
                                                                                                />
                                                                                                <Tooltip placement="top" title="Enter feature value">
                                                                                                    <span className="info-icon">
                                                                                                        <IoMdInformationCircleOutline />
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        </Form.Item>
                                                                                        
                                                                                        <Form.Item noStyle name={[subField.name, 'rewardCapping']}>
                                                                                            <div className="input-with-tooltip">
                                                                                                <Input 
                                                                                                    defaultValue={cards[index]?.list?.[subIndex]?.rewardCapping} 
                                                                                                    placeholder="Reward Capping"
                                                                                                    size="large"
                                                                                                />
                                                                                                <Tooltip placement="top" title="Enter Reward Capping">
                                                                                                    <span className="info-icon">
                                                                                                        <IoMdInformationCircleOutline />
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        </Form.Item>
                                                                                        
                                                                                        <Form.Item noStyle name={[subField.name, 'remarks']}>
                                                                                            <div className="input-with-tooltip">
                                                                                                <Input 
                                                                                                    defaultValue={cards[index]?.list?.[subIndex]?.remarks} 
                                                                                                    placeholder="Additional comments"
                                                                                                    size="large"
                                                                                                />
                                                                                                <Tooltip placement="top" title="Enter Additional Comments">
                                                                                                    <span className="info-icon">
                                                                                                        <IoMdInformationCircleOutline />
                                                                                                    </span>
                                                                                                </Tooltip>
                                                                                            </div>
                                                                                        </Form.Item>
                                                                                    </div>
                                                                                    
                                                                                    <Button
                                                                                        type="text"
                                                                                        danger
                                                                                        icon={<CloseOutlined />}
                                                                                        onClick={() => subOpt.remove(subField.name)}
                                                                                        className="remove-reward-button"
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                            
                                                                            <Button 
                                                                                type="dashed" 
                                                                                onClick={() => subOpt.add()} 
                                                                                className="add-reward-button"
                                                                                size="large"
                                                                            >
                                                                                + Add Custom Reward
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </Form.List>
                                                            </Form.Item>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="form-actions">
                                                <Space size="middle" className="action-buttons">
                                                    <Button 
                                                        type="dashed" 
                                                        onClick={() => add()} 
                                                        size="large"
                                                        className="add-card-button"
                                                    >
                                                        + Add New Card
                                                    </Button>
                                                    <Button 
                                                        type="primary" 
                                                        onClick={handleSubmit} 
                                                        loading={loading}
                                                        size="large"
                                                        className="submit-button"
                                                    >
                                                        Save All Changes
                                                    </Button>
                                                </Space>
                                            </div>
                                        </div>
                                    )}
                                </Form.List>
                            </Form>
                        </div>
                    )}
                </div>
            </div>
        </ConfigProvider>
    );
}
