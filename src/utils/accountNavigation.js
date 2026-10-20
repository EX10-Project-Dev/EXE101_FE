// Chỉ chọn trang đích từ role đã có trong user của session hiện tại.
// Không suy đoán quyền theo tên/email và không sửa token hoặc tự cấp role.
export function isMerchant(user) {
  const roles = [user?.role, ...(Array.isArray(user?.roles) ? user.roles : [])]
  return roles.some(role => typeof role === 'string' && role.trim().toLowerCase() === 'merchant')
}

// Dùng chung cho đăng nhập email, Google và liên kết tài khoản để tránh
// mỗi nơi điều hướng một kiểu. Role khác hoặc chưa có role vẫn vào B2C như trước.
export function getAccountHome(user) {
  return isMerchant(user) ? '/merchant' : '/discover'
}
