import React, { useState } from 'react';
import AuthModal from '../components/auth/AuthModal';

const Auth = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthModal />
    </div>
  );
};

export default Auth;
