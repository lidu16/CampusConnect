/** Primary super admin — always has admin rights on login */
export const SUPER_ADMIN_EMAIL = 'lidiyamesenbet16@gmail.com';

export const isSuperAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
};
