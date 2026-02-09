import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const getToken = async () => await AsyncStorage.getItem("token");

const authHeaders = async (isJSON = false) => {
  const token = await getToken();
  return {
    Authorization: `Bearer ${token}`,
    ...(isJSON ? { "Content-Type": "application/json" } : {}),
  };
};

/** Notices (public + admin) */
export const fetchNotices = async () => {
  try {
    const res = await fetch(`${API_URL}/notices`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const postNotice = async (title, message) => {
  try {
    const res = await fetch(`${API_URL}/notices`, {
      method: "POST",
      headers: await authHeaders(true),
      body: JSON.stringify({ title, message }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data?.error || "Failed to post notice." };
    return data;
  } catch {
    return { error: "Failed to post notice." };
  }
};

export const deleteNotice = async (id) => {
  try {
    const res = await fetch(`${API_URL}/notices/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data?.error || "Failed to delete notice." };
    return data;
  } catch {
    return { error: "Failed to delete notice." };
  }
};

/** Complaints (admin) */
export const fetchComplaints = async () => {
  try {
    const res = await fetch(`${API_URL}/complaints/admin`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const res = await fetch(`${API_URL}/complaints/${complaintId}/status`, {
      method: "PUT",
      headers: await authHeaders(true),
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data?.error || "Failed to update complaint status." };
    return data;
  } catch {
    return { error: "Failed to update complaint status." };
  }
};

/** Service Requests (admin) */
export const fetchServiceRequestsAdmin = async () => {
  try {
    const res = await fetch(`${API_URL}/service-requests/admin`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const updateServiceRequestStatus = async (requestId, status) => {
  try {
    const res = await fetch(`${API_URL}/service-requests/${requestId}/status`, {
      method: "PUT",
      headers: await authHeaders(true),
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: data?.error || "Failed to update service request status." };
    return data;
  } catch {
    return { error: "Failed to update service request status." };
  }
};
