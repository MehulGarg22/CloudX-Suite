import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export default function CustomModal(props) {

  const {heading, content, isModalOpen, setIsModalOpen} = props;
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        title={heading}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >

        {content}
      </Modal>
    </>
  );
};