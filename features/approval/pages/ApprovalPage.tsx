import ApprovalList from '../components/ApprovalList';
import ApprovalDetail from '../components/ApprovalDetail';

const ApprovalPage = () => {
  return (
    <div>
      <h1>Quản lý duyệt phiếu đăng ký</h1>
      <ApprovalList />
      <ApprovalDetail />
    </div>
  );
};

export default ApprovalPage; 