import React, { useEffect, useState } from 'react';
import { CloseOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, CreditCardOutlined, SaveOutlined, StarFilled } from '@ant-design/icons';
import { Button, Tooltip, Card, Form, Input, Space, ConfigProvider, Typography, Divider, Drawer, Table, Select, Tag, Popconfirm, Badge, InputNumber } from 'antd';
import './creditCardReward.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from 'axios';
import Notification from '../../features/notification';
import ModernSkeleton from "../../ModernSkeleton";
import AdminNavbar from './adminNavbar';
import { getSession } from "../../loginAuth/auth";

const { Title, Text } = Typography;

const CATEGORY_OPTIONS = [
    { label: '💎 PREMIUM', value: 'PREMIUM' },
    { label: '✈️ TRAVEL', value: 'TRAVEL' },
    { label: '🛋️ LOUNGE ACCESS', value: 'LOUNGE ACCESS' },
    { label: '🛍️ SHOPPING', value: 'SHOPPING' },
    { label: '🍕 FOOD DELIVERY', value: 'FOOD DELIVERY' },
    { label: '🍽️ DINING', value: 'DINING' },
    { label: '💰 CASHBACK', value: 'CASHBACK' },
    { label: '🌟 LIFESTYLE', value: 'LIFESTYLE' },
    { label: '📱 TELECOM', value: 'TELECOM' },
];

const CATEGORY_COLORS = {
    'PREMIUM': 'gold',
    'TRAVEL': 'blue',
    'LOUNGE ACCESS': 'purple',
    'SHOPPING': 'orange',
    'FOOD DELIVERY': 'green',
    'DINING': 'lime',
    'CASHBACK': 'cyan',
    'LIFESTYLE': 'magenta',
    'TELECOM': 'geekblue',
};

