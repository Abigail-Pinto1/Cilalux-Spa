// src/utils/api.js
export const fetchDashboardData = async () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token;

  const res = await fetch("http://localhost:7000/api/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return await res.json();
};
