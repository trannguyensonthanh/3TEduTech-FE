import React, { useState } from 'react';
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/hooks/queries/auth.queries'; // Import hook
import { toast } from 'sonner';

const GOOGLE_CLIENT_ID =
  '842841125748-m1iqnlla8aifbfpfj3fpfandvh33n5vc.apps.googleusercontent.com'; // Lấy Client ID từ biến môi trường frontend

const LoginWithGoogle: React.FC = () => {
  const googleLoginMutation = useGoogleLoginMutation({
    onSuccess: (data) => {
      console.log('Google login successful:', data);
      toast.success('Đăng nhập Google thành công!');
      window.location.href = '/'; // Chuyển hướng về trang chính sau khi đăng nhập thành công
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Đăng nhập Google thất bại.');
    },
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Google Credential Response:', credentialResponse);
    if (credentialResponse.credential) {
      // credential chính là ID Token
      googleLoginMutation.mutate({ idToken: credentialResponse.credential });
    } else {
      console.error('Google login did not return credential (ID Token).');
      // toast.error('Đăng nhập Google thất bại, không nhận được thông tin.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    // toast.error('Đăng nhập bằng Google thất bại.');
  };

  if (!GOOGLE_CLIENT_ID) {
    console.error(
      'Google Client ID is not configured in frontend environment variables.'
    );
    return <p>Lỗi cấu hình đăng nhập Google.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap // Tùy chọn: hiển thị popup one-tap
          // Các props khác nếu cần: shape, theme, size, text...
          // shape="pill"
          // theme="filled_black"
          // size="large"
        />
        {googleLoginMutation.isPending && <p>Đang xử lý đăng nhập Google...</p>}
        {/* Có thể hiển thị lỗi từ mutation ở đây nếu cần */}
        {/* {googleLoginMutation.isError && <p style={{ color: 'red' }}>{googleLoginMutation.error?.message}</p>} */}
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginWithGoogle;
