import { useEffect, useState, useMemo } from "react";
import { Tooltip, Modal, Button, ConfigProvider, Form, Input, Popconfirm } from "antd";
import { FileSyncOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import axios from 'axios';
import Notification from "../features/notification";
import { getSession } from "../../loginAuth/auth";
import AdminNavbar from "../../priviledges/admin/adminNavbar";
import UserNavigation from "../../priviledges/users/userNavigation";
import GuestNavbar from "../../priviledges/guestUser/guestUser";
import { LinearGradient } from 'react-text-gradients';
import './dashboard.css';

const suiteTheme = {
    token: {
        colorPrimary: '#DA5B9B',
        colorSuccess: '#06D6A0',
        colorWarning: '#FFD23F',
        colorError: '#EF476F',
        colorInfo: '#6B96F4',
        borderRadius: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        controlHeight: 44,
    },
    components: {
        Modal: {
            borderRadius: 20,
            headerBg: 'transparent',
            contentBg: 'white',
        },
        Button: {
            borderRadius: 12,
            fontWeight: 600,
        },
        Input: {
            borderRadius: 8,
            paddingBlock: 10,
            paddingInline: 14,
        },
        Form: {
            labelFontSize: 14,
            labelColor: '#2D1B69',
            labelFontWeight: 600,
        },
    },
};

const CARDS_PER_PAGE = 6;

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [blogData, setBlogData] = useState("");
    const [updateBlogId, setUpdateBlogId] = useState("");
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState();
    const [tableLoading, setTableLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCards, setExpandedCards] = useState({});

    const { TextArea } = Input;

    const blogUpdateApi = "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/update";
    const blogPostApi = "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/post";
    const blogDeleteApi = "https://6bx93syy1g.execute-api.us-east-1.amazonaws.com/blog/delete";

    // ── Handlers ────────────────────────────
    const handleNewBlog = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleUpdateBlog = (blogId) => {
        setUpdateBlogId(blogId);
        setIsUpdateModalOpen(true);
    };
    const handleUpdateCancel = () => setIsUpdateModalOpen(false);

    let formData = new FormData();
    const onfileChange = (e) => {
        if (e.target && e.target.files[0]) {
            formData.append("File_Name", e.target.files[0]);
            setFile(e.target.files[0]);
        }
    };

    // ── API Calls ───────────────────────────
    const getBlogs = async () => {
        setTableLoading(true);
        const params = { email: sessionStorage.getItem("email") };
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            axios.post(process.env.REACT_APP_BASE_URL + process.env.REACT_APP_BLOGS_FETCH, params, {
                headers: { Authorization: token }
            }).then((res) => {
                setBlogData(res.data.body.items);
                setTableLoading(false);
            });
        } catch (err) {
            console.log(err);
            setTableLoading(false);
        }
    };

    useEffect(() => { getBlogs(); }, []);

    const handleNewBlogSubmit = async () => {
        setLoading(true);
        let email = sessionStorage.getItem("email");
        const params = { email, title, description };
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            axios.post(process.env.REACT_APP_BASE_URL + process.env.REACT_APP_BLOGS_POST, params, {
                headers: { Authorization: token }
            }).then((res) => {
                setMessage('Success!');
                setNotificationDescription('The blog is successfully created');
                setType('success');
                setLoading(false);
                handleCancel();
                getBlogs();
            });
        } catch (err) {
            console.log(err);
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to create the blog. Please try again later.');
            setType('error');
            setLoading(false);
        }
        setTitle("");
        setDescription("");
    };

    const handleUpdateBlogSubmit = async () => {
        let email = sessionStorage.getItem("email");
        const params = { email, blogId: updateBlogId, title: updateTitle, description: updateDescription };
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            axios.post(process.env.REACT_APP_BASE_URL + process.env.REACT_APP_BLOGS_UPDATE, params, {
                headers: { Authorization: token }
            }).then((res) => {
                setMessage('Success!');
                setNotificationDescription('The blog is successfully updated');
                setType('success');
                handleUpdateCancel();
                getBlogs();
            });
        } catch (err) {
            console.log(err);
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to update the blog. Please try again later.');
            setType('error');
        }
    };

    const handleBlogDelete = async (blogId) => {
        let email = sessionStorage.getItem("email");
        const params = { email, blogId };
        try {
            const session = await getSession();
            const token = session.getIdToken().getJwtToken();
            axios.delete(process.env.REACT_APP_BASE_URL + process.env.REACT_APP_BLOGS_DELETE, {
                data: params,
                headers: { Authorization: token }
            }).then((res) => {
                setMessage('Success!');
                setNotificationDescription('The blog is successfully deleted');
                setType('success');
                getBlogs();
            });
        } catch (err) {
            console.log(err);
            setMessage('Oops! Something went wrong.');
            setNotificationDescription('We were unable to delete the blog. Please try again later.');
            setType('error');
        }
    };

    // ── Search & Pagination ─────────────────
    const filteredBlogs = useMemo(() => {
        if (!blogData || !Array.isArray(blogData)) return [];
        if (!searchQuery.trim()) return blogData;
        const q = searchQuery.toLowerCase();
        return blogData.filter(
            blog => blog.title?.toLowerCase().includes(q) || blog.description?.toLowerCase().includes(q)
        );
    }, [blogData, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / CARDS_PER_PAGE));
    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
    );

    // Reset to page 1 when search changes
    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const toggleExpand = (blogId) => {
        setExpandedCards(prev => ({ ...prev, [blogId]: !prev[blogId] }));
    };

    // ── Navbar by Role ──────────────────────
    const role = sessionStorage.getItem("role");
    const renderNavbar = () => {
        switch (role) {
            case 'Administrator': return <AdminNavbar />;
            case 'Guest User': return <GuestNavbar />;
            default: return <UserNavigation />;
        }
    };

    // ── Loading Skeleton ────────────────────
    const renderSkeleton = () => (
        <div className="blog-loading-grid">
            {[1, 2, 3].map(i => (
                <div className="blog-skeleton-card" key={i}>
                    <div className="blog-skeleton-accent" />
                    <div className="blog-skeleton-body">
                        <div className="blog-skeleton-line title" />
                        <div className="blog-skeleton-line desc1" />
                        <div className="blog-skeleton-line desc2" />
                        <div className="blog-skeleton-line desc3" />
                    </div>
                </div>
            ))}
        </div>
    );

    // ── Empty State ─────────────────────────
    const renderEmptyState = () => (
        <div className="blog-empty-state">
            <span className="blog-empty-icon">📝</span>
            <h3 className="blog-empty-title">
                {searchQuery ? "No blogs match your search" : "No blogs yet"}
            </h3>
            <p className="blog-empty-subtitle">
                {searchQuery
                    ? `We couldn't find any blogs matching "${searchQuery}". Try a different search term.`
                    : "Your blog journey starts here! Create your first blog post and share your ideas with the world."
                }
            </p>
            {!searchQuery && (
                <button className="blog-create-btn" onClick={handleNewBlog}>
                    <span className="blog-create-btn-icon"><PlusOutlined /></span>
                    Create Your First Blog
                </button>
            )}
        </div>
    );

    // ── Render ──────────────────────────────
    return (
        <>
            {renderNavbar()}

            <ConfigProvider theme={suiteTheme}>
                <div className="dashboardContainer" >
                    <Notification type={type} message={message} description={notificationDescription} />

                    {/* ── Create Modal ──────────────── */}
                    <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        className="blog-modal"
                        width={560}
                        centered
                        closable
                        footer={[
                            <Button
                                key="save"
                                type="primary"
                                loading={loading}
                                onClick={handleNewBlogSubmit}
                                className="blog-modal-save-btn"
                            >
                                Publish Blog
                            </Button>
                        ]}
                    >
                        <div className="blog-modal-gradient-bar" />
                        <div className="blog-modal-header">
                            <h2 className="blog-modal-title">Create New Blog</h2>
                            <p className="blog-modal-subtitle">Share your thoughts with the community</p>
                        </div>

                        <Form layout="vertical">
                            <Form.Item label="Title">
                                <div className="blog-modal-input-group">
                                    <Input
                                        placeholder="Enter a catchy blog title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <Tooltip title="Enter a descriptive title for your blog post">
                                        <IoMdInformationCircleOutline className="blog-modal-tooltip" />
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Description">
                                <div className="blog-modal-input-group">
                                    <TextArea
                                        rows={4}
                                        placeholder="Write your blog content here..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <Tooltip title="The main content of your blog post">
                                        <IoMdInformationCircleOutline className="blog-modal-tooltip" />
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Blog Image (Optional)">
                                <div className="blog-file-upload-zone">
                                    <MdCloudUpload className="blog-upload-icon" />
                                    <p className="blog-upload-text">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="blog-upload-hint">PNG, JPG up to 5MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onfileChange}
                                        className="blog-file-input"
                                    />
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* ── Update Modal ──────────────── */}
                    <Modal
                        open={isUpdateModalOpen}
                        onCancel={handleUpdateCancel}
                        className="blog-modal"
                        width={560}
                        centered
                        closable
                        footer={[
                            <Button
                                key="update"
                                type="primary"
                                loading={loading}
                                onClick={handleUpdateBlogSubmit}
                                className="blog-modal-save-btn"
                            >
                                Save Changes
                            </Button>
                        ]}
                    >
                        <div className="blog-modal-gradient-bar" />
                        <div className="blog-modal-header">
                            <h2 className="blog-modal-title">Update Blog</h2>
                            <p className="blog-modal-subtitle">Edit your blog post details</p>
                        </div>

                        <Form layout="vertical">
                            <Form.Item label="Title">
                                <div className="blog-modal-input-group">
                                    <Input
                                        placeholder="Update your blog title..."
                                        onChange={(e) => setUpdateTitle(e.target.value)}
                                    />
                                    <Tooltip title="Update the title of your blog post">
                                        <IoMdInformationCircleOutline className="blog-modal-tooltip" />
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Description">
                                <div className="blog-modal-input-group">
                                    <TextArea
                                        rows={4}
                                        placeholder="Update your blog content..."
                                        onChange={(e) => setUpdateDescription(e.target.value)}
                                    />
                                    <Tooltip title="Update the content of your blog post">
                                        <IoMdInformationCircleOutline className="blog-modal-tooltip" />
                                    </Tooltip>
                                </div>
                            </Form.Item>
                            <Form.Item label="Blog Image (Optional)">
                                <div className="blog-file-upload-zone">
                                    <MdCloudUpload className="blog-upload-icon" />
                                    <p className="blog-upload-text">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="blog-upload-hint">PNG, JPG up to 5MB</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onfileChange}
                                        className="blog-file-input"
                                    />
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* ── Hero Header ──────────────── */}
                    <div className="blog-hero">
                        <div className="blog-hero-content">
                            <h1 className="blog-hero-title">
                                <LinearGradient gradient={['to right', '#DA5B9B', '#6B96F4']}>
                                    Published Blogs
                                </LinearGradient>
                            </h1>
                            <p className="blog-hero-subtitle">
                                Manage, create, and share your blog posts with the community
                            </p>
                        </div>
                    </div>

                    {/* ── Stats Bar ────────────────── */}
                    {!tableLoading && blogData && Array.isArray(blogData) && (
                        <div className="blog-stats-bar">
                            <div className="blog-stat-chip">
                                <span className="blog-stat-icon"><HiDocumentText /></span>
                                <span className="blog-stat-value">{blogData.length}</span>
                                <span>{blogData.length === 1 ? 'Blog' : 'Blogs'}</span>
                            </div>
                            {searchQuery && (
                                <div className="blog-stat-chip">
                                    <span className="blog-stat-icon"><SearchOutlined /></span>
                                    <span className="blog-stat-value">{filteredBlogs.length}</span>
                                    <span>{filteredBlogs.length === 1 ? 'Result' : 'Results'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Toolbar ──────────────────── */}
                    <div className="blog-toolbar">
                        <div className="blog-search-wrapper">
                            <SearchOutlined className="blog-search-icon" />
                            <input
                                type="text"
                                className="blog-search-input"
                                placeholder="Search blogs by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                id="blog-search"
                            />
                        </div>
                        <button className="blog-create-btn" onClick={handleNewBlog} id="create-blog-btn">
                            <span className="blog-create-btn-icon"><PlusOutlined /></span>
                            Create New Blog
                        </button>
                    </div>

                    {/* ── Content ──────────────────── */}
                    {tableLoading ? (
                        renderSkeleton()
                    ) : !filteredBlogs.length ? (
                        renderEmptyState()
                    ) : (
                        <>
                            <div className="blog-card-grid">
                                {paginatedBlogs.map((blog, index) => {
                                    const isExpanded = expandedCards[blog.blogId];
                                    const shouldTruncate = blog.description && blog.description.length > 150;

                                    return (
                                        <div className="blog-card" key={blog.blogId}>
                                            <div className="blog-card-accent" />
                                            <div className="blog-card-body">
                                                <div className="blog-card-header">
                                                    <span className="blog-card-number">
                                                        {(currentPage - 1) * CARDS_PER_PAGE + index + 1}
                                                    </span>
                                                    <h3 className="blog-card-title">{blog.title}</h3>
                                                </div>

                                                <p className={`blog-card-description${!isExpanded && shouldTruncate ? ' clamped' : ''}`}>
                                                    {blog.description}
                                                </p>

                                                {shouldTruncate && (
                                                    <button
                                                        className="blog-read-more-btn"
                                                        onClick={() => toggleExpand(blog.blogId)}
                                                    >
                                                        {isExpanded ? '← Show less' : 'Read more →'}
                                                    </button>
                                                )}

                                                <div className="blog-card-footer">
                                                    <Tooltip title="Edit Blog">
                                                        <button
                                                            className="blog-action-btn edit-btn"
                                                            onClick={() => handleUpdateBlog(blog.blogId)}
                                                            aria-label="Edit blog"
                                                        >
                                                            <FileSyncOutlined />
                                                        </button>
                                                    </Tooltip>
                                                    <Popconfirm
                                                        title="Delete this blog?"
                                                        description="This action cannot be undone."
                                                        onConfirm={() => handleBlogDelete(blog.blogId)}
                                                        okText="Delete"
                                                        cancelText="Cancel"
                                                        overlayClassName="blog-popconfirm"
                                                    >
                                                        <Tooltip title="Delete Blog">
                                                            <button
                                                                className="blog-action-btn delete-btn"
                                                                aria-label="Delete blog"
                                                            >
                                                                <DeleteOutlined />
                                                            </button>
                                                        </Tooltip>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── Pagination ──────────── */}
                            {filteredBlogs.length > CARDS_PER_PAGE && (
                                <div className="blog-pagination-wrapper">
                                    <span className="blog-pagination-info">
                                        Showing {(currentPage - 1) * CARDS_PER_PAGE + 1}–
                                        {Math.min(currentPage * CARDS_PER_PAGE, filteredBlogs.length)} of{' '}
                                        {filteredBlogs.length} blogs
                                    </span>
                                    <div className="blog-pagination-controls">
                                        <button
                                            className="blog-page-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                        >
                                            ←
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`blog-page-btn ${page === currentPage ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            className="blog-page-btn"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </ConfigProvider>
        </>
    );
}