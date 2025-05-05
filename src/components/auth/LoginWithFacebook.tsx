/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { LoginSocialFacebook, IResolveParams } from 'reactjs-social-login'; // Import từ thư viện mới
// Thay thế: import FacebookLogin, { ReactFacebookLoginInfo, ReactFacebookFailureResponse } from 'react-facebook-login';
import { FacebookLoginButton } from 'react-social-login-buttons'; // Thư viện nút bấm phổ biến (tùy chọn)
import { useFacebookLoginMutation } from '@/hooks/queries/auth.queries';
import EmailCollectionModal from './EmailCollectionModal';
import { toast } from 'sonner';
const FACEBOOK_APP_ID = '1337377354382081';

const LoginWithFacebook: React.FC = () => {
  const facebookLoginMutation = useFacebookLoginMutation({
    onSuccess: (data) => {
      console.log('Facebook login successful:', data);
      toast.success('Đăng nhập Facebook thành công!');
      window.location.href = '/'; // Chuyển hướng về trang chính sau khi đăng nhập thành công
    },
    onError: (error) => {
      console.error('Facebook login error:', error);
      toast.error('Đăng nhập Facebook thất bại.');
    },
  });

  // New state for email collection modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [fbAccessToken, setFbAccessToken] = useState<string | null>(null);

  const handleResolve = ({ provider, data }: IResolveParams) => {
    if (provider === 'facebook' && data?.accessToken) {
      if (data.email) {
        // Có email -> Đăng nhập/Đăng ký bình thường
        facebookLoginMutation.mutate({ accessToken: data.accessToken });
      } else {
        // Không có email -> Mở modal yêu cầu nhập
        setFbAccessToken(data.accessToken);
        setShowCompleteModal(true);
      }
    } else {
      console.error(
        'Facebook login success but missing access token or wrong provider:',
        provider,
        data
      );
      // toast.error('Đăng nhập Facebook thất bại, không nhận được thông tin cần thiết.');
    }
  };

  const handleReject = (error: any) => {
    console.error('Facebook Login Failed:', error);
    toast.error('Đăng nhập bằng Facebook thất bại hoặc đã bị hủy.');
  };

  if (!FACEBOOK_APP_ID) {
    console.error('Facebook App ID is not configured.');
    return <p>Lỗi cấu hình đăng nhập Facebook.</p>;
  }
  const handleCompleteSuccess = () => {
    // Hiển thị thông báo yêu cầu check mail (không chuyển hướng login ngay)
    toast.info(
      'Vui lòng kiểm tra email bạn vừa cung cấp để xác thực tài khoản.'
    );
  };
  return (
    <div>
      <LoginSocialFacebook
        appId={FACEBOOK_APP_ID}
        onResolve={handleResolve}
        onReject={handleReject}
        // Các trường yêu cầu thêm (scope) nếu cần
        fields="name,email,picture" // Giống như trước
      >
        <FacebookLoginButton
          style={{
            width: '100%',
            fontSize: '14px',
            borderRadius: '4px',
            height: '42px',
          }}
        />
        {/* Hoặc nút tùy chỉnh của bạn: */}
        {/* <button>Đăng nhập bằng Facebook (Custom)</button> */}
      </LoginSocialFacebook>
      <EmailCollectionModal
        open={showCompleteModal && !!fbAccessToken}
        onClose={() => setShowCompleteModal(false)}
        facebookAccessToken={fbAccessToken}
        onSuccess={handleCompleteSuccess}
      />
      {/* {facebookLoginMutation.isError && <p style={{ color: 'red' }}>{facebookLoginMutation.error?.message}</p>} */}
    </div>
  );
};

export default LoginWithFacebook;