export default function CreditCardReward() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);
    const [saving, setSaving] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [description, setDescription] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // null = add, number = edit index
    const [searchText, setSearchText] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [drawerForm] = Form.useForm();

    const cardetailsFromDatabase = async () => {
        setInitialLoad(true);
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            const resp = await axios.get(
                process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREDIT_CARD_DETAILS_GET,
                { headers: { Authorization: token } }
            );
            const fetchedItems = resp.data.items || [];
            setCards(fetchedItems);
            setHasUnsavedChanges(false);
        } catch (err) {
            console.log("Error is: ", err);
        } finally {
            setInitialLoad(false);
        }
    };

    useEffect(() => {
        cardetailsFromDatabase();
    }, []);

    const deleteCard = async (cardId, index) => {
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            await axios.delete(
                process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREDIT_CARD_DETAILS_DELETE,
                {
                    data: { id: cardId },
                    headers: { Authorization: token }
                }
            );
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
            setMessage('Success!');
            setDescription('The card detail successfully deleted');
            setType('success');
        } catch (err) {
            console.log(err);
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to delete the card detail. Please try again later.');
            setType('error');
        }
    };

    const handleSaveAll = async () => {
        setType('');
        setSaving(true);
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            // Transform cards to match the expected API format
            const payload = cards.map(card => ({
                ...card,
                list: card.list || []
            }));
            await axios.post(
                process.env.REACT_APP_BASE_URL + process.env.REACT_APP_CREDIT_CARD_DETAILS_POST,
                payload,
                { headers: { Authorization: token } }
            );
            setSaving(false);
            setHasUnsavedChanges(false);
            cardetailsFromDatabase();
            setMessage('Success!');
            setDescription('The information you provided has been successfully saved.');
            setType('success');
        } catch (err) {
            console.log(err);
            setSaving(false);
            cardetailsFromDatabase();
            setMessage('Oops! Something went wrong.');
            setDescription('We were unable to save your changes. Please try again later.');
            setType('error');
        }
    };

    // Open drawer to add new card
    const handleAddCard = () => {
        setEditingIndex(null);
        drawerForm.resetFields();
        drawerForm.setFieldsValue({
            cardIssuer: '',
            name: '',
            annualfee: '',
            joiningfee: '',
            categories: [],
            introOffer: '',
            rewardRate: '',
            rating: '',
            cardImageUrl: '',
            annualFeeWaiver: '',
            domesticLoungeAccess: '',
            internationalLoungeAccess: '',
            fuelDiscount: '',
            amazon: '',
            bigbasket: '',
            flipkart: '',
            myntra: '',
            ola: '',
            rapido: '',
            swiggy: '',
            uber: '',
            zomato: '',
            comments: '',
            list: []
        });
        setDrawerOpen(true);
    };

    // Open drawer to edit existing card
    const handleEditCard = (index) => {
        const card = cards[index];
        setEditingIndex(index);
        const categoriesArr = card.categories
            ? card.categories.split('|').map(c => c.trim()).filter(Boolean)
            : [];
        drawerForm.setFieldsValue({
            ...card,
            categories: categoriesArr,
            list: card.list || []
        });
        setDrawerOpen(true);
    };

    // Save from drawer (update local state)
    const handleDrawerSave = () => {
        drawerForm.validateFields().then(values => {
            const categoriesStr = Array.isArray(values.categories)
                ? values.categories.join('|')
                : (values.categories || '');

            const cardData = {
                ...values,
                categories: categoriesStr,
                list: values.list || []
            };

            const newCards = [...cards];
            if (editingIndex !== null) {
                // Edit existing — preserve the ID
                cardData.id = cards[editingIndex].id;
                newCards[editingIndex] = cardData;
            } else {
                // Add new — no id (backend will assign)
                newCards.push(cardData);
            }
            setCards(newCards);
            setHasUnsavedChanges(true);
            setDrawerOpen(false);
            setMessage('Card updated locally');
            setDescription('Click "Save All Changes" to persist to database.');
            setType('info');
        }).catch(err => {
            console.log('Validation failed:', err);
        });
    };

    // Parse categories for table display
    const parseCategories = (str) => {
        if (!str) return [];
        return str.split('|').map(c => c.trim()).filter(Boolean);
    };

    // Filter cards by search
    const filteredCards = cards.filter(card => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return (
            (card.name || '').toLowerCase().includes(q) ||
            (card.cardIssuer || '').toLowerCase().includes(q) ||
            (card.categories || '').toLowerCase().includes(q)
        );
    });

    // Table columns
    const tableColumns = [
        {
            title: '#',
            width: 50,
            render: (_, __, index) => (
                <Text className="row-number">{index + 1}</Text>
            ),
        },
        {
            title: 'Card Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (text, record) => (
                <div className="card-name-cell-admin">
                    <Text strong className="card-name-text">{text || '-'}</Text>
                    <Text type="secondary" className="card-bank-text">{record.cardIssuer}</Text>
                </div>
            ),
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
            width: 260,
            render: (text) => {
                const cats = parseCategories(text);
                return cats.length > 0 ? (
                    <div className="categories-cell">
                        {cats.map((cat, i) => (
                            <Tag key={i} color={CATEGORY_COLORS[cat] || 'default'} className="category-mini-tag">
                                {cat}
                            </Tag>
                        ))}
                    </div>
                ) : <Text type="secondary">—</Text>;
            },
        },
        {
            title: 'Annual Fee',
            dataIndex: 'annualfee',
            key: 'annualfee',
            width: 110,
            sorter: (a, b) => Number(a.annualfee || 0) - Number(b.annualfee || 0),
            render: (fee) => (
                (!fee || fee === '0' || fee === 0)
                    ? <Tag color="green">FREE</Tag>
                    : <Text>₹{fee}</Text>
            ),
        },
        {
            title: 'Joining Fee',
            dataIndex: 'joiningfee',
            key: 'joiningfee',
            width: 110,
            sorter: (a, b) => Number(a.joiningfee || 0) - Number(b.joiningfee || 0),
            render: (fee) => (
                (!fee || fee === '0' || fee === 0)
                    ? <Tag color="green">FREE</Tag>
                    : <Text>₹{fee}</Text>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 90,
            sorter: (a, b) => Number(a.rating || 0) - Number(b.rating || 0),
            render: (rating) => rating ? (
                <span className="rating-cell">
                    {rating} <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
                </span>
            ) : <Text type="secondary">—</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            fixed: 'right',
            render: (_, record, index) => {
                // Find actual index in full cards array
                const actualIndex = cards.findIndex(c => c === record);
                return (
                    <Space>
                        <Tooltip title="Edit Card">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                className="edit-action-btn"
                                onClick={() => handleEditCard(actualIndex)}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Delete this card?"
                            description="This action cannot be undone."
                            onConfirm={() => deleteCard(record.id, actualIndex)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete Card">
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    className="delete-action-btn"
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

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
            lineHeight: 1.5,
        },
        components: {
            Button: { borderRadius: 8, controlHeight: 40, fontWeight: 500 },
            Card: { borderRadiusLG: 12, paddingLG: 24 },
            Input: { borderRadius: 8, controlHeight: 40, colorBgContainer: '#f9fafb' },
            Form: { labelFontSize: 14, labelColor: '#374151', labelFontWeight: 500 },
            Table: { borderRadius: 12, headerBg: '#f8fafc', rowHoverBg: '#f0f7ff' },
            Drawer: { borderRadius: 0 },
        },
    };

    // Reward fields for the drawer form
    const platformRewardFields = [
        { label: "Amazon", key: "amazon", icon: "🛒" },
        { label: "Flipkart", key: "flipkart", icon: "🛍️" },
        { label: "Swiggy", key: "swiggy", icon: "🍔" },
        { label: "Zomato", key: "zomato", icon: "🍕" },
        { label: "Myntra", key: "myntra", icon: "👗" },
        { label: "BigBasket", key: "bigbasket", icon: "🥬" },
        { label: "Ola", key: "ola", icon: "🚗" },
        { label: "Uber", key: "uber", icon: "🚕" },
        { label: "Rapido", key: "rapido", icon: "🏍️" },
    ];

    const additionalRewardFields = [
        { label: "Annual Fee Waiver", key: "annualFeeWaiver", placeholder: "e.g., On ₹2L annual spend" },
        { label: "Domestic Lounge", key: "domesticLoungeAccess", placeholder: "e.g., 4 per quarter" },
        { label: "International Lounge", key: "internationalLoungeAccess", placeholder: "e.g., 2 per quarter" },
        { label: "Fuel Discount", key: "fuelDiscount", placeholder: "e.g., 1% fuel surcharge waiver" },
    ];

    return (
        <ConfigProvider theme={modernTheme}>
            <div className="admin-layout">
                <AdminNavbar />
                <div className="main-content">
                    {/* Header */}
                    <div className="content-header ccm-header">
                        <div className="ccm-header-top">
                            <div className="ccm-header-left">
                                <Title level={2} className="page-title">
                                    Credit Card Management
                                </Title>
                                <Text type="secondary" className="ccm-subtitle">
                                    Manage all credit card details, rewards, and categories
                                </Text>
                            </div>
                            <div className="ccm-header-right">
                                <Badge count={cards.length} showZero color="#1677ff" overflowCount={999}>
                                    <Tag className="ccm-count-tag"><CreditCardOutlined /> Total Cards</Tag>
                                </Badge>
                            </div>
                        </div>

                        <div className="ccm-toolbar">
                            <Input
                                placeholder="Search by card name, bank, or category..."
                                prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                className="ccm-search-input"
                                allowClear
                                size="large"
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    onClick={handleAddCard}
                                    className="ccm-add-btn"
                                >
                                    Add Card
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    size="large"
                                    onClick={handleSaveAll}
                                    loading={saving}
                                    className="ccm-save-btn"
                                    disabled={!hasUnsavedChanges}
                                >
                                    Save All Changes
                                </Button>
                            </Space>
                        </div>
                    </div>

                    {/* Notification */}
                    <Notification type={type} message={message} description={description} />

                    {/* Unsaved changes banner */}
                    {hasUnsavedChanges && (
                        <div className="ccm-unsaved-banner">
                            <Text>⚠️ You have unsaved changes. Click <strong>"Save All Changes"</strong> to persist to database.</Text>
                        </div>
                    )}

                    {/* Main Table */}
                    {initialLoad ? (
                        <div className="ccm-loading">
                            <ModernSkeleton mode="section" />
                        </div>
                    ) : (
                        <div className="ccm-table-container">
                            <Table
                                dataSource={filteredCards}
                                columns={tableColumns}
                                rowKey={(record, index) => record.id || `new-${index}`}
                                className="ccm-table"
                                pagination={{
                                    defaultPageSize: 15,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '15', '25', '50'],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cards`,
                                }}
                                scroll={{ x: 900 }}
                                size="middle"
                                locale={{
                                    emptyText: (
                                        <div className="ccm-empty">
                                            <CreditCardOutlined style={{ fontSize: 48, color: '#d1d5db' }} />
                                            <Title level={4} type="secondary">No cards yet</Title>
                                            <Text type="secondary">Click "Add Card" to create your first card.</Text>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* ===== ADD / EDIT DRAWER ===== */}
                <Drawer
                    title={
                        <div className="drawer-title">
                            <CreditCardOutlined className="drawer-title-icon" />
                            <span>{editingIndex !== null ? 'Edit Credit Card' : 'Add New Credit Card'}</span>
                        </div>
                    }
                    placement="right"
                    width={560}
                    onClose={() => setDrawerOpen(false)}
                    open={drawerOpen}
                    className="ccm-drawer"
                    footer={
                        <div className="drawer-footer">
                            <Button
                                size="large"
                                onClick={() => setDrawerOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                onClick={handleDrawerSave}
                                className="drawer-save-btn"
                            >
                                {editingIndex !== null ? 'Update Card' : 'Add Card'}
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={drawerForm}
                        layout="vertical"
                        autoComplete="off"
                        className="drawer-form"
                    >
                        {/* SECTION 1: Basic Info */}
                        <div className="drawer-section">
                            <div className="drawer-section-header">
                                <span className="drawer-section-number">1</span>
                                <Text strong className="drawer-section-title">Basic Information</Text>
                            </div>

                            <Form.Item
                                label="Card Issuer Bank"
                                name="cardIssuer"
                                rules={[{ required: true, message: 'Please enter the bank name' }]}
                            >
                                <Input placeholder="e.g., HDFC Bank, Axis Bank, ICICI Bank" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Card Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter the card name' }]}
                            >
                                <Input placeholder="e.g., Regalia Gold, ACE, Millenia" size="large" />
                            </Form.Item>

                            <div className="drawer-row-2">
                                <Form.Item label="Annual Fee (₹)" name="annualfee">
                                    <Input placeholder="e.g., 500 or 0" size="large" />
                                </Form.Item>
                                <Form.Item label="Joining Fee (₹)" name="joiningfee">
                                    <Input placeholder="e.g., 500 or 0" size="large" />
                                </Form.Item>
                            </div>
                        </div>

                        <Divider />

                        {/* SECTION 2: Card Explorer Details (NEW) */}
                        <div className="drawer-section">
                            <div className="drawer-section-header">
                                <span className="drawer-section-number">2</span>
                                <Text strong className="drawer-section-title">Card Explorer Details</Text>
                                <Tag color="blue" className="new-badge">NEW</Tag>
                            </div>

                            <Form.Item label="Categories" name="categories">
                                <Select
                                    mode="multiple"
                                    placeholder="Select card categories..."
                                    options={CATEGORY_OPTIONS}
                                    size="large"
                                    className="categories-select"
                                    tagRender={({ label, value, closable, onClose }) => (
                                        <Tag
                                            color={CATEGORY_COLORS[value] || 'default'}
                                            closable={closable}
                                            onClose={onClose}
                                            style={{ marginRight: 4 }}
                                        >
                                            {value}
                                        </Tag>
                                    )}
                                />
                            </Form.Item>

                            <Form.Item label="Intro Offer" name="introOffer">
                                <Input.TextArea
                                    placeholder="e.g., 5000 reward points + complimentary lounge access"
                                    rows={2}
                                    size="large"
                                />
                            </Form.Item>

                            <div className="drawer-row-2">
                                <Form.Item label="Reward Rate" name="rewardRate">
                                    <Input placeholder="e.g., 3% → 36%" size="large" />
                                </Form.Item>
                                <Form.Item label="Rating (out of 5)" name="rating">
                                    <Input placeholder="e.g., 4.5" size="large" />
                                </Form.Item>
                            </div>

                            <Form.Item label="Card Image URL (optional)" name="cardImageUrl">
                                <Input placeholder="https://example.com/card-image.png" size="large" />
                            </Form.Item>
                        </div>

                        <Divider />

                        {/* SECTION 3: Platform Rewards */}
                        <div className="drawer-section">
                            <div className="drawer-section-header">
                                <span className="drawer-section-number">3</span>
                                <Text strong className="drawer-section-title">Platform Rewards (%)</Text>
                            </div>

                            <div className="drawer-rewards-grid">
                                {platformRewardFields.map(({ label, key, icon }) => (
                                    <Form.Item key={key} label={`${icon} ${label}`} name={key}>
                                        <Input placeholder="e.g., 5% or '-" size="large" />
                                    </Form.Item>
                                ))}
                            </div>
                        </div>

                        <Divider />

                        {/* SECTION 4: Additional Benefits */}
                        <div className="drawer-section">
                            <div className="drawer-section-header">
                                <span className="drawer-section-number">4</span>
                                <Text strong className="drawer-section-title">Additional Benefits</Text>
                            </div>

                            <div className="drawer-rewards-grid">
                                {additionalRewardFields.map(({ label, key, placeholder }) => (
                                    <Form.Item key={key} label={label} name={key}>
                                        <Input placeholder={placeholder} size="large" />
                                    </Form.Item>
                                ))}
                            </div>
                        </div>

                        <Divider />

                        {/* SECTION 5: Comments & Custom Rewards */}
                        <div className="drawer-section">
                            <div className="drawer-section-header">
                                <span className="drawer-section-number">5</span>
                                <Text strong className="drawer-section-title">Additional Info</Text>
                            </div>

                            <Form.Item label="Comments" name="comments">
                                <Input.TextArea
                                    placeholder="Any additional information about this card..."
                                    rows={3}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item label="Custom Features">
                                <Form.List name="list">
                                    {(subFields, subOpt) => (
                                        <div className="drawer-custom-rewards">
                                            {subFields.map((subField) => (
                                                <div key={subField.key} className="drawer-reward-item">
                                                    <div className="drawer-reward-inputs">
                                                        <Form.Item noStyle name={[subField.name, 'featureName']}>
                                                            <Input placeholder="Feature name" size="large" />
                                                        </Form.Item>
                                                        <Form.Item noStyle name={[subField.name, 'featureValue']}>
                                                            <Input placeholder="Value" size="large" />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="drawer-reward-inputs">
                                                        <Form.Item noStyle name={[subField.name, 'rewardCapping']}>
                                                            <Input placeholder="Reward capping" size="large" />
                                                        </Form.Item>
                                                        <Form.Item noStyle name={[subField.name, 'remarks']}>
                                                            <Input placeholder="Remarks" size="large" />
                                                        </Form.Item>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<CloseOutlined />}
                                                        onClick={() => subOpt.remove(subField.name)}
                                                        className="drawer-remove-feature-btn"
                                                        size="small"
                                                    />
                                                </div>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={() => subOpt.add()}
                                                icon={<PlusOutlined />}
                                                className="drawer-add-feature-btn"
                                                block
                                            >
                                                Add Custom Feature
                                            </Button>
                                        </div>
                                    )}
                                </Form.List>
                            </Form.Item>
                        </div>
                    </Form>
                </Drawer>
            </div>
        </ConfigProvider>
    );
}
